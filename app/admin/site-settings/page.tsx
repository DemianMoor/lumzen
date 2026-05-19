import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { SettingsEditor } from "./settings-editor";

export const dynamic = "force-dynamic";

export default async function SiteSettingsPage() {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  const supabase = createSupabaseAdmin();
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("key, value, updated_at")
    .order("key", { ascending: true });

  return (
    <div>
      <header className="mb-6">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
          ✦ SITE SETTINGS
        </p>
        <h1 className="font-serif italic text-3xl text-[#f0eff8]">
          Configuration.
        </h1>
        <p className="font-sans text-sm text-[#8f8daa] mt-2 leading-relaxed max-w-2xl">
          Public reads are open; only editors can write. Values are stored
          as JSONB — strings, numbers, booleans, arrays, and objects all work.
        </p>
      </header>

      {error && (
        <p className="font-sans text-sm text-[#ef4444]" role="alert">
          Could not load settings: {error.message}
        </p>
      )}

      <SettingsEditor initial={settings ?? []} />
    </div>
  );
}
