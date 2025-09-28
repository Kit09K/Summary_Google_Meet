import { useState, useEffect } from 'react'

interface Meeting {
  id: string
  title: string
  startTime: string
  endTime: string
  duration: string
  meetLink?: string
  attendees: number
  description?: string
  source: string
}

export function useGoogleMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMeetings = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/google/calendar/meetings')
      if (!response.ok) {
        throw new Error('Failed to fetch meetings')
      }
      
      const data = await response.json()
      setMeetings(data.meetings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  return { meetings, isLoading, error, refetch: fetchMeetings }
}