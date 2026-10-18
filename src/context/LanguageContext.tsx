'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18N, Language, TranslationDict } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: I18N.en as TranslationDict,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    // 从 localStorage 读取偏好，若无则检测浏览器语言
    const saved = localStorage.getItem('v2q_lang') as Language | null;
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved);
    } else if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('zh')) {
      setLangState('zh');
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('v2q_lang', newLang);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'zh' : 'en';
    setLang(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t: I18N[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
