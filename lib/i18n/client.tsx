"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import type { Messages } from "./server";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  messages: {},
});

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

/**
 * Translate a key in a client component. Returns the key itself if missing.
 *
 * Usage:
 *   const t = useT();
 *   <span>{t("nav.signin")}</span>
 *   <span>{t("welcome", { name: user.name })}</span>
 */
export function useT() {
  const { messages } = useContext(LocaleContext);
  return (key: string, params?: Record<string, string | number>): string => {
    const raw = messages[key];
    if (raw === undefined) return key;
    if (!params) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, k) => {
      const v = params[k];
      return v === undefined ? `{${k}}` : String(v);
    });
  };
}
