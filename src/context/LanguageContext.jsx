import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  const changeLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    api.setLanguage(lang); // Sync with ApiService headers
  };

  useEffect(() => {
    api.setLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
