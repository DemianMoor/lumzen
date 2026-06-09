import React from "react";

/**
 * Renders an article body in LumZen's editorial style. Central-admin articles
 * store HTML (TipTap); older/markdown bodies fall back to a tiny markdown
 * renderer (same approach as the guides pages). Styled via .prose-lumzen.
 */
const HTML_BODY_RE =
  /^\s*<(p|h[1-6]|ul|ol|li|blockquote|figure|img|div|hr|table|pre|strong|em|a|mark|u|s|br|span)\b/i;

export function ArticleBody({ body }: { body: string | null | undefined }) {
  const html = body ?? "";
  if (HTML_BODY_RE.test(html)) {
    // HTML from the TipTap editor — rendered in the editorial prose container.
    return (
      <div
        className="prose-lumzen font-serif text-[17px] leading-[1.8] text-[#f0eff8]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <div className="prose-lumzen font-serif text-[17px] leading-[1.8] text-[#f0eff8]">
      {renderMarkdown(html)}
    </div>
  );
}

function renderMarkdown(md: string) {
  return md.split(/\n\n+/).map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-[12px] tracking-[0.25em] uppercase text-[#c4a35a] mt-12 mb-4">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="font-serif italic text-2xl text-[#f0eff8] mt-10 mb-3">
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split(/\n/).map((l) => l.replace(/^-\s+/, ""));
      return (
        <ul key={i} className="my-4 space-y-2 list-disc list-inside">
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ul>
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
  return text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("_") && p.endsWith("_")) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}
