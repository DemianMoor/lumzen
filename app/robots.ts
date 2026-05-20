import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { HOST_BY_LOCALE, localeFromHost } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("host") || HOST_BY_LOCALE.en;
  const locale = localeFromHost(host);
  const base = `https://${HOST_BY_LOCALE[locale]}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth/callback", "/dashboard"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: HOST_BY_LOCALE[locale],
  };
}
