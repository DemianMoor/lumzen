import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { HOST_BY_LOCALE, localeFromHost } from "@/lib/i18n/config";
import { createSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/subscribe",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") || HOST_BY_LOCALE.en;
  const locale = localeFromHost(host);
  const base = `https://${HOST_BY_LOCALE[locale]}`;

  const entries: MetadataRoute.Sitemap = PUBLIC_PATHS.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.6,
  }));

  // Add published articles + active guides for the current locale.
  try {
    const supabase = createSupabaseAdmin();

    const { data: articles } = await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("locale", locale)
      .eq("status", "published");

    if (articles) {
      for (const a of articles) {
        entries.push({
          url: `${base}/articles/${a.slug}`,
          lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }

    const { data: guides } = await supabase
      .from("spiritual_guides")
      .select("slug, updated_at")
      .eq("locale", locale)
      .eq("is_active", true);

    if (guides) {
      for (const g of guides) {
        entries.push({
          url: `${base}/guides/${g.slug}`,
          lastModified: g.updated_at ? new Date(g.updated_at) : new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // Supabase unreachable at build time — return the static portion.
  }

  return entries;
}
