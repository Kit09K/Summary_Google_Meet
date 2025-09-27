"use client";

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const logout = async () => {
    try {
      await signOut({ callbackUrl: "/login" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    login,
    logout
  }
}