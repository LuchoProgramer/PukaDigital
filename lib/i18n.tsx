'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { es } from './i18n/translations/es';
import { en } from './i18n/translations/en';
import { pt } from './i18n/translations/pt';

type Language = 'es' | 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

const translations: Record<Language, any> = { es, en, pt };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Si hay initialLanguage (desde la URL), usarlo
    if (initialLanguage) {
      setLanguageState(initialLanguage);
      localStorage.setItem('language', initialLanguage);
      return;
    }

    // 1. Check Local Storage
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['es', 'en', 'pt'].includes(storedLang)) {
      setLanguageState(storedLang);
      return;
    }

    // 2. Check Browser Language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') setLanguageState('pt');
    else if (browserLang === 'en') setLanguageState('en');
    else setLanguageState('es'); // Default fallback
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Redirigir a la nueva URL con el idioma cambiado
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/(es|en|pt)/, '');
      window.location.href = `/${lang}${pathWithoutLang}`;
    }
  };

  // Helper to get nested properties safely (e.g., 'home.hero_title')
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to Spanish if translation missing
        let fallback: any = translations['es'];
        for (const fbK of keys) {
          if (fallback && fallback[fbK]) fallback = fallback[fbK];
          else return key; // Return key if absolutely nothing found
        }
        return fallback || key;
      }
    }
    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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