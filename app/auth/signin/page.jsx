"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { VideoIcon, Brain, FileText, Share2, Shield, Lock, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function SignIn() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return <LoadingSpinner />
  }

  if (session) {
    return <LoadingSpinner />
  }

  const features = [
    { icon: Brain, title: "AI Summarization", desc: "สรุปการประชุมด้วย AI อัตโนมัติ" },
    { icon: FileText, title: "Auto Transcript", desc: "แปลงเสียงเป็นข้อความอัตโนมัติ" },
    { icon: Share2, title: "Easy Sharing", desc: "แชร์ผลสรุปได้ง่ายๆ" },
    { icon: VideoIcon, title: "Meet Integration", desc: "เชื่อมต่อกับ Google Meet" }
  ]

  const permissions = [
    { icon: FileText, text: "อ่านไฟล์ใน Google Drive (สำหรับดึง recordings)" },
    { icon: VideoIcon, text: "เข้าถึงข้อมูล Google Meet (สำหรับดูประวัติการประชุม)" },
    { icon: User, text: "ข้อมูลโปรไฟล์พื้นฐาน (ชื่อ, อีเมล)" }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                className="text-6xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎥
              </motion.div>
              <CardTitle className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Meet Summarizer
              </CardTitle>
              <p className="text-gray-600 text-lg mt-2">
                สรุปการประชุม Google Meet ด้วย AI อัตโนมัติ
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Login Button */}
              <GoogleLoginButton />

              {/* Permissions */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  สิทธิ์ที่ต้องการ:
                </h3>
                <ul className="space-y-2">
                  {permissions.map((permission, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <permission.icon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{permission.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-200/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <feature.icon className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="font-medium text-xs text-gray-800 mb-1">{feature.title}</div>
                    <div className="text-xs text-gray-500">{feature.desc}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer */}
              <motion.div
                className="text-center text-xs text-gray-500 border-t pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="mb-2">เมื่อเข้าสู่ระบบ คุณยอมรับ</p>
                <div className="space-x-2">
                  <a href="/terms" className="text-blue-500 hover:underline">เงื่อนไขการใช้งาน</a>
                  <span>และ</span>
                  <a href="/privacy" className="text-blue-500 hover:underline">นโยบายความเป็นส่วนตัว</a>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}