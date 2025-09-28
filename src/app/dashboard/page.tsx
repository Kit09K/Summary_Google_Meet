"use client";

import { useAuth } from '@/hooks/useAuth'
import { TopNavbar } from '@/components/dashboard/TopNavbar'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import { MainActions } from '@/components/dashboard/MainActions'
import { RecentSummaries } from '@/components/dashboard/RecentSummaries'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Footer } from '@/components/dashboard/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock data - in real app, this would come from API calls
const mockData = {
  upcomingMeetings: [
    { id: '1', title: 'Weekly Team Sync', time: '10:00 AM', date: 'Today' },
    { id: '2', title: 'Project Review', time: '2:00 PM', date: 'Tomorrow' },
    { id: '3', title: 'Client Presentation', time: '9:00 AM', date: 'Friday' }
  ],
  recentRecordings: [
    { id: '1', title: 'Marketing Review 2025-09-20.mp4', size: '245 MB', date: '2 days ago' },
    { id: '2', title: 'Team Standup 2025-09-18.mp4', size: '180 MB', date: '4 days ago' },
    { id: '3', title: 'Product Demo 2025-09-15.mp4', size: '320 MB', date: '1 week ago' }
  ],
  recentSummaries: [
    { id: '1', title: 'Project Kickoff Meeting', date: '20 Sep 2025', duration: '45 นาที' },
    { id: '2', title: 'Weekly Sync', date: '15 Sep 2025', duration: '30 นาที' },
    { id: '3', title: 'Client Onboarding', date: '12 Sep 2025', duration: '60 นาที' }
  ]
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [data] = useState(mockData)

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
    console.log('View all recordings')
    // Navigate to recordings page
  }

  const handleCreateSummary = () => {
    console.log('Create new summary')
    // Navigate to create summary page
  }

  const handleFileSelect = (files: FileList) => {
    console.log('Selected files:', files)
    // Handle file upload
  }

  const handleViewSummary = (id: string) => {
    console.log('View summary:', id)
    // Navigate to summary details
    router.push(`/summary/${id}`)
  }

  const handleShareSummary = (id: string) => {
    console.log('Share summary:', id)
    // Open share modal or copy link
  }

  const handleSummarizeMeeting = () => {
    console.log('Quick summarize meeting')
    // Open quick summarize modal
  }

  const handleQuickShare = () => {
    console.log('Quick share')
    // Open quick share modal
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeSection 
          userName={user.name || 'User'}
          upcomingMeetings={data.upcomingMeetings}
        />

        <MainActions
          recentRecordings={data.recentRecordings}
          onViewAllRecordings={handleViewAllRecordings}
          onCreateSummary={handleCreateSummary}
          onFileSelect={handleFileSelect}
        />

        <RecentSummaries
          summaries={data.recentSummaries}
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
