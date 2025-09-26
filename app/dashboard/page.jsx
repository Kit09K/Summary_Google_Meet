"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, Filter, BarChart3, Calendar, Clock } from "lucide-react"
import { Header } from "@/components/dashboard/Header"
import { MeetingCard } from "@/components/dashboard/MeetingCard"
import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <LoadingSpinner />
  }

  if (!session) {
    return <LoadingSpinner />
  }

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const meetings = [
    {
      id: "1",
      title: "Weekly Team Standup",
      date: "2024-01-15",
      duration: "45 นาที",
      participants: 8,
      status: "completed"
    },
    {
      id: "2", 
      title: "Project Planning Meeting",
      date: "2024-01-14",
      duration: "1 ชั่วโมง 30 นาที",
      participants: 5,
      status: "processing" 
    },
    {
      id: "3",
      title: "Client Presentation",
      date: "2024-01-13", 
      duration: "2 ชั่วโมง",
      participants: 12,
      status: "pending" 
    }
  ]

  const stats = [
    { title: "การประชุมทั้งหมด", value: "24", icon: Calendar, color: "text-blue-600" },
    { title: "เวลาที่ประหยัด", value: "18 ชั่วโมง", icon: Clock, color: "text-green-600" },
    { title: "สรุปที่สร้าง", value: "15", icon: BarChart3, color: "text-purple-600" }
  ]

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับ, {session.user?.name} 👋
          </h2>
          <p className="text-gray-600">จัดการและสรุปการประชุม Google Meet ของคุณ</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาการประชุม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มการประชุม
            </Button>
          </div>
        </motion.div>

        {/* Meetings Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">การประชุมล่าสุด</h3>
          {filteredMeetings.length > 0 ? (
            <div className="grid gap-4">
              {filteredMeetings.map((meeting, index) => (
                <MeetingCard
                  key={meeting.id}
                  {...meeting}
                  index={index}
                  onSummarize={() => {
                    console.log(`Summarizing meeting ${meeting.id}`)
                    // Navigate to processing page
                  }}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบการประชุม</h3>
              <p className="text-gray-600 mb-6">ลองค้นหาด้วยคำอื่น หรือเพิ่มการประชุมใหม่</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มการประชุมแรก
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}