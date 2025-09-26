import { motion } from "framer-motion"
import { Calendar, Clock, Users, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import  Button  from "@/components/ui/Button"

interface MeetingCardProps {
  id: string
  title: string
  date: string
  duration: string
  participants: number
  status: "completed" | "processing" | "pending"
  onSummarize?: () => void
  index: number
}

export function MeetingCard({
  id,
  title,
  date,
  duration,
  participants,
  status,
  onSummarize,
  index
}: MeetingCardProps) {
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800", 
    pending: "bg-gray-100 text-gray-800"
  }

  const statusText = {
    completed: "เสร็จสิ้น",
    processing: "กำลังประมวลผล",
    pending: "รอดำเนินการ"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{participants} คน</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {statusText[status]}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button>
                <Play className="h-4 w-4 mr-1" />
                ดูวิดีโอ
              </Button>
            </div>
            <Button 
              size="sm" 
              onClick={onSummarize}
              disabled={status === "processing"}
            >
              {status === "processing" ? "กำลังประมวลผล..." : "สรุปการประชุม"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}