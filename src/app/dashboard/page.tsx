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

// 'use client'
// import { useState } from 'react';

// const DashboardPage = () => {
//   const [user] = useState({
//     name: 'Kittayot',
//     email: 'kittayot@example.com',
//     image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
//   });

//   const [upcomingMeetings] = useState([
//     { id: 1, title: 'Weekly Team Sync', time: '10:00 AM', date: 'Today' },
//     { id: 2, title: 'Project Review', time: '2:00 PM', date: 'Tomorrow' },
//     { id: 3, title: 'Client Presentation', time: '9:00 AM', date: 'Friday' }
//   ]);

//   const [recentSummaries] = useState([
//     { id: 1, title: 'Project Kickoff Meeting', date: '20 Sep 2025', duration: '45 นาที' },
//     { id: 2, title: 'Weekly Sync', date: '15 Sep 2025', duration: '30 นาที' },
//     { id: 3, title: 'Client Onboarding', date: '12 Sep 2025', duration: '60 นาที' }
//   ]);

//   const [recentRecordings] = useState([
//     { id: 1, title: 'Marketing Review 2025-09-20.mp4', size: '245 MB', date: '2 days ago' },
//     { id: 2, title: 'Team Standup 2025-09-18.mp4', size: '180 MB', date: '4 days ago' },
//     { id: 3, title: 'Product Demo 2025-09-15.mp4', size: '320 MB', date: '1 week ago' }
//   ]);

//   const handleLogout = () => {
//     // NextAuth logout would go here
//     // signOut({ callbackUrl: '/login' });
//     console.log('Logging out...');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navbar */}
//       <nav className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//               <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <h1 className="text-xl font-bold text-gray-900">MeetSummary</h1>
//           </div>

//           {/* User Profile */}
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-3">
//               <img
//                 src={user.image}
//                 alt={user.name}
//                 className="w-10 h-10 rounded-full border-2 border-gray-200"
//               />
//               <div className="hidden md:block">
//                 <p className="text-sm font-medium text-gray-900">{user.name}</p>
//                 <p className="text-xs text-gray-500">{user.email}</p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             สวัสดี {user.name} 👋
//           </h2>
//           <p className="text-gray-600 text-lg">วันนี้คุณมี Meeting อะไรบ้าง?</p>
          
//           {/* Upcoming Meetings */}
//           <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">การประชุมที่กำลังจะมาถึง</h3>
//             <div className="space-y-3">
//               {upcomingMeetings.map((meeting) => (
//                 <div key={meeting.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                   <div>
//                     <p className="font-medium text-gray-900">{meeting.title}</p>
//                     <p className="text-sm text-gray-600">{meeting.date} • {meeting.time}</p>
//                   </div>
//                   <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
//                     เข้าร่วม
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Main Actions */}
//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           {/* Recordings Card */}
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5 6m14-2l2 2m-2-2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">🔹 Recordings จาก Google Drive</h3>
//                   <p className="text-sm text-gray-600">ดูไฟล์บันทึกการประชุม</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-4">
//               <div className="space-y-3 mb-4">
//                 {recentRecordings.map((recording) => (
//                   <div key={recording.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
//                         <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900 text-sm">{recording.title}</p>
//                         <p className="text-xs text-gray-500">{recording.size} • {recording.date}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
//                 ดูไฟล์ทั้งหมด
//               </button>
//             </div>
//           </div>

//           {/* Create Summary Card */}
//           <div className="bg-white rounded-xl border border-gray-200 p-6">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">🔹 สร้างสรุปใหม่</h3>
//                 <p className="text-sm text-gray-600">เลือกไฟล์ recording เพื่อทำสรุป</p>
//               </div>
//             </div>
//             <div className="space-y-3 mb-4">
//               <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                 </svg>
//                 <p className="text-gray-600 mb-2">ลากไฟล์มาวางที่นี่ หรือ</p>
//                 <button className="text-blue-600 hover:text-blue-700 font-medium">เลือกไฟล์</button>
//               </div>
//             </div>
//             <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
//               เริ่มสร้างสรุป
//             </button>
//           </div>
//         </div>

//         {/* Recent Summaries */}
//         <div className="bg-white rounded-xl border border-gray-200 mb-8">
//           <div className="p-6 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900">การสรุปล่าสุด</h3>
//             <p className="text-sm text-gray-600">การสรุปการประชุมที่คุณเคยทำ</p>
//           </div>
//           <div className="p-6">
//             <div className="space-y-4">
//               {recentSummaries.map((summary) => (
//                 <div key={summary.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">{summary.title}</h4>
//                       <p className="text-sm text-gray-500">{summary.date} • {summary.duration}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//                       </svg>
//                     </button>
//                     <button className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-50">
//                       ดูสรุป
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
//             <div className="flex items-center justify-center space-x-3">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               <span>+ Summarize Meeting</span>
//             </div>
//           </button>

//           <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
//             <div className="flex items-center justify-center space-x-3">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//               </svg>
//               <span>Share Summary</span>
//             </div>
//           </button>
//         </div>

//         {/* Footer */}
//         <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-200">
//           <div className="flex items-center justify-center space-x-6">
//             <a href="#" className="hover:text-gray-700">Privacy Policy</a>
//             <span>•</span>
//             <a href="#" className="hover:text-gray-700">Terms of Service</a>
//             <span>•</span>
//             <a href="#" className="hover:text-gray-700">About</a>
//             <span>•</span>
//             <a href="#" className="hover:text-gray-700">Contact</a>
//           </div>
//           <p className="mt-2">© 2025 MeetSummary. All rights reserved.</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;