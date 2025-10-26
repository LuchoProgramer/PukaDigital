"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNotifications } from '@/components/ui/Notification';

interface AutoSaveOptions {
  interval?: number; // Intervalo en milisegundos (default: 30 segundos)
  enabled?: boolean; // Si el auto-guardado está habilitado
  onSave: (data: any) => Promise<void>; // Función para guardar
  getData: () => any; // Función para obtener los datos actuales
  isValid?: () => boolean; // Función para validar si se puede guardar
}

interface AutoSaveStatus {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
}

export const useAutoSave = ({
  interval = 30000, // 30 segundos por defecto
  enabled = true,
  onSave,
  getData,
  isValid = () => true
}: AutoSaveOptions) => {
  const { showSuccess, showError } = useNotifications();
  const [status, setStatus] = useState<AutoSaveStatus>({
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
    error: null
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>('');
  const isMountedRef = useRef(true);

  // Función para guardar manualmente
  const saveNow = useCallback(async () => {
    if (!enabled || status.isSaving || !isValid()) {
      return false;
    }

    try {
      setStatus(prev => ({ ...prev, isSaving: true, error: null }));
      
      const currentData = getData();
      await onSave(currentData);
      
      if (isMountedRef.current) {
        setStatus(prev => ({
          ...prev,
          isSaving: false,
          lastSaved: new Date(),
          hasUnsavedChanges: false,
          error: null
        }));
        
        lastDataRef.current = JSON.stringify(currentData);
        showSuccess('Guardado automático', 'Los cambios se han guardado correctamente');
      }
      
      return true;
    } catch (error) {
      if (isMountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setStatus(prev => ({
          ...prev,
          isSaving: false,
          error: errorMessage
        }));
        
        showError('Error al guardar', errorMessage);
      }
      return false;
    }
  }, [enabled, status.isSaving, isValid, getData, onSave, showSuccess, showError]);

  // Función para verificar cambios
  const checkForChanges = useCallback(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(getData());
    const hasChanges = currentData !== lastDataRef.current && lastDataRef.current !== '';
    
    setStatus(prev => ({
      ...prev,
      hasUnsavedChanges: hasChanges
    }));

    return hasChanges;
  }, [enabled, getData]);

  // Función para programar el próximo auto-guardado
  const scheduleAutoSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!enabled) return;

    timeoutRef.current = setTimeout(async () => {
      if (checkForChanges() && isValid()) {
        await saveNow();
      }
      scheduleAutoSave(); // Programar el siguiente
    }, interval);
  }, [enabled, interval, checkForChanges, isValid, saveNow]);

  // Función para marcar cambios
  const markAsChanged = useCallback(() => {
    setStatus(prev => ({ ...prev, hasUnsavedChanges: true }));
    
    // Reprogramar auto-guardado cuando hay cambios
    if (enabled) {
      scheduleAutoSave();
    }
  }, [enabled, scheduleAutoSave]);

  // Función para marcar como guardado (para guardado manual)
  const markAsSaved = useCallback(() => {
    const currentData = JSON.stringify(getData());
    lastDataRef.current = currentData;
    
    setStatus(prev => ({
      ...prev,
      hasUnsavedChanges: false,
      lastSaved: new Date(),
      error: null
    }));
  }, [getData]);

  // Inicializar auto-guardado
  useEffect(() => {
    if (enabled) {
      // Guardar datos iniciales como referencia
      const initialData = JSON.stringify(getData());
      lastDataRef.current = initialData;
      
      // Iniciar el ciclo de auto-guardado
      scheduleAutoSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, scheduleAutoSave, getData]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Advertir sobre cambios no guardados antes de salir
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (status.hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [status.hasUnsavedChanges]);

  return {
    ...status,
    saveNow,
    markAsChanged,
    markAsSaved,
    checkForChanges,
    
    // Utilidades
    getTimeSinceLastSave: () => {
      if (!status.lastSaved) return null;
      return Date.now() - status.lastSaved.getTime();
    },
    
    getLastSavedText: () => {
      if (!status.lastSaved) return 'Nunca guardado';
      
      const timeDiff = Date.now() - status.lastSaved.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const seconds = Math.floor((timeDiff % 60000) / 1000);
      
      if (minutes > 0) {
        return `Guardado hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
      } else if (seconds > 5) {
        return `Guardado hace ${seconds} segundos`;
      } else {
        return 'Guardado recientemente';
      }
    }
  };
};

export default useAutoSave;