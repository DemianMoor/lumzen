"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ImportResult = {
  inserted: number;
  updated: number;
  skipped: number;
  errors: { row: number; reason: string }[];
};

export function ImportForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) {
      setError("Choose a CSV file first.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/articles/import", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Import failed (${res.status})`);
      }
      setResult(data.result);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="csv-file"
            className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2"
          >
            CSV file
          </label>
          <input
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full font-sans text-sm text-[#8f8daa] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#c4a35a] file:text-[#06060f] file:font-medium file:cursor-pointer"
          />
        </div>

        {error && (
          <p className="font-sans text-sm text-[#ef4444]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !file}
          className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Importing…" : "Import ✦"}
        </button>
      </form>

      {result && (
        <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(196,163,90,0.10)" }}>
          <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
            ✦ RESULT
          </p>
          <ul className="font-mono text-sm text-[#f0eff8] space-y-1">
            <li>Inserted: {result.inserted}</li>
            <li>Updated: {result.updated}</li>
            <li>Skipped: {result.skipped}</li>
          </ul>
          {result.errors.length > 0 && (
            <div className="mt-4">
              <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-2 text-[#ef4444]">
                ROW ERRORS
              </p>
              <ul className="font-mono text-xs text-[#8f8daa] space-y-1 max-h-48 overflow-auto">
                {result.errors.map((e, i) => (
                  <li key={i}>
                    row {e.row}: {e.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
