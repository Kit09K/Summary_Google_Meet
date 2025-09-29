import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.accessToken) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'กรุณาเข้าสู่ระบบใหม่',
        needsReauth: true
      }, { status: 401 })
    }

    // ตรวจสอบว่า API ถูกเปิดใช้งานหรือไม่
    const driveUrl = 'https://www.googleapis.com/drive/v3/about?fields=user'
    
    const testResponse = await fetch(driveUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!testResponse.ok) {
      const errorData = await testResponse.json()
      console.error('Google Drive API Error:', errorData)
      
      // ตรวจสอบว่าเป็น API ที่ไม่ได้เปิดใช้งานหรือไม่
      if (errorData.error?.code === 403 && 
          errorData.error?.message?.includes('has not been used in project')) {
        return NextResponse.json({
          error: 'API_NOT_ENABLED',
          message: 'Google Drive API ยังไม่ได้เปิดใช้งาน',
          details: 'กรุณาเปิดใช้งาน Google Drive API ใน Google Cloud Console',
          setupUrl: `https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=${process.env.GOOGLE_CLOUD_PROJECT_ID}`,
          needsSetup: true
        }, { status: 403 })
      }

      if (errorData.error?.code === 401) {
        return NextResponse.json({
          error: 'Token expired',
          message: 'กรุณาเข้าสู่ระบบใหม่',
          needsReauth: true
        }, { status: 401 })
      }

      return NextResponse.json({
        error: 'API_ERROR',
        message: 'เกิดข้อผิดพลาดจาก Google API',
        details: errorData.error?.message || 'Unknown error'
      }, { status: testResponse.status })
    }

    // ถ้าผ่านการทดสอบแล้ว ให้ดึงข้อมูลไฟล์
    const query = "mimeType contains 'video/' or mimeType contains 'audio/'"
    const fields = "files(id,name,size,createdTime,webViewLink,thumbnailLink,mimeType)"
    
    const filesUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&orderBy=createdTime desc&pageSize=40`
    
    const filesResponse = await fetch(filesUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!filesResponse.ok) {
      const errorData = await filesResponse.json()
      throw new Error(`Failed to fetch files: ${errorData.error?.message}`)
    }

    const filesData = await filesResponse.json()
    
    const recordings = filesData.files?.map((file: any) => ({
      id: file.id,
      title: file.name,
      size: file.size ? `${Math.round(parseInt(file.size) / (1024 * 1024))} MB` : 'Unknown',
      date: file.createdTime ? new Date(file.createdTime).toLocaleDateString('th-TH') : 'Unknown',
      webViewLink: file.webViewLink,
      thumbnailLink: file.thumbnailLink,
      duration: 'Unknown',
      source: 'google_drive',
      mimeType: file.mimeType
    })) || []

    return NextResponse.json({ 
      recordings,
      totalCount: recordings.length,
      hasMore: !!filesData.nextPageToken
    })

  } catch (error) {
    console.error('Drive API Error:', error)
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Drive',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}