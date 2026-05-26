import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { LandingPagesAdmin, type LandingPageRow } from "./landing-pages-admin";

export const dynamic = "force-dynamic";

export default async function LandingPagesPage() {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  const supabase = createSupabaseAdmin();
  const { data: pages, error } = await supabase
    .from("landing_pages")
    .select("slug, title, description, entry_file, is_active, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div>
        <p className="font-sans text-sm text-[#ef4444]" role="alert">
          Could not load landing pages: {error.message}
        </p>
      </div>
    );
  }

  return <LandingPagesAdmin pages={(pages ?? []) as LandingPageRow[]} />;
}
