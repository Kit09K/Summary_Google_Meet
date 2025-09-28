import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
      const session = await auth()
      
      if (!session?.accessToken) {
        return NextResponse.json({ 
          error: 'Unauthorized',
          message: 'กรุณาเข้าสู่ระบบใหม่'
        }, { status: 401 })
      }
  
      const now = new Date()
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
      const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${oneMonthAgo.toISOString()}&` +
        `timeMax=${oneMonthFromNow.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime&` +
        `maxResults=50`
  
      console.log('📅 Calendar API URL:', calendarUrl)
  
      const calendarResponse = await fetch(calendarUrl, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
  
      console.log('📅 Calendar API Response Status:', calendarResponse.status)
  
      if (!calendarResponse.ok) {
        const errorText = await calendarResponse.text()
        console.log('❌ Calendar API Error:', errorText)
        
        if (calendarResponse.status === 401) {
          return NextResponse.json({ 
            error: 'Token expired',
            message: 'กรุณาเข้าสู่ระบบใหม่',
            needsReauth: true
          }, { status: 401 })
        }
  
        throw new Error(`Calendar API Error: ${calendarResponse.status} - ${errorText}`)
      }
  
      const calendarData = await calendarResponse.json()
      console.log('✅ Calendar API Success:', {
        totalEvents: calendarData.items?.length || 0
      })
      
      const meetings = calendarData.items?.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Untitled Meeting',
        startTime: event.start?.dateTime || event.start?.date,
        endTime: event.end?.dateTime || event.end?.date,
        duration: event.start?.dateTime && event.end?.dateTime 
          ? `${Math.round((new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) / 60000)} นาที`
          : 'Unknown',
        meetLink: event.hangoutLink,
        attendees: event.attendees?.length || 0,
        description: event.description,
        source: 'google_calendar'
      })) || []
  
      return NextResponse.json({ meetings })
  
    } catch (error) {
      console.error('❌ Calendar API Error:', error)
      return NextResponse.json({ 
        error: 'Internal Server Error',
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Calendar',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
  }