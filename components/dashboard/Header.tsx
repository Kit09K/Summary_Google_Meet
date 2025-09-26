"use client"

import { signOut, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { LogOut, Settings, User } from "lucide-react"
import Button  from "@/components/ui/Button"

export function Header() {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <motion.header
      className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎥</span>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meet Summarizer
            </h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {session?.user && (
            <motion.div
              className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{session.user.name}</p>
                <p className="text-gray-500 text-xs">{session.user.email}</p>
              </div>
            </motion.div>
          )}
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}