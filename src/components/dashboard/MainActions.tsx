"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

interface Recording {
  id: string;
  title: string;
  size: string;
  date: string;
}

interface MainActionsProps {
  recentRecordings: Recording[];
  onViewAllRecordings: () => void;
  onCreateSummary: () => void;
  onFileSelect: (files: FileList) => void;
}

export const MainActions: React.FC<MainActionsProps> = ({
  recentRecordings,
  onViewAllRecordings,
  onCreateSummary,
  onFileSelect
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Recordings Card */}
      <Card padding={false}>
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5 6m14-2l2 2m-2-2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">🔹 Recordings จาก Google Drive</h3>
              <p className="text-sm text-gray-600">ดูไฟล์บันทึกการประชุม</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-3 mb-4">
            {recentRecordings.slice(0, 3).map((recording) => (
              <RecordingItem key={recording.id} recording={recording} />
            ))}
          </div>
          <Button 
            variant="primary" 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onViewAllRecordings}
          >
            ดูไฟล์ทั้งหมด
          </Button>
        </CardContent>
      </Card>

      {/* Create Summary Card */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🔹 สร้างสรุปใหม่</h3>
            <p className="text-sm text-gray-600">เลือกไฟล์ recording เพื่อทำสรุป</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <label className="block">
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-gray-300 transition-colors">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-2">ลากไฟล์มาวางที่นี่ หรือ</p>
              <span className="text-blue-600 hover:text-blue-700 font-medium">เลือกไฟล์</span>
            </div>
          </label>
        </div>
        
        <Button 
          variant="primary"
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={onCreateSummary}
        >
          เริ่มสร้างสรุป
        </Button>
      </Card>
    </div>
  );
};

const RecordingItem: React.FC<{ recording: Recording }> = ({ recording }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{recording.title}</p>
        <p className="text-xs text-gray-500">{recording.size} • {recording.date}</p>
      </div>
    </div>
  </div>
);