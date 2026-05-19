import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { NewLandingPageForm } from "./new-landing-page-form";

export const dynamic = "force-dynamic";

export default async function LandingPagesPage() {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  const supabase = createSupabaseAdmin();
  const { data: pages, error } = await supabase
    .from("landing_pages")
    .select("id, slug, title, is_active, gtm_id, entry_file, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <header className="mb-6">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
          ✦ LANDING PAGES
        </p>
        <h1 className="font-serif italic text-3xl text-[#f0eff8]">
          Hosted bundles.
        </h1>
        <p className="font-sans text-sm text-[#8f8daa] mt-2 leading-relaxed max-w-2xl">
          Drop a ZIP bundle (entry HTML + assets) and it serves at{" "}
          <code className="font-mono text-[#c4a35a]">/lp/&lt;slug&gt;</code>.
          GTM is injected automatically.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {error && (
            <p className="font-sans text-sm text-[#ef4444]" role="alert">
              Could not load landing pages: {error.message}
            </p>
          )}

          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(196,163,90,0.10)" }}>
                  <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                    Slug
                  </th>
                  <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {(pages ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-12 text-center font-serif italic text-[#8f8daa]"
                    >
                      No landing pages yet. Create one →
                    </td>
                  </tr>
                )}
                {(pages ?? []).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-[rgba(196,163,90,0.04)] transition-colors"
                    style={{ borderColor: "rgba(196,163,90,0.06)" }}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/landing-pages/${p.slug}`}
                        className="font-mono text-xs text-[#c4a35a] hover:underline"
                      >
                        /lp/{p.slug}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#f0eff8]">{p.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full font-display text-[10px] uppercase tracking-[0.1em]"
                        style={{
                          background: p.is_active
                            ? "rgba(107,204,158,0.18)"
                            : "rgba(255,255,255,0.06)",
                          color: p.is_active ? "#6bcc9e" : "#8f8daa",
                        }}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#8f8daa]">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <NewLandingPageForm />
        </div>
      </div>
    </div>
  );
}
