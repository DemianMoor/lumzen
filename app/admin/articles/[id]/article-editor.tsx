"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";
import { ArticleImage } from "@/components/article-image";

export type ArticleRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  excerpt: string | null;
  hero_image_url: string | null;
  pillar: PillarSlug;
  tags: string[];
  status: "draft" | "scheduled" | "published";
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function ArticleEditor({ article: initial }: { article: ArticleRecord }) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [subtitle, setSubtitle] = useState(initial.subtitle ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [pillar, setPillar] = useState<PillarSlug>(initial.pillar);
  const [heroUrl, setHeroUrl] = useState(initial.hero_image_url ?? "");
  const [tagsInput, setTagsInput] = useState(initial.tags.join(", "));
  const [scheduledFor, setScheduledFor] = useState(
    initial.scheduled_for ? toDatetimeLocal(initial.scheduled_for) : "",
  );

  const [status, setStatus] = useState(initial.status);
  const [publishedAt, setPublishedAt] = useState(initial.published_at);
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });
  const [uploadBusy, setUploadBusy] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const initialJsonRef = useRef(
    JSON.stringify({
      title: initial.title,
      slug: initial.slug,
      subtitle: initial.subtitle ?? "",
      excerpt: initial.excerpt ?? "",
      content: initial.content ?? "",
      pillar: initial.pillar,
      hero: initial.hero_image_url ?? "",
      tags: initial.tags.join(", "),
      scheduled: initial.scheduled_for ?? "",
    }),
  );

  const currentJson = JSON.stringify({
    title,
    slug,
    subtitle,
    excerpt,
    content,
    pillar,
    hero: heroUrl,
    tags: tagsInput,
    scheduled: scheduledFor
      ? new Date(scheduledFor).toISOString()
      : "",
  });
  const hasChanges = currentJson !== initialJsonRef.current;

  useEffect(() => {
    if (!hasChanges) return;
    const t = setTimeout(() => {
      void save({ silent: true });
    }, 2000);
    return () => clearTimeout(t);
  }, [currentJson]);

  async function save({ silent = false } = {}): Promise<boolean> {
    setSaveState({ kind: "saving" });
    const tagsArray = tagsInput
      .split(/[,;]/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch(`/api/admin/articles/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          subtitle: subtitle.trim(),
          excerpt: excerpt.trim(),
          content,
          pillar,
          hero_image_url: heroUrl.trim() || null,
          tags: tagsArray,
          scheduled_for: scheduledFor
            ? new Date(scheduledFor).toISOString()
            : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveState({
          kind: "error",
          message: data.error || "Could not save.",
        });
        return false;
      }
      initialJsonRef.current = currentJson;
      if (data.article?.slug) setSlug(data.article.slug);
      setSaveState({ kind: "saved" });
      if (!silent) router.refresh();
      return true;
    } catch {
      setSaveState({ kind: "error", message: "Network error." });
      return false;
    }
  }

  async function changeStatus(
    next: "draft" | "scheduled" | "published",
  ) {
    if (next === "scheduled" && !scheduledFor) {
      setSaveState({
        kind: "error",
        message: "Pick a scheduled date first.",
      });
      return;
    }
    const ok = await save({ silent: true });
    if (!ok) return;
    setSaveState({ kind: "saving" });
    const payload: Record<string, unknown> = { status: next };
    if (next === "scheduled") {
      payload.scheduled_for = scheduledFor
        ? new Date(scheduledFor).toISOString()
        : null;
    }
    const res = await fetch(`/api/admin/articles/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setSaveState({ kind: "error", message: data.error || "Could not update status." });
      return;
    }
    setStatus(data.article.status);
    setPublishedAt(data.article.published_at);
    setSaveState({ kind: "saved" });
    router.refresh();
  }

  async function deleteArticle() {
    const res = await fetch(`/api/admin/articles/${initial.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setSaveState({ kind: "error", message: "Could not delete." });
      return;
    }
    router.push("/admin/articles");
  }

  async function handleImageUpload(file: File) {
    setUploadBusy(true);
    setSaveState({ kind: "saving" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", `articles/${initial.id}`);
      const res = await fetch("/api/admin/articles/images/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setHeroUrl(data.url);
      setSaveState({ kind: "idle" });
    } catch (err) {
      setSaveState({
        kind: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    } finally {
      setUploadBusy(false);
    }
  }

  const accent = PILLARS[pillar].accent;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b" style={{ borderColor: "rgba(196,163,90,0.15)" }}>
        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
            ✦ ARTICLES /{" "}
            <Link
              href="/admin/articles"
              className="hover:text-[#f0eff8] transition-colors"
            >
              all
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <SaveLabel state={saveState} hasChanges={hasChanges} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {status === "draft" && (
            <>
              <button
                type="button"
                onClick={() => changeStatus("scheduled")}
                className="py-2 px-4 rounded-full border border-[rgba(255,255,255,0.10)] text-[#8f8daa] font-sans text-sm hover:text-[#f0eff8] hover:border-[#c4a35a] transition-all"
              >
                Schedule
              </button>
              <button
                type="button"
                onClick={() => changeStatus("published")}
                className="py-2 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
              >
                Publish now ✦
              </button>
            </>
          )}
          {status === "scheduled" && (
            <>
              <button
                type="button"
                onClick={() => changeStatus("draft")}
                className="py-2 px-4 rounded-full border border-[rgba(255,255,255,0.10)] text-[#8f8daa] font-sans text-sm hover:text-[#f0eff8] hover:border-[#c4a35a] transition-all"
              >
                Move to draft
              </button>
              <button
                type="button"
                onClick={() => changeStatus("published")}
                className="py-2 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
              >
                Publish now ✦
              </button>
            </>
          )}
          {status === "published" && (
            <button
              type="button"
              onClick={() => changeStatus("draft")}
              className="py-2 px-4 rounded-full border border-[rgba(255,255,255,0.10)] text-[#8f8daa] font-sans text-sm hover:text-[#f0eff8] hover:border-[#c4a35a] transition-all"
            >
              Unpublish
            </button>
          )}
        </div>
      </div>

      {publishedAt && status !== "draft" && (
        <p className="mt-4 font-mono text-xs text-[#8f8daa]">
          {status === "scheduled" ? "Scheduled for: " : "Published: "}
          {new Date(publishedAt).toLocaleString()}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div
          className="lg:col-span-2 rounded-2xl border p-6 md:p-8"
          style={{
            background: "rgba(26,26,53,0.85)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(196,163,90,0.15)",
          }}
        >
          <label className="block">
            <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article headline"
              className="mt-2 w-full bg-transparent font-serif italic text-3xl md:text-4xl text-[#f0eff8] focus:outline-none placeholder:text-[#4a4866]"
            />
          </label>

          <label className="mt-6 block">
            <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
              Subtitle
            </span>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="One-line dek"
              className="mt-2 w-full bg-transparent font-serif text-lg text-[#f0eff8] focus:outline-none placeholder:text-[#4a4866]"
            />
          </label>

          <label className="mt-6 block">
            <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
              Excerpt
            </span>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Summary used on cards and meta description (2–3 sentences)."
              className="mt-2 w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg p-3 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all placeholder:text-[#4a4866]"
            />
          </label>

          <label className="mt-6 block">
            <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
              Body (markdown)
            </span>
            <textarea
              rows={30}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="## Open with a hook, then build the argument…"
              className="mt-2 w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 font-mono text-sm text-[#f0eff8] leading-relaxed focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all placeholder:text-[#4a4866]"
            />
            <p className="mt-2 font-sans text-xs text-[#4a4866]">
              Markdown: ## for subheadings, blank lines between paragraphs,
              *italic*, **bold**, &gt; quote, &gt; - bullet.
            </p>
          </label>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
              ✦ METADATA
            </p>

            <label className="block">
              <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Pillar
              </span>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as PillarSlug)}
                className="mt-2 w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
              >
                {Object.entries(PILLARS).map(([s, m]) => (
                  <option key={s} value={s}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Slug
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-2 w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a]"
              />
              <p className="mt-1 font-mono text-[11px] text-[#4a4866]">
                /article/{slug}
              </p>
            </label>

            <label className="mt-4 block">
              <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Tags
              </span>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="comma, separated"
                className="mt-2 w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a]"
              />
            </label>

            <label className="mt-4 block">
              <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Scheduled for
              </span>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="mt-2 w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
              />
              {scheduledFor && (
                <button
                  type="button"
                  onClick={() => setScheduledFor("")}
                  className="mt-2 font-sans text-[11px] text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
                >
                  Clear date
                </button>
              )}
            </label>
          </div>

          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
              ✦ HERO IMAGE
            </p>

            <ArticleImage src={heroUrl || null} alt={title} accent={accent} />

            <label className="mt-4 block">
              <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                URL
              </span>
              <input
                type="url"
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                placeholder="https://…"
                className="mt-2 w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-[11px] text-[#f0eff8] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a]"
              />
            </label>

            <label className="mt-4 block">
              <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Or upload
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={uploadBusy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleImageUpload(f);
                  e.target.value = "";
                }}
                className="mt-2 block w-full font-sans text-xs text-[#8f8daa] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#c4a35a] file:text-[#06060f] file:font-medium file:cursor-pointer disabled:opacity-60"
              />
              {uploadBusy && (
                <p className="mt-2 font-sans text-xs text-[#8f8daa]">
                  Uploading…
                </p>
              )}
            </label>
          </div>

          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <button
              type="button"
              onClick={() => void save()}
              disabled={!hasChanges || saveState.kind === "saving"}
              className="w-full py-2.5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saveState.kind === "saving" ? "Saving…" : "Save now"}
            </button>
            <p className="mt-2 text-center font-sans text-[11px] text-[#4a4866]">
              Autosave runs 2 seconds after each edit.
            </p>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(196,163,90,0.10)" }}>
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="block w-full text-center font-sans text-xs text-[#8f8daa] hover:text-[#ef4444] transition-colors"
              >
                Delete article
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{
            background: "rgba(6,6,15,0.75)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-8"
            style={{
              background: "rgba(26,26,53,0.95)",
              borderColor: "rgba(196,163,90,0.20)",
            }}
          >
            <h3 className="font-serif italic text-2xl text-[#f0eff8]">
              Delete this article?
            </h3>
            <p className="mt-2 font-sans text-sm text-[#8f8daa]">
              This cannot be undone. The article and its slug{" "}
              <code className="font-mono text-[#c4a35a]">{initial.slug}</code>{" "}
              will be removed.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="py-2 px-4 rounded-full border border-[rgba(255,255,255,0.10)] text-[#8f8daa] font-sans text-sm hover:text-[#f0eff8] hover:border-[#c4a35a] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteArticle}
                className="py-2 px-4 rounded-full bg-[#ef4444] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-[rgba(255,255,255,0.06)] text-[#8f8daa]",
    scheduled: "bg-[rgba(196,163,90,0.20)] text-[#c4a35a]",
    published: "bg-[rgba(107,204,158,0.18)] text-[#6bcc9e]",
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full font-display text-[10px] uppercase tracking-[0.15em] ${styles[status] ?? styles.draft}`}
    >
      {status}
    </span>
  );
}

function SaveLabel({
  state,
  hasChanges,
}: {
  state: SaveState;
  hasChanges: boolean;
}) {
  if (state.kind === "saving") {
    return <span className="font-mono text-xs text-[#8f8daa]">Saving…</span>;
  }
  if (state.kind === "error") {
    return <span className="font-mono text-xs text-[#ef4444]">{state.message}</span>;
  }
  if (state.kind === "saved") {
    return <span className="font-mono text-xs text-[#6bcc9e]">Saved ✓</span>;
  }
  return (
    <span className="font-mono text-xs text-[#8f8daa]">
      {hasChanges ? "Unsaved changes" : "No changes"}
    </span>
  );
}
