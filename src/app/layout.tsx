import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetSummary - AI Meeting Summarizer',
  description: 'สรุปการประชุมอัจฉริยะด้วย AI จาก Google Meet recordings',
  keywords: 'meeting summary, AI, Google Meet, transcription, Thai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}