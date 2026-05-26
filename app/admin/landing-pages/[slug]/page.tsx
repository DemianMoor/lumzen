import { notFound, redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { effectiveChromeState } from "@/lib/landing-page-chrome";
import { FileManager } from "./file-manager";

export const dynamic = "force-dynamic";

export default async function LandingPageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  const { slug } = await params;
  const supabase = createSupabaseAdmin();
  const { data: page, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !page) notFound();

  const { data: files } = await supabase.storage
    .from("landing-pages")
    .list(slug, { limit: 1000, sortBy: { column: "name", order: "asc" } });

  const chromeState = effectiveChromeState({
    use_site_chrome: page.use_site_chrome ?? false,
    chrome_revert_to: page.chrome_revert_to ?? null,
    chrome_revert_at: page.chrome_revert_at ?? null,
  });

  return (
    <FileManager
      page={{
        slug: page.slug,
        title: page.title,
        description: page.description ?? null,
        is_active: page.is_active,
        entry_file: page.entry_file,
        gtm_id: page.gtm_id,
      }}
      initialFiles={(files ?? [])
        .filter((f) => !f.name.startsWith(".") && f.metadata)
        .map((f) => ({
          path: f.name,
          size: f.metadata?.size ?? 0,
          updated_at: f.updated_at ?? null,
        }))}
      chrome={{
        useSiteChrome: page.use_site_chrome ?? false,
        effective: chromeState.effective,
        pendingRevertAtIso: chromeState.pendingRevertAt
          ? chromeState.pendingRevertAt.toISOString()
          : null,
        pendingRevertTo: chromeState.pendingRevertTo,
      }}
    />
  );
}
