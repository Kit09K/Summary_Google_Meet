"use client";

import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface Meeting {
  id: string;
  title: string;
  time: string;
  date: string;
}

interface WelcomeSectionProps {
  userName: string;
  upcomingMeetings: Meeting[];
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  upcomingMeetings
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        สวัสดี {userName} 👋
      </h2>
      <p className="text-gray-600 text-lg">วันนี้คุณมี Meeting อะไรบ้าง?</p>
      
      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">การประชุมที่กำลังจะมาถึง</h3>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <MeetingItem key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const MeetingItem: React.FC<{ meeting: Meeting }> = ({ meeting }) => (
  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
    <div>
      <p className="font-medium text-gray-900">{meeting.title}</p>
      <p className="text-sm text-gray-600">{meeting.date} • {meeting.time}</p>
    </div>
    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors">
      เข้าร่วม
    </button>
  </div>
);