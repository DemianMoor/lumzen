import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Admin-managed legal pages (privacy, terms). The central admin panel edits
 * these in English only; uk/ru stay file-based (i18n message catalogs). So we
 * read the DB only for `en` and let the caller fall back to the i18n body for
 * other locales or when no published row exists. Read via anon (RLS: published).
 */
export type LegalRow = { title: string; body: string; seo_description: string | null };

export async function fetchLegalPage(slug: string, locale: string): Promise<LegalRow | null> {
  if (locale !== "en") return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("legal_pages")
    .select("title, body, seo_description")
    .eq("slug", slug)
    .eq("locale", "en")
    .eq("is_published", true)
    .maybeSingle();
  return (data as LegalRow) ?? null;
}
