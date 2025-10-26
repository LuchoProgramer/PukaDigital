"use client";

import { useState, useEffect, useCallback } from 'react';

interface ListPreferences {
  sortBy: string;
  filterBy: string;
  viewMode: string;
  searchTerm: string;
}

interface UseListPreferencesOptions {
  storageKey: string;
  defaultPreferences: ListPreferences;
}

export const useListPreferences = ({
  storageKey,
  defaultPreferences
}: UseListPreferencesOptions) => {
  const [preferences, setPreferences] = useState<ListPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar preferencias desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(prev => ({
          ...prev,
          ...parsed
        }));
      }
    } catch (error) {
      console.warn(`Error loading preferences for ${storageKey}:`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Guardar preferencias en localStorage
  const savePreferences = useCallback((newPreferences: Partial<ListPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.warn(`Error saving preferences for ${storageKey}:`, error);
    }
  }, [preferences, storageKey]);

  // Resetear preferencias
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn(`Error removing preferences for ${storageKey}:`, error);
    }
  }, [defaultPreferences, storageKey]);

  // Helpers para actualizar preferencias específicas
  const updateSortBy = useCallback((sortBy: string) => {
    savePreferences({ sortBy });
  }, [savePreferences]);

  const updateFilterBy = useCallback((filterBy: string) => {
    savePreferences({ filterBy });
  }, [savePreferences]);

  const updateViewMode = useCallback((viewMode: string) => {
    savePreferences({ viewMode });
  }, [savePreferences]);

  const updateSearchTerm = useCallback((searchTerm: string) => {
    savePreferences({ searchTerm });
  }, [savePreferences]);

  return {
    preferences,
    isLoaded,
    savePreferences,
    resetPreferences,
    updateSortBy,
    updateFilterBy,
    updateViewMode,
    updateSearchTerm
  };
};

export default useListPreferences;