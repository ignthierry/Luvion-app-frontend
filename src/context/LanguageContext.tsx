'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../locales/en';
import { id } from '../locales/id';

type Language = 'ID' | 'EN';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
  EN: en,
  ID: id,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ID');

  useEffect(() => {
    // Try to load saved language from localStorage
    const saved = localStorage.getItem('luvion_lang') as Language;
    if (saved && (saved === 'ID' || saved === 'EN')) {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('luvion_lang', newLang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = dictionaries[lang];

    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        return key;
      }
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
