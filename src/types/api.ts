export interface ApiError {
    error: string
    message: string
    needsReauth?: boolean
    details?: string
  }
  
  export interface Recording {
    id: string
    title: string
    size: string
    date: string
    webViewLink?: string
    thumbnailLink?: string
    duration: string
    source: 'google_drive' | 'local'
  }
  
  export interface Meeting {
    id: string
    title: string
    startTime?: string
    endTime?: string
    time?: string
    date?: string
    duration?: string
    meetLink?: string
    attendees?: number
    description?: string
    source?: string
  }