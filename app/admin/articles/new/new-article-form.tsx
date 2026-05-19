"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";

type Mode = "blank" | "ai";

export function NewArticleForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("blank");
  const [title, setTitle] = useState("");
  const [pillar, setPillar] = useState<PillarSlug>("guides");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBlank(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), pillar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Create failed (${res.status})`);
      router.push(`/admin/articles/${data.article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function handleAi(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!topic.trim()) {
      setError("Topic is required.");
      return;
    }
    setLoading(true);
    try {
      const draftRes = await fetch("/api/admin/articles/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          pillar,
          notes: notes.trim() || undefined,
        }),
      });
      const draftData = await draftRes.json();
      if (!draftRes.ok) {
        throw new Error(draftData.error || `Draft failed (${draftRes.status})`);
      }
      const draft = draftData.draft;

      const createRes = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draft.title, pillar }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(
          createData.error || `Create failed (${createRes.status})`,
        );
      }
      const articleId = createData.article.id;

      const patchRes = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtitle: draft.subtitle ?? "",
          excerpt: draft.excerpt ?? "",
          content: draft.content,
          tags: draft.tags ?? [],
        }),
      });
      if (!patchRes.ok) {
        const errData = await patchRes.json().catch(() => ({}));
        throw new Error(errData.error || `Could not save draft body.`);
      }

      router.push(`/admin/articles/${articleId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-2xl border p-6 md:p-8"
      style={{
        background: "rgba(26,26,53,0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196,163,90,0.20)",
      }}
    >
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("blank")}
          className={`px-4 py-2 rounded-full font-sans text-xs transition-all ${
            mode === "blank"
              ? "bg-[#c4a35a] text-[#06060f]"
              : "border border-[rgba(255,255,255,0.10)] text-[#8f8daa] hover:text-[#f0eff8]"
          }`}
        >
          Blank draft
        </button>
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`px-4 py-2 rounded-full font-sans text-xs transition-all ${
            mode === "ai"
              ? "bg-[#c4a35a] text-[#06060f]"
              : "border border-[rgba(255,255,255,0.10)] text-[#8f8daa] hover:text-[#f0eff8]"
          }`}
        >
          AI draft ✦
        </button>
      </div>

      {mode === "blank" ? (
        <form onSubmit={handleBlank} className="space-y-4">
          <div>
            <label
              htmlFor="new-title"
              className="block font-sans text-xs text-[#8f8daa] mb-2"
            >
              Title
            </label>
            <input
              id="new-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-serif text-lg text-[#f0eff8] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
            />
          </div>
          <PillarSelect value={pillar} onChange={setPillar} />
          {error && (
            <p className="font-sans text-sm text-[#ef4444]" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create draft ✦"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleAi} className="space-y-4">
          <div>
            <label
              htmlFor="ai-topic"
              className="block font-sans text-xs text-[#8f8daa] mb-2"
            >
              Topic
            </label>
            <input
              id="ai-topic"
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='e.g. "The throat chakra and the practice of honest speech"'
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
            />
          </div>
          <PillarSelect value={pillar} onChange={setPillar} />
          <div>
            <label
              htmlFor="ai-notes"
              className="block font-sans text-xs text-[#8f8daa] mb-2"
            >
              Editor notes <span className="text-[#4a4866]">(optional)</span>
            </label>
            <textarea
              id="ai-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Angle, audience, what to avoid…"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all leading-relaxed"
            />
          </div>
          {error && (
            <p className="font-sans text-sm text-[#ef4444]" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Drafting with Claude (up to 60s)…" : "Generate draft ✦"}
          </button>
          <p className="font-sans text-[11px] text-[#4a4866] leading-relaxed">
            Claude composes a draft against the LumZen voice rules. You will
            land in the editor with the body filled in, free to revise.
          </p>
        </form>
      )}
    </div>
  );
}

function PillarSelect({
  value,
  onChange,
}: {
  value: PillarSlug;
  onChange: (v: PillarSlug) => void;
}) {
  return (
    <div>
      <label
        htmlFor="new-pillar"
        className="block font-sans text-xs text-[#8f8daa] mb-2"
      >
        Pillar
      </label>
      <select
        id="new-pillar"
        value={value}
        onChange={(e) => onChange(e.target.value as PillarSlug)}
        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
      >
        {Object.entries(PILLARS).map(([slug, meta]) => (
          <option key={slug} value={slug}>
            {meta.name}
          </option>
        ))}
      </select>
    </div>
  );
}
