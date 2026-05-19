"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewLandingPageForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [entryFile, setEntryFile] = useState("index.html");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/landing-pages/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          entry_file: entryFile.trim() || "index.html",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Create failed (${res.status})`);
      router.push(`/admin/landing-pages/${data.landingPage.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        background: "rgba(26,26,53,0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196,163,90,0.20)",
      }}
    >
      <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-4 text-[#c4a35a]">
        ✦ NEW LANDING PAGE
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="lp-slug"
            className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2"
          >
            Slug
          </label>
          <input
            id="lp-slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="winter-promo"
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a]"
          />
          <p className="mt-1 font-mono text-[11px] text-[#4a4866]">
            URL: /lp/{slug || "<slug>"}
          </p>
        </div>
        <div>
          <label
            htmlFor="lp-title"
            className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2"
          >
            Title
          </label>
          <input
            id="lp-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a]"
          />
        </div>
        <div>
          <label
            htmlFor="lp-entry"
            className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2"
          >
            Entry file
          </label>
          <input
            id="lp-entry"
            type="text"
            value={entryFile}
            onChange={(e) => setEntryFile(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
          />
        </div>
        {error && (
          <p className="font-sans text-sm text-[#ef4444]" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Creating…" : "Create ✦"}
        </button>
      </form>
    </div>
  );
}
