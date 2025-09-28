"use client";

import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface Meeting {
  id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  time?: string; // สำหรับ backward compatibility
  date?: string; // สำหรับ backward compatibility
  duration?: string;
  meetLink?: string;
  attendees?: number;
  description?: string;
  source?: string;
}

interface WelcomeSectionProps {
  userName: string;
  upcomingMeetings: Meeting[];
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  upcomingMeetings
}) => {
  // กรองเฉพาะการประชุมที่กำลังจะมาถึง (อนาคต)
  const filteredMeetings = upcomingMeetings.filter(meeting => {
    if (meeting.startTime) {
      return new Date(meeting.startTime) > new Date();
    }
    return true; // สำหรับ mock data ที่ไม่มี startTime
  });

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            สวัสดี {userName} 👋
          </h2>
          <p className="text-gray-600 text-lg">วันนี้คุณมี Meeting อะไรบ้าง?</p>
          <p className="text-sm text-gray-500 mt-1">{getCurrentTime()}</p>
        </div>
        <div className="hidden md:block">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">การประชุมทั้งหมด</p>
            <p className="text-2xl font-bold">{filteredMeetings.length}</p>
          </div>
        </div>
      </div>
      
      {/* Upcoming Meetings */}
      {filteredMeetings.length > 0 ? (
        <Card className="mt-6">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">การประชุมที่กำลังจะมาถึง</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {filteredMeetings.length} การประชุม
              </span>
            </div>
            <div className="space-y-3">
              {filteredMeetings.slice(0, 5).map((meeting) => (
                <MeetingItem key={meeting.id} meeting={meeting} />
              ))}
            </div>
            {filteredMeetings.length > 5 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  ดูการประชุมทั้งหมด ({filteredMeetings.length - 5} เพิ่มเติม)
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7h8M8 7L6 9m10-2l2 2M6 9v10a2 2 0 002 2h8a2 2 0 002-2V9M6 9h12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีการประชุมที่กำลังจะมาถึง</h3>
              <p className="text-gray-500 text-sm">คุณสามารถพักผ่อนหรือจัดการงานอื่นๆ ได้เลย</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const MeetingItem: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const formatMeetingTime = (meeting: Meeting) => {
    if (meeting.startTime) {
      const startDate = new Date(meeting.startTime);
      const endDate = meeting.endTime ? new Date(meeting.endTime) : null;
      
      const dateStr = startDate.toLocaleDateString('th-TH', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      const timeStr = startDate.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const endTimeStr = endDate ? endDate.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      }) : null;
      
      return {
        date: dateStr,
        time: endTimeStr ? `${timeStr} - ${endTimeStr}` : timeStr
      };
    }
    
    // Fallback สำหรับ mock data
    return {
      date: meeting.date || 'Unknown',
      time: meeting.time || 'Unknown'
    };
  };

  const getTimeUntilMeeting = (meeting: Meeting) => {
    if (!meeting.startTime) return null;
    
    const now = new Date();
    const meetingStart = new Date(meeting.startTime);
    const diffMs = meetingStart.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 0) return 'กำลังเริ่ม';
    if (diffMins < 60) return `อีก ${diffMins} นาที`;
    if (diffHours < 24) return `อีก ${diffHours} ชั่วโมง`;
    return `อีก ${diffDays} วัน`;
  };

  const timeInfo = formatMeetingTime(meeting);
  const timeUntil = getTimeUntilMeeting(meeting);
  const isUrgent = meeting.startTime && (new Date(meeting.startTime).getTime() - new Date().getTime()) < 30 * 60 * 1000; // 30 minutes

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
      isUrgent ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center space-x-3 flex-1">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
          isUrgent ? 'bg-red-500' : 'bg-blue-500'
        }`}></div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 truncate">{meeting.title}</p>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-600">{timeInfo.date} • {timeInfo.time}</p>
            {meeting.duration && (
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                {meeting.duration}
              </span>
            )}
            {meeting.attendees && meeting.attendees > 0 && (
              <span className="text-xs text-gray-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {meeting.attendees}
              </span>
            )}
          </div>
          {timeUntil && (
            <p className={`text-xs mt-1 font-medium ${
              isUrgent ? 'text-red-600' : 'text-blue-600'
            }`}>
              {timeUntil}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        {meeting.meetLink && (
          <a
            href={meeting.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium text-sm px-3 py-2 rounded-lg transition-colors ${
              isUrgent 
                ? 'text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200' 
                : 'text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200'
            }`}
          >
            เข้าร่วม
          </a>
        )}
        
        <button 
          className="text-gray-400 hover:text-gray-600 p-1 rounded"
          title="ตัวเลือกเพิ่มเติม"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};