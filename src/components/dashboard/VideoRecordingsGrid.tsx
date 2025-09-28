// src/components/dashboard/VideoRecordingsGrid.tsx
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Recording {
  id: string;
  title: string;
  size: string;
  date: string;
  webViewLink?: string;
  thumbnailLink?: string;
  duration: string;
  source: "google_drive" | "local";
  mimeType?: string;
}

interface VideoRecordingsGridProps {
  recordings: Recording[];
  isLoading: boolean;
  onCreateSummary: (selectedRecordings: Recording[]) => void;
  onRefresh: () => void;
}

export const VideoRecordingsGrid: React.FC<VideoRecordingsGridProps> = ({
  recordings,
  isLoading,
  onCreateSummary,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecordings, setSelectedRecordings] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter และ Sort recordings
  const filteredAndSortedRecordings = useMemo(() => {
    let filtered = recordings.filter((recording) =>
      recording.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.title.localeCompare(b.title);
          break;
        case "size":
          const sizeA = parseInt(a.size.replace(/[^\d]/g, "")) || 0;
          const sizeB = parseInt(b.size.replace(/[^\d]/g, "")) || 0;
          comparison = sizeA - sizeB;
          break;
        case "date":
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [recordings, searchTerm, sortBy, sortOrder]);

  // Handle selection
  const handleSelectRecording = (
    recordingId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    const newSelected = new Set(selectedRecordings);
    if (newSelected.has(recordingId)) {
      newSelected.delete(recordingId);
    } else {
      newSelected.clear(); // เลือกได้ทีละคลิป
      newSelected.add(recordingId);
    }
    setSelectedRecordings(newSelected);
  };

  // Handle select all
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRecordings(
        new Set(filteredAndSortedRecordings.map((r) => r.id))
      );
    } else {
      setSelectedRecordings(new Set());
    }
  };

  // Handle double click
  const handleDoubleClick = (recording: Recording) => {
    if (recording.webViewLink) {
      window.open(recording.webViewLink, "_blank");
    }
  };

  // Handle single click (open video in new tab)
  const handleSingleClick = (recording: Recording, event: React.MouseEvent) => {
    // ถ้าคลิกที่ checkbox ก็ไม่ต้องเปิดวีดีโอ
    if ((event.target as HTMLElement).closest(".recording-checkbox")) {
      return;
    }

    if (recording.webViewLink) {
      window.open(recording.webViewLink, "_blank");
    }
  };

  // Get selected recordings data
  const getSelectedRecordingsData = () => {
    return recordings.filter((r) => selectedRecordings.has(r.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedRecordings(new Set());
  };

  const isAllSelected =
    filteredAndSortedRecordings.length > 0 &&
    filteredAndSortedRecordings.every((r) => selectedRecordings.has(r.id));
  const isPartiallySelected = selectedRecordings.size > 0 && !isAllSelected;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ไฟล์บันทึกการประชุม
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            แสดง {filteredAndSortedRecordings.length} จาก {recordings.length}{" "}
            ไฟล์
            {selectedRecordings.size > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                • เลือกแล้ว {selectedRecordings.size} ไฟล์
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-1"
          >
            {isLoading ? (
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
            <span>รีเฟรช</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card padding={false} className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="ค้นหาไฟล์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "name" | "size")
              }
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">เรียงตามวันที่</option>
              <option value="name">เรียงตามชื่อ</option>
              <option value="size">เรียงตามขนาด</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title={
                sortOrder === "asc" ? "เรียงจากน้อยไปมาก" : "เรียงจากมากไปน้อย"
              }
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  sortOrder === "desc" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {filteredAndSortedRecordings.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              {/* <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  เลือกทั้งหมด ({filteredAndSortedRecordings.length} ไฟล์)
                </span>
              </label>
              {selectedRecordings.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ยกเลิกการเลือก
                </button>
              )} */}
            </div>
            {selectedRecordings.size > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onCreateSummary(getSelectedRecordingsData())}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <div className="items-center">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  สร้างสรุปจากที่เลือก ({selectedRecordings.size})
                </div>
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-3 text-gray-600">กำลังโหลดไฟล์...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading &&
        filteredAndSortedRecordings.length === 0 &&
        recordings.length > 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-600 mb-2">ไม่พบไฟล์ที่ค้นหา</p>
            <p className="text-sm text-gray-500">
              ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="mt-3"
            >
              ล้างการค้นหา
            </Button>
          </div>
        )}

      {/* Empty State */}
      {!isLoading && recordings.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
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
          <p className="text-gray-600 mb-2">ไม่พบไฟล์บันทึกการประชุม</p>
          <p className="text-sm text-gray-500">
            อัปโหลดไฟล์หรือเชื่อมต่อกับ Google Drive เพื่อเริ่มต้น
          </p>
        </div>
      )}

      {/* Recordings Grid */}
      {!isLoading && filteredAndSortedRecordings.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {filteredAndSortedRecordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              isSelected={selectedRecordings.has(recording.id)}
              onSelect={(e) => handleSelectRecording(recording.id, e)}
              onClick={(e) => handleSingleClick(recording, e)}
              onDoubleClick={() => handleDoubleClick(recording)}
            />
          ))}
        </div>
      )}

      {/* Instructions */}
      {!isLoading && filteredAndSortedRecordings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">วิธีการใช้งาน:</p>
              <ul className="text-blue-700 space-y-0.5 text-xs">
                <li>• <strong>ขนาดไฟล์ที่เลือกต้องน้อยกว่า 500MB</strong></li>
                <li>
                  • <strong>คลิกเดียว</strong> เพื่อเปิดวีดีโอในแท็บใหม่
                </li>
                <li>
                  • <strong>ดับเบิลคลิก</strong> เพื่อเปิดใน Google Drive
                </li>
                <li>
                  • <strong>ติกช่อง</strong> เพื่อเลือกไฟล์สำหรับสร้างสรุป
                </li>
                <li>• สามารถค้นหาและเรียงลำดับได้ตามต้องการ</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Recording Card Component
interface RecordingCardProps {
  recording: Recording;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}

const RecordingCard: React.FC<RecordingCardProps> = ({
  recording,
  isSelected,
  onSelect,
  onClick,
  onDoubleClick,
}) => {
  const getFileIcon = (title: string, mimeType?: string) => {
    const ext = title.split(".").pop()?.toLowerCase();
    const isVideo =
      mimeType?.startsWith("video/") ||
      ["mp4", "mov", "avi", "mkv"].includes(ext || "");

    if (isVideo) {
      return (
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M8 8l4 2-4 2V8z" />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M18 3a1 1 0 00-1.196-.98L9 3.75v.25a1 1 0 001 1h.5c.28 0 .5.22.5.5v7a2.5 2.5 0 11-1-2V7a1 1 0 00-1-1H9a1 1 0 01-1-1V3a1 1 0 011-1h8a1 1 0 011 1v12.5a2.5 2.5 0 11-1-2V3z" />
        </svg>
      </div>
    );
  };

  const formatDuration = (duration: string) => {
    if (duration === "Unknown") return "ไม่ทราบ";
    return duration;
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
    >
      <div
        className="space-y-3"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {/* Header with Checkbox */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {getFileIcon(recording.title, recording.mimeType)}
            <div className="min-w-0 flex-1">
              <h3
                className="font-medium text-gray-900 text-sm leading-tight truncate"
                title={recording.title}
              >
                {recording.title}
              </h3>
            </div>
          </div>
          <div className="recording-checkbox flex-shrink-0 ml-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e as any)} // Cast to any to match MouseEvent
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Thumbnail/Preview Area */}
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
          {recording.thumbnailLink ? (
            <img
              src={recording.thumbnailLink}
              alt={recording.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg
                className="w-6 h-6 text-gray-700 ml-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="font-medium">ขนาด:</span>
            <span>{recording.size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">ระยะเวลา:</span>
            <span>{formatDuration(recording.duration)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">วันที่:</span>
            <span>{recording.date}</span>
          </div>
          {recording.source === "google_drive" && (
            <div className="flex items-center space-x-1 text-blue-600">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.01 2C6.5 2 2.01 6.49 2.01 12s4.49 10 9.99 10c5.51 0 10-4.49 10-10S17.52 2 12.01 2zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <span className="text-xs">Google Drive</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
