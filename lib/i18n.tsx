'use client';

import React, { createContext, useContext, useState } from 'react';
import { es } from './i18n/translations/es';

type Language = 'es';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations: Record<Language, any> = { es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Hardcoded to Spanish for Option B migration
  const [language] = useState<Language>('es');

  // Helper to get nested properties safely (e.g., 'home.hero_title')
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Return key if not found
      }
    }
    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};