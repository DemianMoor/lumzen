import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentLocale, getCurrentMessages, t } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { messages } = await getCurrentMessages();
  const locale = await getCurrentLocale();
  const { data: guide } = await supabase
    .from("spiritual_guides")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .maybeSingle();

  if (!guide) notFound();

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(196,163,90,0.25)] bg-[rgba(196,163,90,0.06)] px-4 py-2 font-sans text-xs text-[#f0eff8] hover:bg-[rgba(196,163,90,0.14)] hover:border-[rgba(196,163,90,0.45)] hover:text-[#c4a35a] transition-all"
        >
          {t(messages, "guides.detail.back_to_guides")}
        </Link>

        <header className="my-10 text-center">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            {guide.category.replace(/_/g, " ")}
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-4 leading-tight">
            {guide.title}
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa] mb-2">
            {guide.description}
          </p>
          <p className="font-sans text-xs text-[#8f8daa]">
            {guide.read_time_minutes
              ? `${guide.read_time_minutes} ${t(messages, "guides.list.minutes_read_suffix")}`
              : ""}
            {guide.author ? ` · ${guide.author}` : ""}
          </p>
        </header>

        <div className="font-serif text-[17px] leading-[1.75] text-[#f0eff8] guide-body">
          {renderMarkdown(guide.content ?? "")}
        </div>
      </article>
    </main>
  );
}

/**
 * Tiny markdown renderer for the seeded guides. Handles `## `, `### `,
 * `- ` lists, paragraph breaks. Inline `**bold**` and `_italic_`.
 */
function renderMarkdown(md: string) {
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-display text-[12px] tracking-[0.25em] uppercase text-[#c4a35a] mt-12 mb-4"
        >
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="font-serif italic text-2xl text-[#f0eff8] mt-10 mb-3"
        >
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split(/\n/).map((line) => line.replace(/^-\s+/, ""));
      return (
        <ul key={i} className="my-4 space-y-2 list-disc list-inside text-[#f0eff8]">
          {items.map((item, j) => (
            <li key={j}>{inline(item)}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(block)) {
      const items = block.split(/\n/).map((line) => line.replace(/^\d+\.\s+/, ""));
      return (
        <ol
          key={i}
          className="my-4 space-y-2 list-decimal list-inside text-[#f0eff8]"
        >
          {items.map((item, j) => (
            <li key={j}>{inline(item)}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="my-4">
        {inline(block)}
      </p>
    );
  });
}

function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("_") && p.endsWith("_")) {
      return <em key={i}>{p.slice(1, -1)}</em>;
    }
    return <span key={i}>{p}</span>;
  });
}
