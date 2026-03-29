"use client";

import React, { createContext, useContext, useState } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

import { translations } from "@/lib/translations";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const defaultContext: LanguageContextType = {
  language: "es",
  setLanguage: () => {},
  t: (key: string) => key,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "es";
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage === "es" || savedLanguage === "en") {
      return savedLanguage;
    }
    return "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, k)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return defaultContext;
  }
  return context;
}
