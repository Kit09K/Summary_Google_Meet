"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Recording {
  id: string;
  title: string;
  size: string;
  date: string;
  webViewLink?: string;
  thumbnailLink?: string;
  duration: string;
  source: "google_drive" | "local";
}

interface ApiError {
  error: string;
  message: string;
  needsReauth?: boolean;
  details?: string;
}

interface MainActionsProps {
  recentRecordings: Recording[];
  recordingsLoading?: boolean;
  recordingsError?: ApiError | null;
  onViewAllRecordings: () => void;
  onCreateSummary: () => void;
  onFileSelect: (files: FileList) => void;
  onSelectGoogleDriveFile: (fileId: string) => void;
  onRefreshRecordings: () => void;
}

export const MainActions: React.FC<MainActionsProps> = ({
  recentRecordings,
  recordingsLoading = false,
  recordingsError = null,
  onViewAllRecordings,
  onCreateSummary,
  onFileSelect,
  onSelectGoogleDriveFile,
  onRefreshRecordings,
}) => {
  const [selectedDriveFile, setSelectedDriveFile] = useState<string | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
      setSelectedDriveFile(null); // Clear Google Drive selection
    }
  };

  const handleDriveFileSelect = (recording: Recording) => {
    setSelectedDriveFile(recording.id);
    onSelectGoogleDriveFile(recording.id);
  };

  const handleRefresh = () => {
    onRefreshRecordings();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files);
      setSelectedDriveFile(null);
    }
  };


  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Google Drive Recordings Card */}
      <Card padding={false}>
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5 6m14-2l2 2m-2-2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  🔹 Recordings จาก Google Drive
                </h3>
                <p className="text-sm text-gray-600">
                  เลือกไฟล์บันทึกการประชุมจาก Google Drive
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={recordingsLoading}
              className="flex items-center space-x-1"
            >
              {recordingsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              <span className="text-xs">รีเฟรช</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {recordingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <LoadingSpinner size="md" />
                <p className="mt-2 text-sm text-gray-500">
                  กำลังโหลดไฟล์จาก Google Drive...
                </p>
              </div>
            </div>
          ) : recordingsError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-red-600 mb-1 font-medium">
                {recordingsError.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล"}
              </p>
              {recordingsError.details && (
                <details className="mb-3">
                  <summary className="text-xs text-red-500 cursor-pointer hover:text-red-700">
                    ดูรายละเอียดเพิ่มเติม
                  </summary>
                  <p className="text-xs text-red-400 mt-1 bg-red-50 p-2 rounded border-l-2 border-red-200">
                    {recordingsError.details}
                  </p>
                </details>
              )}
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  ลองใหม่
                </Button>
                {recordingsError.needsReauth && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => (window.location.href = "/api/auth/signin")}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                      />
                    </svg>
                    เข้าสู่ระบบใหม่
                  </Button>
                )}
              </div>
            </div>
          ) : recentRecordings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5 6m14-2l2 2m-2-2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                ไม่พบไฟล์บันทึกการประชุมใน Google Drive
              </p>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                ลองโหลดใหม่
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {recentRecordings.slice(0, 3).map((recording) => (
                  <GoogleDriveRecordingItem
                    key={recording.id}
                    recording={recording}
                    isSelected={selectedDriveFile === recording.id}
                    onSelect={() => handleDriveFileSelect(recording)}
                  />
                ))}
              </div>
              <Button
                variant="primary"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/recordings")} // เพิ่มการ navigate
              >
                ดูไฟล์ทั้งหมด ({recentRecordings.length} ไฟล์)
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Summary Card */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              🔹 สร้างสรุปใหม่
            </h3>
            <p className="text-sm text-gray-600">
              อัปโหลดไฟล์ท้องถิ่นเพื่อทำสรุป
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          {/* Local File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              อัปโหลดไฟล์จากคอมพิวเตอร์
            </label>
            <label className="block">
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <svg
                  className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                    dragActive ? "text-purple-500" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-gray-600 mb-2">
                  {dragActive ? "วางไฟล์ที่นี่" : "ลากไฟล์มาวางที่นี่ หรือ"}
                </p>
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  เลือกไฟล์
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  รองรับไฟล์ MP3, MP4, WAV, MOV (สูงสุด 500MB)
                </p>
              </div>
            </label>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือ</span>
            </div>
          </div>

          {/* Selected Google Drive File Info */}
          {selectedDriveFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    เลือกไฟล์จาก Google Drive แล้ว
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDriveFile(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {
                  recentRecordings.find((r) => r.id === selectedDriveFile)
                    ?.title
                }
              </p>
            </div>
          )}

          {/* File Type Support Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <svg
                className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  รองรับไฟล์ประเภท
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Video: MP4, MOV, AVI, MKV | Audio: MP3, WAV, AAC, M4A
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={onCreateSummary}
          disabled={!selectedDriveFile}
        >
          {selectedDriveFile ? "เริ่มสร้างสรุป" : "เลือกไฟล์ก่อนเริ่มสร้างสรุป"}
        </Button>
      </Card>
    </div>
  );
};

// Component สำหรับแสดงรายการไฟล์จาก Google Drive
const GoogleDriveRecordingItem: React.FC<{
  recording: Recording;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ recording, isSelected, onSelect }) => {
  const formatFileSize = (size: string) => {
    // ถ้า size เป็นตัวเลขใน bytes
    const numSize = parseInt(size.replace(/[^\d]/g, ""));
    if (!isNaN(numSize)) {
      if (numSize < 1024) return `${numSize} B`;
      if (numSize < 1024 * 1024) return `${Math.round(numSize / 1024)} KB`;
      if (numSize < 1024 * 1024 * 1024)
        return `${Math.round(numSize / (1024 * 1024))} MB`;
      return `${Math.round(numSize / (1024 * 1024 * 1024))} GB`;
    }
    return size;
  };

  const getFileIcon = (title: string) => {
    const ext = title.split(".").pop()?.toLowerCase();
    if (["mp4", "mov", "avi", "mkv"].includes(ext || "")) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          <path d="M8 8l4 2-4 2V8z" />
        </svg>
      );
    }
    if (["mp3", "wav", "aac", "m4a"].includes(ext || "")) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98L9 3.75v.25a1 1 0 001 1h.5c.28 0 .5.22.5.5v7a2.5 2.5 0 11-1-2V7a1 1 0 00-1-1H9a1 1 0 01-1-1V3a1 1 0 011-1h8a1 1 0 011 1v12.5a2.5 2.5 0 11-1-2V3z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 3a2 2 0 00-2 2v1.816a2 2 0 00.586 1.414l2.828 2.828A2 2 0 008.172 12H15a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
      </svg>
    );
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer group ${
        isSelected
          ? "bg-green-100 border-2 border-green-300 shadow-sm"
          : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div
          className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
            isSelected ? "bg-green-200" : "bg-blue-100 group-hover:bg-blue-200"
          }`}
        >
          <div className={isSelected ? "text-green-700" : "text-blue-600"}>
            {getFileIcon(recording.title)}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`font-medium text-sm truncate ${
              isSelected ? "text-green-900" : "text-gray-900"
            }`}
          >
            {recording.title}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <p
              className={`text-xs ${
                isSelected ? "text-green-700" : "text-gray-500"
              }`}
            >
              {formatFileSize(recording.size)} • {recording.duration} •{" "}
              {recording.date}
            </p>
          </div>
          {recording.source === "google_drive" && (
            <div className="flex items-center space-x-1 mt-1">
              <svg
                className="w-3 h-3 text-blue-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.01 2C6.5 2 2.01 6.49 2.01 12s4.49 10 9.99 10c5.51 0 10-4.49 10-10S17.52 2 12.01 2zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <span className="text-xs text-blue-600">Google Drive</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        {isSelected && (
          <div className="text-green-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        {recording.webViewLink && (
          <a
            href={recording.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
            title="เปิดใน Google Drive"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};
