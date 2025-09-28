"use client";

import { useAuth } from '@/hooks/useAuth'
import { useGoogleDriveRecordings } from '@/hooks/useGoogleDrive'
import { TopNavbar } from '@/components/dashboard/TopNavbar'
import { VideoRecordingsGrid } from '@/components/dashboard/VideoRecordingsGrid'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RecordingsPage() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const { 
    recordings, 
    isLoading: recordingsLoading, 
    error: recordingsError, 
    refetch: refetchRecordings 
  } = useGoogleDriveRecordings()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleCreateSummary = (selectedRecordings: any[]) => {
    console.log('Create summary for recordings:', selectedRecordings)
    // Navigate to summary creation page with selected recordings
    if (selectedRecordings.length > 0) {
      const recordingIds = selectedRecordings.map(r => r.id).join(',')
      router.push(`/create-summary?recordings=${recordingIds}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {recordingsError ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-red-600 mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-red-500 mb-4">{recordingsError.message}</p>
            <button
              onClick={refetchRecordings}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        ) : (
          <VideoRecordingsGrid
            recordings={recordings}
            isLoading={recordingsLoading}
            onCreateSummary={handleCreateSummary}
            onRefresh={refetchRecordings}
          />
        )}
      </div>
    </div>
  )
}