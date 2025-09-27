"use client";

import React from 'react';
import { Button } from '../ui/Button';

interface QuickActionsProps {
  onSummarizeMeeting: () => void;
  onShareSummary: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSummarizeMeeting,
  onShareSummary
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Button
        variant="primary"
        size="lg"
        onClick={onSummarizeMeeting}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        <div className="flex items-center justify-center space-x-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>+ Summarize Meeting</span>
        </div>
      </Button>

      <Button
        variant="primary"
        size="lg"
        onClick={onShareSummary}
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        <div className="flex items-center justify-center space-x-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share Summary</span>
        </div>
      </Button>
    </div>
  );
};