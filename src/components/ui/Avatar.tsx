"use client";

import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseStyles = `inline-flex items-center justify-center rounded-full border-2 border-gray-200 ${sizes[size]} ${className}`;

  const validSrc = src && src.trim() !== '' ? src : '/default-avatar.png';

  return (
    <img
      src={validSrc}
      alt={alt || name || 'Avatar'}
      className={`${baseStyles} object-cover`}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = '/default-avatar.png';
      }}
    />
  );
};
