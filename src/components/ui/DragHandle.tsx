"use client";

import React from 'react';
import { FiMove } from 'react-icons/fi';

interface DragHandleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DragHandle: React.FC<DragHandleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div 
      className={`inline-flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors ${className}`}
      title="Arrastra para reordenar"
    >
      <FiMove className={`${sizeClasses[size]}`} />
    </div>
  );
};

interface DropZoneIndicatorProps {
  isActive: boolean;
  position: 'top' | 'bottom';
  className?: string;
}

export const DropZoneIndicator: React.FC<DropZoneIndicatorProps> = ({
  isActive,
  position,
  className = ''
}) => {
  if (!isActive) return null;

  const positionClasses = {
    top: '-top-2',
    bottom: '-bottom-2'
  };

  return (
    <div 
      className={`absolute left-0 right-0 ${positionClasses[position]} h-1 bg-blue-500 rounded-full transition-all duration-200 ${className}`}
    >
      <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse" />
    </div>
  );
};

interface DragPreviewProps {
  children: React.ReactNode;
  isDragging: boolean;
  className?: string;
}

export const DragPreview: React.FC<DragPreviewProps> = ({
  children,
  isDragging,
  className = ''
}) => {
  return (
    <div 
      className={`transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95 rotate-1 shadow-lg' : 'opacity-100 scale-100 rotate-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default DragHandle;