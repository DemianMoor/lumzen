/**
 * LumZen i18n configuration.
 *
 * Locale is determined entirely by hostname:
 *   lumzen.co        -> "en"
 *   ua.lumzen.co     -> "uk"
 *   ru.lumzen.co     -> "ru"
 *
 * There is no /locale/ prefix in the URL. The hostname is authoritative.
 * No language switcher anywhere in the UI — each subdomain feels like
 * its own site.
 */

export const LOCALES = ["en", "uk", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_BY_HOST: Record<string, Locale> = {
  "lumzen.co": "en",
  "www.lumzen.co": "en",
  "ua.lumzen.co": "uk",
  "ru.lumzen.co": "ru",
};

export const HOST_BY_LOCALE: Record<Locale, string> = {
  en: "lumzen.co",
  uk: "ua.lumzen.co",
  ru: "ru.lumzen.co",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  uk: "Ukrainian",
  ru: "Russian",
};

/**
 * The header proxy.ts injects so RSC can read the locale via next/headers.
 */
export const LOCALE_HEADER = "x-lumzen-locale";

/**
 * Resolve a locale from any hostname value. Accepts host with or without
 * port. Defaults to "en" for any unrecognized host (localhost, previews,
 * Vercel deployment URLs). Use NEXT_PUBLIC_FORCED_LOCALE in dev to override.
 */
export function localeFromHost(host: string | null | undefined): Locale {
  if (!host) return DEFAULT_LOCALE;
  const cleanHost = host.split(":")[0].toLowerCase();
  return LOCALE_BY_HOST[cleanHost] ?? DEFAULT_LOCALE;
}

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Cookie domain so Supabase auth cookies are shared across subdomains.
 * In production: ".lumzen.co". In dev: undefined (default host scoping).
 */
export function cookieDomainForHost(host: string | null | undefined): string | undefined {
  if (!host) return undefined;
  const cleanHost = host.split(":")[0].toLowerCase();
  if (cleanHost === "lumzen.co" || cleanHost.endsWith(".lumzen.co")) {
    return ".lumzen.co";
  }
  return undefined;
}
