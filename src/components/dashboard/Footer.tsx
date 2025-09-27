"use client";

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-200">
      <div className="flex items-center justify-center space-x-6 flex-wrap">
        <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
        <span className="text-gray-300">•</span>
        <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
        <span className="text-gray-300">•</span>
        <a href="#" className="hover:text-gray-700 transition-colors">About</a>
        <span className="text-gray-300">•</span>
        <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
      </div>
      <p className="mt-2">© 2025 MeetSummary. All rights reserved.</p>
    </footer>
  );
};