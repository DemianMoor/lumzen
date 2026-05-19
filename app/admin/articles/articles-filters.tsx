"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PILLARS } from "@/lib/brand-voice";

export function ArticlesFilters({
  initialQ,
  initialPillar,
  initialStatus,
}: {
  initialQ: string;
  initialPillar: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQ);

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    router.push(`/admin/articles?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ q });
        }}
        className="flex-1 min-w-[240px]"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, slug, subtitle…"
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
        />
      </form>

      <select
        value={initialPillar}
        onChange={(e) => update({ pillar: e.target.value })}
        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-4 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
      >
        <option value="">All pillars</option>
        {Object.entries(PILLARS).map(([slug, meta]) => (
          <option key={slug} value={slug}>
            {meta.name}
          </option>
        ))}
      </select>

      <select
        value={initialStatus}
        onChange={(e) => update({ status: e.target.value })}
        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-4 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
      >
        <option value="">All statuses</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>

      {(initialQ || initialPillar || initialStatus) && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.push("/admin/articles");
          }}
          className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
