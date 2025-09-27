export interface User {
  id: string
  name: string
  email: string
  image?: string
}

export interface Meeting {
  id: string
  title: string
  time: string
  date: string
  description?: string
}

export interface Recording {
  id: string
  title: string
  size: string
  date: string
  url?: string
  duration?: string
}

export interface Summary {
  id: string
  title: string
  date: string
  duration: string
  content?: string
  recording_id?: string
}

export interface DashboardData {
  user: User
  upcomingMeetings: Meeting[]
  recentRecordings: Recording[]
  recentSummaries: Summary[]
}