import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";
import { ArticleBody } from "@/components/article-body";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

function fmtDate(ts: string | null) {
  return ts
    ? new Date(ts).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: a } = await supabase
    .from("articles")
    .select("title, subtitle, excerpt, seo_title, seo_description, image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("locale", "en")
    .maybeSingle();

  if (!a) return {};
  const description = a.seo_description || a.excerpt || a.subtitle || undefined;
  return {
    title: `${a.seo_title || a.title} — LumZen`,
    description,
    openGraph: {
      title: a.title,
      description,
      type: "article",
      images: a.image_url ? [{ url: a.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description,
      images: a.image_url ? [a.image_url] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  // Canonical columns; published only; en scope.
  const { data: article } = await supabase
    .from("articles")
    .select(
      "slug, title, subtitle, excerpt, body, pillar, byline, image_url, image_alt, image_credit, tags, published_at, author_id",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("locale", "en")
    .maybeSingle();

  if (!article) notFound();

  const meta = PILLARS[article.pillar as PillarSlug];
  const accent = meta?.accent ?? "#c4a35a";
  const tags: string[] = Array.isArray(article.tags) ? article.tags : [];

  return (
    <div className="px-6 py-16 md:py-24">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(196,163,90,0.25)] bg-[rgba(196,163,90,0.06)] px-4 py-2 font-sans text-xs text-[#f0eff8] transition-all hover:border-[rgba(196,163,90,0.45)] hover:bg-[rgba(196,163,90,0.14)] hover:text-[#c4a35a]"
        >
          ← The Writings
        </Link>

        <header className="my-10 text-center">
          <p
            className="font-display text-[11px] tracking-[0.25em] uppercase mb-4"
            style={{ color: accent }}
          >
            ✦ {meta?.name ?? article.pillar}
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] leading-tight mb-5">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="font-serif italic text-lg md:text-xl text-[#8f8daa] mb-5 leading-relaxed">
              {article.subtitle}
            </p>
          )}
          <p className="font-mono text-[11px] tracking-wide text-[#4a4866]">
            {article.byline ? `${article.byline} · ` : ""}
            {fmtDate(article.published_at)}
          </p>
        </header>

        {article.image_url && (
          <figure className="mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image_url}
              alt={article.image_alt ?? ""}
              className="w-full rounded-2xl object-cover"
              style={{ border: "1px solid rgba(196,163,90,0.15)" }}
            />
            {article.image_credit && (
              <figcaption className="mt-2 text-center font-sans text-[11px] italic text-[#4a4866]">
                {article.image_credit}
              </figcaption>
            )}
          </figure>
        )}

        <ArticleBody body={article.body} />

        {tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 font-sans text-xs text-[#8f8daa]"
                style={{ borderColor: "rgba(196,163,90,0.2)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <span className="text-[#c4a35a] text-lg">✦</span>
        </div>
      </article>
    </div>
  );
}
