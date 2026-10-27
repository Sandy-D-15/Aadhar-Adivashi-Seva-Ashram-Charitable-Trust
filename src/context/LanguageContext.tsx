"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, DICTIONARY, Translations } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: DICTIONARY.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("aasa_locale") as Locale;
    if (saved && (saved === "en" || saved === "mr" || saved === "hi")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("aasa_locale", l);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: DICTIONARY[locale],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
