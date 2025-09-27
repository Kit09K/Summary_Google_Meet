"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

interface Summary {
  id: string;
  title: string;
  date: string;
  duration: string;
}

interface RecentSummariesProps {
  summaries: Summary[];
  onViewSummary: (id: string) => void;
  onShareSummary: (id: string) => void;
}

export const RecentSummaries: React.FC<RecentSummariesProps> = ({
  summaries,
  onViewSummary,
  onShareSummary
}) => {
  return (
    <Card padding={false} className="mb-8">
      <CardHeader className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">การสรุปล่าสุด</h3>
        <p className="text-sm text-gray-600">การสรุปการประชุมที่คุณเคยทำ</p>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {summaries.map((summary) => (
            <SummaryItem
              key={summary.id}
              summary={summary}
              onView={() => onViewSummary(summary.id)}
              onShare={() => onShareSummary(summary.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SummaryItem: React.FC<{
  summary: Summary;
  onView: () => void;
  onShare: () => void;
}> = ({ summary, onView, onShare }) => (
  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{summary.title}</h4>
        <p className="text-sm text-gray-500">{summary.date} • {summary.duration}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2 flex-shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={onShare}
        className="text-gray-500 hover:text-gray-700"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={onView}
        className="text-blue-600 hover:text-blue-700"
      >
        ดูสรุป
      </Button>
    </div>
  </div>
);