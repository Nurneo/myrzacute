import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '@/content/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ru',
  setLang: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem('myrzacute-lang');
      if (stored === 'en' || stored === 'ru') return stored;
    } catch (e) {
      console.warn('Failed to read language from localStorage:', e);
    }
    return 'ru';
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('myrzacute-lang', newLang);
    } catch (e) {
      console.warn('Failed to write language to localStorage:', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
