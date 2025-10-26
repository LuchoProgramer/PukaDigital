"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'purple' | 'gray' | 'white';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const colorMap = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  purple: 'border-purple-500',
  gray: 'border-gray-500',
  white: 'border-white'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}) => {
  return (
    <div 
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeMap[size]} ${colorMap[color]} ${className}`}
      role="status"
      aria-label="Cargando..."
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

interface LoadingStateProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Cargando...",
  description,
  size = 'md',
  className = ''
}) => {
  const containerSizes = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
      <LoadingSpinner size={size === 'sm' ? 'md' : 'lg'} />
      <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          {description}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;