"use client";

/**
 * Diccionario ligero EN/ES. Inglés primario, español secundario —
 * decisión confirmada hoy. El toggle arranca en "en" por defecto.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import es from "../../messages/es.json";
import en from "../../messages/en.json";

type Dictionary = typeof en;
type Lang = "es" | "en";

const dictionaries: Record<Lang, Dictionary> = { es, en };

type ProLangContextValue = { lang: Lang; setLang: (lang: Lang) => void; t: Dictionary };

const ProLangContext = createContext<ProLangContextValue | null>(null);
const STORAGE_KEY = "gsh_pro_lang";

export function ProLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <ProLangContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </ProLangContext.Provider>
  );
}

export function useProLang() {
  const ctx = useContext(ProLangContext);
  if (!ctx) throw new Error("useProLang debe usarse dentro de <ProLangProvider>");
  return ctx;
}
