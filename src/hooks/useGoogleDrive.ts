import { useState, useEffect } from 'react'

interface Recording {
  id: string
  title: string
  size: string
  date: string
  webViewLink?: string
  thumbnailLink?: string
  duration: string
  source: string
}

interface ApiError {
  error: string
  message: string
  needsReauth?: boolean
  details?: string
}

export function useGoogleDriveRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchRecordings = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/google/drive/recordings')
      const data = await response.json()
      
      if (!response.ok) {
        // ถ้า API return error object
        setError(data as ApiError)
        return
      }
      
      setRecordings(data.recordings || [])
    } catch (err) {
      console.error('Hook error:', err)
      setError({
        error: 'Network Error',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
        details: err instanceof Error ? err.message : 'Unknown network error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  useEffect(() => {
    fetchRecordings()
  }, [])

  return { 
    recordings, 
    isLoading, 
    error, 
    refetch: fetchRecordings,
    clearError
  }
}