import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writings — LumZen",
  description:
    "Essays and field notes from the LumZen practice — where light meets stillness.",
};

type ArticleCard = {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  pillar: string;
  image_url: string | null;
  published_at: string | null;
};

const PILLAR_ORDER: PillarSlug[] = [
  "guides",
  "audiobooks",
  "affirmations",
  "sound",
  "celestial",
];

function fmtDate(ts: string | null) {
  return ts
    ? new Date(ts).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
}

export default async function ArticlesPage() {
  const supabase = await createSupabaseServerClient();
  // Canonical columns; published only (RLS enforces this too); en scope.
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, subtitle, excerpt, pillar, image_url, published_at")
    .eq("status", "published")
    .eq("locale", "en")
    .order("published_at", { ascending: false });

  const list = (articles ?? []) as ArticleCard[];

  // Group by pillar, render in the canonical pillar order; skip empty pillars.
  const byPillar = new Map<string, ArticleCard[]>();
  for (const a of list) {
    const arr = byPillar.get(a.pillar) ?? [];
    arr.push(a);
    byPillar.set(a.pillar, arr);
  }

  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-16">
          <p className="font-display text-[11px] tracking-[0.25em] uppercase text-[#c4a35a] mb-4">
            ✦ The Writings
          </p>
          <h1 className="font-serif italic text-4xl md:text-6xl text-[#f0eff8] leading-tight mb-5">
            Where light meets stillness
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa] max-w-xl mx-auto">
            Essays and field notes across the five paths of practice.
          </p>
        </header>

        {list.length === 0 ? (
          <p className="text-center font-serif italic text-[#8f8daa]">
            The library is quiet for now. New writings are on their way.
          </p>
        ) : (
          <div className="space-y-20">
            {PILLAR_ORDER.filter((p) => byPillar.has(p)).map((pillar) => {
              const meta = PILLARS[pillar];
              const accent = meta?.accent ?? "#c4a35a";
              return (
                <section key={pillar}>
                  <div className="flex items-center gap-3 mb-7">
                    <span style={{ color: accent }} className="text-lg leading-none">
                      ✦
                    </span>
                    <h2
                      className="font-display text-[12px] tracking-[0.25em] uppercase"
                      style={{ color: accent }}
                    >
                      {meta?.name ?? pillar}
                    </h2>
                    <span
                      className="h-px flex-1"
                      style={{ background: `${accent}33` }}
                    />
                  </div>

                  <ul className="grid sm:grid-cols-2 gap-6">
                    {byPillar.get(pillar)!.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/articles/${a.slug}`}
                          className="group block h-full rounded-2xl border p-6 transition-all hover:-translate-y-1"
                          style={{
                            background: "rgba(12,12,30,0.6)",
                            borderColor: `${accent}26`,
                          }}
                        >
                          {a.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.image_url}
                              alt=""
                              className="mb-5 aspect-[16/9] w-full rounded-xl object-cover opacity-90"
                            />
                          )}
                          <h3 className="font-serif italic text-2xl text-[#f0eff8] leading-snug mb-2 group-hover:text-[#c4a35a] transition-colors">
                            {a.title}
                          </h3>
                          {(a.excerpt || a.subtitle) && (
                            <p className="font-serif text-[15px] text-[#8f8daa] leading-relaxed mb-4 line-clamp-3">
                              {a.excerpt || a.subtitle}
                            </p>
                          )}
                          <p className="font-mono text-[11px] tracking-wide text-[#4a4866]">
                            {fmtDate(a.published_at)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
