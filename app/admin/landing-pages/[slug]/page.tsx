import { notFound, redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
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

  return (
    <FileManager
      page={{
        slug: page.slug,
        title: page.title,
        is_active: page.is_active,
        entry_file: page.entry_file,
        gtm_id: page.gtm_id,
      }}
      initialFiles={(files ?? [])
        .filter((f) => !f.name.startsWith("."))
        .map((f) => ({
          name: f.name,
          size: f.metadata?.size ?? null,
          updated_at: f.updated_at ?? null,
        }))}
    />
  );
}
