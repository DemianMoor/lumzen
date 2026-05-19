import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";
import { ArticlesFilters } from "./articles-filters";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  pillar?: string;
  status?: string;
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  const { q = "", pillar = "", status = "" } = await searchParams;

  const supabase = createSupabaseAdmin();
  let query = supabase
    .from("articles")
    .select(
      "id, slug, title, subtitle, pillar, status, scheduled_for, published_at, updated_at, tags",
    )
    .order("updated_at", { ascending: false })
    .limit(200);

  if (q.trim()) {
    const term = q.trim();
    query = query.or(
      `title.ilike.%${term}%,slug.ilike.%${term}%,subtitle.ilike.%${term}%`,
    );
  }
  if (pillar && Object.prototype.hasOwnProperty.call(PILLARS, pillar)) {
    query = query.eq("pillar", pillar);
  }
  if (status && ["draft", "scheduled", "published"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data: articles, error } = await query;

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
            ✦ ARTICLES
          </p>
          <h1 className="font-serif italic text-3xl text-[#f0eff8]">
            Editorial inventory
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/articles/import"
            className="inline-block py-2 px-5 rounded-full border border-[#c4a35a] text-[#c4a35a] font-sans text-sm hover:bg-[rgba(196,163,90,0.10)] transition-all"
          >
            Bulk import →
          </Link>
          <Link
            href="/admin/articles/new"
            className="inline-block py-2 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
          >
            New article ✦
          </Link>
        </div>
      </header>

      <ArticlesFilters
        initialQ={q}
        initialPillar={pillar}
        initialStatus={status}
      />

      {error && (
        <p className="mt-6 font-sans text-sm text-[#ef4444]" role="alert">
          Could not load articles: {error.message}
        </p>
      )}

      <div
        className="mt-6 rounded-2xl border overflow-hidden"
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
                Title
              </th>
              <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Pillar
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
            {(articles ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-[#8f8daa] font-serif italic"
                >
                  Nothing here yet. Begin a new article above.
                </td>
              </tr>
            )}
            {(articles ?? []).map((a) => {
              const pillarMeta = PILLARS[a.pillar as PillarSlug];
              return (
                <tr
                  key={a.id}
                  className="border-b last:border-0 hover:bg-[rgba(196,163,90,0.04)] transition-colors"
                  style={{ borderColor: "rgba(196,163,90,0.06)" }}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="block text-[#f0eff8] hover:text-[#c4a35a] transition-colors"
                    >
                      <span className="font-serif text-base">{a.title}</span>
                      <span className="block text-[11px] font-mono text-[#4a4866] mt-0.5">
                        /{a.slug}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-display uppercase tracking-[0.1em]"
                      style={{
                        background: `${pillarMeta?.accent ?? "#c4a35a"}22`,
                        color: pillarMeta?.accent ?? "#c4a35a",
                      }}
                    >
                      {pillarMeta?.name ?? a.pillar}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-[#8f8daa]">
                    {a.status}
                    {a.status === "scheduled" && a.scheduled_for && (
                      <span className="block text-[11px] font-mono text-[#4a4866]">
                        {new Date(a.scheduled_for).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#8f8daa]">
                    {new Date(a.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 font-mono text-[11px] text-[#4a4866]">
        Showing {articles?.length ?? 0} article{articles?.length === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
