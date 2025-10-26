"use client";

import React from 'react';
import { FiSave, FiCheck, FiLoader, FiAlertCircle, FiClock } from 'react-icons/fi';

interface AutoSaveStatusProps {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
  className?: string;
  getLastSavedText: () => string;
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({
  lastSaved,
  isSaving,
  hasUnsavedChanges,
  error,
  className = '',
  getLastSavedText
}) => {
  const getStatusIcon = () => {
    if (error) {
      return <FiAlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (isSaving) {
      return <FiLoader className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    
    if (hasUnsavedChanges) {
      return <FiSave className="h-4 w-4 text-yellow-500" />;
    }
    
    if (lastSaved) {
      return <FiCheck className="h-4 w-4 text-green-500" />;
    }
    
    return <FiClock className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (error) {
      return 'Error al guardar';
    }
    
    if (isSaving) {
      return 'Guardando...';
    }
    
    if (hasUnsavedChanges) {
      return 'Cambios sin guardar';
    }
    
    return getLastSavedText();
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600 dark:text-red-400';
    if (isSaving) return 'text-blue-600 dark:text-blue-400';
    if (hasUnsavedChanges) return 'text-yellow-600 dark:text-yellow-400';
    if (lastSaved) return 'text-green-600 dark:text-green-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {error && (
        <button
          onClick={() => window.location.reload()}
          className="ml-2 text-xs underline hover:no-underline"
          title="Recargar página"
        >
          Recargar
        </button>
      )}
    </div>
  );
};

export default AutoSaveStatus;