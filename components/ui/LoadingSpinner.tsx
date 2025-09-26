import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="text-center">
        <div
          className={cn(
            "animate-spin rounded-full border-4 border-white/30 border-t-white mx-auto mb-4",
            sizes[size],
            className
          )}
        />
        <p className="text-white text-lg font-medium">กำลังโหลด...</p>
      </div>
    </div>
  )
}