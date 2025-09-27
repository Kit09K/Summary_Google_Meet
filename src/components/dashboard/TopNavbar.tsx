"use client";

import React from "react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface TopNavbarProps {
  user: User;
  onLogout: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ user, onLogout }) => {
  const displayName = user?.name ?? "Guest";
  const displayEmail = user?.email ?? "";
  const displayImage = user?.image ?? undefined;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">MeetSummary</h1>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={displayImage || undefined}
              alt={displayName}
              name={displayName}
              size="md"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              {displayEmail && (
                <p className="text-xs text-gray-500">{displayEmail}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-500 hover:text-gray-700"
          >
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

