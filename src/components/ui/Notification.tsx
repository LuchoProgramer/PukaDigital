"use client";

import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertTriangle, FiInfo, FiXCircle } from 'react-icons/fi';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const typeConfig = {
  success: {
    icon: FiCheck,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-400',
    titleColor: 'text-green-800 dark:text-green-200',
    descColor: 'text-green-700 dark:text-green-300'
  },
  error: {
    icon: FiXCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-400',
    titleColor: 'text-red-800 dark:text-red-200',
    descColor: 'text-red-700 dark:text-red-300'
  },
  warning: {
    icon: FiAlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-800 dark:text-yellow-200',
    descColor: 'text-yellow-700 dark:text-yellow-300'
  },
  info: {
    icon: FiInfo,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-200',
    descColor: 'text-blue-700 dark:text-blue-300'
  }
};

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  description,
  duration = 5000,
  onClose,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.titleColor}`}>
            {title}
          </h3>
          {description && (
            <div className={`mt-2 text-sm ${config.descColor}`}>
              <p>{description}</p>
            </div>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.iconColor} hover:${config.bgColor}`}
            >
              <span className="sr-only">Cerrar</span>
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para gestionar notificaciones
interface NotificationState {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const addNotification = (notification: Omit<NotificationState, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, description?: string) => {
    addNotification({ type: 'success', title, description });
  };

  const showError = (title: string, description?: string) => {
    addNotification({ type: 'error', title, description });
  };

  const showWarning = (title: string, description?: string) => {
    addNotification({ type: 'warning', title, description });
  };

  const showInfo = (title: string, description?: string) => {
    addNotification({ type: 'info', title, description });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

// Componente contenedor de notificaciones
interface NotificationContainerProps {
  notifications: NotificationState[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4'
};

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
  position = 'top-right'
}) => {
  return (
    <div className={`fixed z-50 space-y-4 ${positionClasses[position]}`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          description={notification.description}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
          className="max-w-sm shadow-lg"
        />
      ))}
    </div>
  );
};