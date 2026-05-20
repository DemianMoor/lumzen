import { DEFAULT_LOCALE, LOCALE_HEADER, type Locale, isValidLocale, localeFromHost } from "./config";

import enMessages from "@/messages/en.json";
import ukMessages from "@/messages/uk.json";
import ruMessages from "@/messages/ru.json";

export type Messages = Record<string, string>;

const ALL_MESSAGES: Record<Locale, Messages> = {
  en: enMessages as Messages,
  uk: ukMessages as Messages,
  ru: ruMessages as Messages,
};

/**
 * Read the current locale from the request headers.
 * Set by proxy.ts based on hostname. Falls back to "en".
 *
 * Server-only — uses next/headers via dynamic import.
 */
export async function getCurrentLocale(): Promise<Locale> {
  const { headers } = await import("next/headers");
  const h = await headers();
  const fromHeader = h.get(LOCALE_HEADER);
  if (fromHeader && isValidLocale(fromHeader)) return fromHeader;
  // Fallback: derive from Host header in case proxy.ts didn't run on this path.
  return localeFromHost(h.get("host"));
}

/**
 * Read the locale from an API route's incoming Request.
 * Use in route handlers where headers() is awkward.
 */
export function getLocaleFromRequest(req: Request): Locale {
  const headerLocale = req.headers.get(LOCALE_HEADER);
  if (headerLocale && isValidLocale(headerLocale)) return headerLocale;
  return localeFromHost(req.headers.get("host"));
}

export function getMessages(locale: Locale): Messages {
  return ALL_MESSAGES[locale] ?? ALL_MESSAGES[DEFAULT_LOCALE];
}

export async function getCurrentMessages(): Promise<{ locale: Locale; messages: Messages }> {
  const locale = await getCurrentLocale();
  return { locale, messages: getMessages(locale) };
}

/**
 * Translate a key. Missing keys fall back to the English message, then to
 * the key itself. Tokens like {name} are replaced from `params`.
 *
 * Usage in a server component:
 *   const { messages } = await getCurrentMessages();
 *   <h1>{t(messages, "landing.hero.title")}</h1>
 */
export function t(
  messages: Messages,
  key: string,
  params?: Record<string, string | number>,
): string {
  let raw = messages[key];
  if (raw === undefined) {
    raw = ALL_MESSAGES[DEFAULT_LOCALE][key];
  }
  if (raw === undefined) return key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k) => {
    const v = params[k];
    return v === undefined ? `{${k}}` : String(v);
  });
}
