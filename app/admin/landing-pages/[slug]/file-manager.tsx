"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LandingPage = {
  slug: string;
  title: string;
  is_active: boolean;
  entry_file: string;
  gtm_id: string | null;
};

type FileItem = {
  name: string;
  size: number | null;
  updated_at: string | null;
};

export function FileManager({
  page,
  initialFiles,
}: {
  page: LandingPage;
  initialFiles: FileItem[];
}) {
  const router = useRouter();
  const [files, setFiles] = useState(initialFiles);
  const [title, setTitle] = useState(page.title);
  const [entryFile, setEntryFile] = useState(page.entry_file);
  const [gtmId, setGtmId] = useState(page.gtm_id ?? "");
  const [isActive, setIsActive] = useState(page.is_active);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  async function refreshFiles() {
    const res = await fetch(`/api/admin/landing-pages/${page.slug}/files`);
    if (res.ok) {
      const data = await res.json();
      setFiles(data.files ?? []);
    }
  }

  async function handleUploadZip(file: File) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("zip", file);
      const res = await fetch(`/api/admin/landing-pages/${page.slug}/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      setMessage(
        `Uploaded ${data.uploaded} file${data.uploaded === 1 ? "" : "s"}.${
          data.failed?.length ? ` ${data.failed.length} failed.` : ""
        }`,
      );
      await refreshFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUploadFile(file: File) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("path", file.name);
      const res = await fetch(`/api/admin/landing-pages/${page.slug}/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      setMessage(`Uploaded ${data.path}.`);
      await refreshFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteFile(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    const res = await fetch(`/api/admin/landing-pages/${page.slug}/files`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not delete.");
      return;
    }
    await refreshFiles();
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/landing-pages/${page.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          entry_file: entryFile.trim() || "index.html",
          gtm_id: gtmId.trim() || null,
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setMessage("Saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePage() {
    const res = await fetch(`/api/admin/landing-pages/${page.slug}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not delete.");
      return;
    }
    router.push("/admin/landing-pages");
  }

  return (
    <div>
      <header className="mb-6">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
          ✦ LANDING PAGES /{" "}
          <Link
            href="/admin/landing-pages"
            className="hover:text-[#f0eff8] transition-colors"
          >
            all
          </Link>
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif italic text-3xl text-[#f0eff8]">
              {page.title}
            </h1>
            <p className="mt-1 font-mono text-xs text-[#c4a35a]">
              /lp/{page.slug}
            </p>
          </div>
          <Link
            href={`/lp/${page.slug}`}
            target="_blank"
            rel="noopener"
            className="py-2 px-5 rounded-full border border-[#c4a35a] text-[#c4a35a] font-sans text-sm hover:bg-[rgba(196,163,90,0.10)] transition-all"
          >
            View live ↗
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-4 text-[#c4a35a]">
              ✦ UPLOAD
            </p>

            <div className="space-y-4">
              <div>
                <label className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
                  ZIP bundle
                </label>
                <input
                  type="file"
                  accept=".zip,application/zip,application/x-zip-compressed"
                  disabled={busy}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUploadZip(f);
                    e.target.value = "";
                  }}
                  className="block w-full font-sans text-sm text-[#8f8daa] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#c4a35a] file:text-[#06060f] file:font-medium file:cursor-pointer disabled:opacity-60"
                />
                <p className="mt-1 font-sans text-[11px] text-[#4a4866]">
                  Up to 25 MB. Existing files are overwritten.
                </p>
              </div>
              <div>
                <label className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
                  Single file
                </label>
                <input
                  type="file"
                  disabled={busy}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUploadFile(f);
                    e.target.value = "";
                  }}
                  className="block w-full font-sans text-sm text-[#8f8daa] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[rgba(196,163,90,0.18)] file:text-[#c4a35a] file:font-medium file:cursor-pointer disabled:opacity-60"
                />
              </div>
            </div>

            {message && (
              <p className="mt-4 font-mono text-xs text-[#6bcc9e]" role="status">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-4 font-mono text-xs text-[#ef4444]" role="alert">
                {error}
              </p>
            )}
          </section>

          <section
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(196,163,90,0.10)" }}>
              <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a]">
                ✦ FILES ({files.length})
              </p>
            </div>
            {files.length === 0 ? (
              <p className="px-6 py-12 text-center font-serif italic text-[#8f8daa]">
                No files yet. Upload a ZIP above.
              </p>
            ) : (
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(196,163,90,0.10)" }}>
                    <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                      Size
                    </th>
                    <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                      Updated
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => (
                    <tr
                      key={f.name}
                      className="border-b last:border-0"
                      style={{ borderColor: "rgba(196,163,90,0.06)" }}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[#f0eff8]">
                        {f.name}
                        {f.name === entryFile && (
                          <span className="ml-2 inline-block px-2 py-0.5 rounded-full font-display text-[9px] uppercase tracking-[0.1em] bg-[rgba(196,163,90,0.18)] text-[#c4a35a]">
                            Entry
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#8f8daa]">
                        {f.size != null ? formatBytes(f.size) : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#8f8daa]">
                        {f.updated_at
                          ? new Date(f.updated_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteFile(f.name)}
                          className="font-sans text-xs text-[#8f8daa] hover:text-[#ef4444] transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={saveSettings}
            className="rounded-2xl border p-6 space-y-4"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a]">
              ✦ SETTINGS
            </p>

            <label className="block">
              <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
                Title
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
              />
            </label>

            <label className="block">
              <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
                Entry file
              </span>
              <input
                type="text"
                value={entryFile}
                onChange={(e) => setEntryFile(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
              />
            </label>

            <label className="block">
              <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
                Override GTM ID
              </span>
              <input
                type="text"
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
                placeholder="GTM-XXXX (or blank to inherit)"
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
              />
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-[#c4a35a]"
              />
              <span className="font-sans text-sm text-[#f0eff8]">
                Active (served at /lp/{page.slug})
              </span>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </form>

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
              onClick={() => setShowDelete(true)}
              className="block w-full text-center font-sans text-xs text-[#8f8daa] hover:text-[#ef4444] transition-colors"
            >
              Delete page and all files
            </button>
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
              Delete /lp/{page.slug}?
            </h3>
            <p className="mt-2 font-sans text-sm text-[#8f8daa]">
              The page record and every file in its bundle will be removed.
              This cannot be undone.
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
                onClick={deletePage}
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
