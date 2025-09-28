"use client";

import { useAuth } from '@/hooks/useAuth'
import { useGoogleDriveRecordings } from '@/hooks/useGoogleDrive'
import { useGoogleMeetings } from '@/hooks/useGoogleMeetings'
import { TopNavbar } from '@/components/dashboard/TopNavbar'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import { MainActions } from '@/components/dashboard/MainActions'
import { RecentSummaries } from '@/components/dashboard/RecentSummaries'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Footer } from '@/components/dashboard/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


// Mock data สำหรับ summaries
const mockSummaries = [
  { id: '1', title: 'Project Kickoff Meeting', date: '20 Sep 2025', duration: '45 นาที' },
  { id: '2', title: 'Weekly Sync', date: '15 Sep 2025', duration: '30 นาที' },
  { id: '3', title: 'Client Onboarding', date: '12 Sep 2025', duration: '60 นาที' }
]

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const { meetings, isLoading: meetingsLoading, error: meetingsError } = useGoogleMeetings()
  const { 
    recordings, 
    isLoading: recordingsLoading, 
    error: recordingsError, 
    refetch: refetchRecordings,
    clearError 
  } = useGoogleDriveRecordings()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
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

  const handleViewAllRecordings = () => {
    router.push('/recordings')
  }

  const handleCreateSummary = () => {
    router.push('/create-summary')
  }

  const handleFileSelect = (files: FileList) => {
    console.log('Selected files:', files)
    // Handle local file upload
  }

  const handleSelectGoogleDriveFile = (fileId: string) => {
    console.log('Selected Google Drive file:', fileId)
    // Handle Google Drive file selection
    router.push(`/create-summary?source=drive&fileId=${fileId}`)
  }

  const handleViewSummary = (id: string) => {
    router.push(`/summary/${id}`)
  }

  const handleShareSummary = (id: string) => {
    console.log('Share summary:', id)
  }

  const handleSummarizeMeeting = () => {
    console.log('Quick summarize meeting')
  }

  const handleQuickShare = () => {
    console.log('Quick share')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeSection 
          userName={user.name || 'User'}
          upcomingMeetings={meetings.slice(0, 3)} // แสดง 3 การประชุมล่าสุด
        />

        <MainActions
          recentRecordings={recordings}
          recordingsLoading={recordingsLoading}
          recordingsError={recordingsError}
          onViewAllRecordings={handleViewAllRecordings}
          onCreateSummary={handleCreateSummary}
          onFileSelect={handleFileSelect}
          onSelectGoogleDriveFile={handleSelectGoogleDriveFile}
          onRefreshRecordings={refetchRecordings}
        />

        <RecentSummaries
          summaries={mockSummaries}
          onViewSummary={handleViewSummary}
          onShareSummary={handleShareSummary}
        />

        <QuickActions
          onSummarizeMeeting={handleSummarizeMeeting}
          onShareSummary={handleQuickShare}
        />

        <Footer />
      </div>
    </div>
  )
}