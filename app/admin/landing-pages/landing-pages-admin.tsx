"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import JSZip from "jszip";

import { createSupabaseBrowserClient } from "@/lib/supabase";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,80}$/;
const MAX_FILE_COUNT = 500;
const PER_FILE_LIMIT_BYTES = 50 * 1024 * 1024;

const MIME_TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  mjs: "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  ico: "image/x-icon",
  avif: "image/avif",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  pdf: "application/pdf",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  map: "application/json; charset=utf-8",
};
function getMimeType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

export type LandingPageRow = {
  slug: string;
  title: string;
  description: string | null;
  entry_file: string | null;
  is_active: boolean;
  updated_at: string;
};

type ExtractedFile = { path: string; data: ArrayBuffer; size: number };
type ExtractionResult = { files: ExtractedFile[]; entry_file: string };

async function extractBundle(file: File): Promise<ExtractionResult> {
  const isZip =
    file.name.toLowerCase().endsWith(".zip") ||
    file.type === "application/zip" ||
    file.type === "application/x-zip-compressed";

  if (!isZip) {
    if (
      !file.name.toLowerCase().endsWith(".html") &&
      !file.name.toLowerCase().endsWith(".htm")
    ) {
      throw new Error(
        "Single-file uploads must be .html. For bundles with assets, upload a .zip.",
      );
    }
    if (file.size > PER_FILE_LIMIT_BYTES) {
      throw new Error(
        `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Per-file limit ${PER_FILE_LIMIT_BYTES / 1024 / 1024} MB.`,
      );
    }
    const safeName = file.name.toLowerCase().endsWith(".htm")
      ? "index.htm"
      : "index.html";
    return {
      files: [{ path: safeName, data: await file.arrayBuffer(), size: file.size }],
      entry_file: safeName,
    };
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  let files: ExtractedFile[] = [];
  for (const [path, zipEntry] of Object.entries(zip.files)) {
    if (zipEntry.dir) continue;
    if (path.startsWith("__MACOSX/")) continue;
    if (path.includes("/.DS_Store") || path === ".DS_Store") continue;
    if (files.length >= MAX_FILE_COUNT) {
      throw new Error(`Too many files in zip. Max ${MAX_FILE_COUNT}.`);
    }
    const data = await zipEntry.async("arraybuffer");
    files.push({ path, data, size: data.byteLength });
  }

  const topLevels = new Set(files.map((f) => f.path.split("/")[0]));
  if (topLevels.size === 1 && files.length > 0 && files.every((f) => f.path.includes("/"))) {
    const prefix = [...topLevels][0] + "/";
    files = files.map((f) => ({ ...f, path: f.path.substring(prefix.length) }));
  }

  const bad = files.find(
    (f) =>
      f.path.includes("..") || f.path.startsWith("/") || f.path.startsWith("\\"),
  );
  if (bad) throw new Error(`Invalid path in zip: "${bad.path}"`);

  const tooBig = files.find((f) => f.size > PER_FILE_LIMIT_BYTES);
  if (tooBig) {
    throw new Error(
      `"${tooBig.path}" is ${(tooBig.size / 1024 / 1024).toFixed(1)} MB. Per-file limit ${PER_FILE_LIMIT_BYTES / 1024 / 1024} MB.`,
    );
  }

  if (files.length === 0) throw new Error("Zip contained no files.");

  let entry_file: string;
  const indexFile = files.find((f) => f.path === "index.html" || f.path === "index.htm");
  if (indexFile) {
    entry_file = indexFile.path;
  } else {
    const firstHtml = files.find((f) => /^[^/]+\.html?$/i.test(f.path));
    if (!firstHtml) {
      throw new Error(
        "No HTML entry file in zip. Bundle must contain index.html at the root.",
      );
    }
    entry_file = firstHtml.path;
  }
  return { files, entry_file };
}

export function LandingPagesAdmin({ pages }: { pages: LandingPageRow[] }) {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
            ✦ LANDING PAGES
          </p>
          <h1 className="font-serif italic text-3xl text-[#f0eff8]">
            Hosted bundles.
          </h1>
          <p className="font-sans text-sm text-[#8f8daa] mt-2 leading-relaxed max-w-2xl">
            Custom partner pages served at{" "}
            <code className="font-mono text-[#c4a35a]">/lp/&lt;slug&gt;</code>.
            Upload a ZIP bundle (HTML + assets) or a single .html file.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUpload((v) => !v)}
          className="py-2.5 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
        >
          {showUpload ? "Cancel" : "Upload new page ✦"}
        </button>
      </header>

      {showUpload && (
        <div className="mb-6">
          <UploadForm
            onSuccess={(slug) => {
              setShowUpload(false);
              router.push(`/admin/landing-pages/${slug}`);
            }}
          />
        </div>
      )}

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(26,26,53,0.85)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(196,163,90,0.15)",
        }}
      >
        <table className="w-full font-sans text-sm">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "rgba(196,163,90,0.10)" }}
            >
              <Th>Slug</Th>
              <Th>Title</Th>
              <Th>Entry</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center font-serif italic text-[#8f8daa]"
                >
                  No landing pages yet. Upload one →
                </td>
              </tr>
            )}
            {pages.map((p) => (
              <tr
                key={p.slug}
                className="border-b last:border-0 hover:bg-[rgba(196,163,90,0.04)] transition-colors"
                style={{ borderColor: "rgba(196,163,90,0.06)" }}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/lp/${p.slug}`}
                    target="_blank"
                    rel="noopener"
                    className="font-mono text-xs text-[#c4a35a] hover:underline"
                  >
                    /lp/{p.slug}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#f0eff8]">
                  <div>{p.title}</div>
                  {p.description && (
                    <div className="font-mono text-[11px] text-[#8f8daa] mt-0.5 truncate max-w-[260px]">
                      {p.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-[#8f8daa]">
                  {p.entry_file || "index.html"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full font-display text-[10px] uppercase tracking-[0.1em]"
                    style={{
                      background: p.is_active
                        ? "rgba(107,204,158,0.18)"
                        : "rgba(255,255,255,0.06)",
                      color: p.is_active ? "#6bcc9e" : "#8f8daa",
                    }}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-[#8f8daa]">
                  {new Date(p.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/landing-pages/${p.slug}`}
                      className="font-sans text-xs text-[#c4a35a] hover:text-[#f0eff8] transition-colors"
                    >
                      Edit files
                    </Link>
                    <ToggleButton page={p} onChange={() => router.refresh()} />
                    <DeleteButton page={p} onChange={() => router.refresh()} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
      {children}
    </th>
  );
}

function ToggleButton({
  page,
  onChange,
}: {
  page: LandingPageRow;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  async function handleToggle() {
    setBusy(true);
    try {
      await fetch(`/api/admin/landing-pages/${page.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !page.is_active }),
      });
      onChange();
    } finally {
      setBusy(false);
    }
  }
  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a] transition-colors disabled:opacity-50"
    >
      {page.is_active ? "Deactivate" : "Activate"}
    </button>
  );
}

function DeleteButton({
  page,
  onChange,
}: {
  page: LandingPageRow;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  async function handleDelete() {
    if (
      !confirm(
        `Delete /lp/${page.slug} and all its files? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await fetch(`/api/admin/landing-pages/${page.slug}`, { method: "DELETE" });
      onChange();
    } finally {
      setBusy(false);
    }
  }
  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="font-sans text-xs text-[#8f8daa] hover:text-[#ef4444] transition-colors disabled:opacity-50"
    >
      Delete
    </button>
  );
}

function UploadForm({ onSuccess }: { onSuccess: (slug: string) => void }) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setProgress(null);
    if (!file) {
      setError("Pick a file first.");
      return;
    }
    if (!SLUG_REGEX.test(slug)) {
      setError(
        "Invalid slug. Lowercase letters, digits, and hyphens; must start with a letter or digit.",
      );
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setBusy(true);
    try {
      // 1. Extract in the browser. Sidesteps Vercel's 4.5 MB function body limit.
      const { files, entry_file } = await extractBundle(file);

      // 2. Create the landing_pages row.
      const initRes = await fetch("/api/admin/landing-pages/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: title.trim(),
          description: description.trim() || null,
          entry_file,
        }),
      });
      const initData = await initRes.json().catch(() => ({}));
      if (!initRes.ok) {
        setError(initData.error || "Failed to create landing page record.");
        return;
      }

      // 3. Browser -> Supabase upload via signed URLs. No Vercel hop.
      setProgress({ done: 0, total: files.length });
      const supabase = createSupabaseBrowserClient();
      for (let i = 0; i < files.length; i++) {
        const f = files[i];

        const signRes = await fetch(
          `/api/admin/landing-pages/${slug}/files/sign`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: f.path }),
          },
        );
        const signData = await signRes.json().catch(() => ({}));
        if (!signRes.ok) {
          await fetch(`/api/admin/landing-pages/${slug}`, { method: "DELETE" });
          setError(
            `Could not sign upload for "${f.path}": ${signData.error || signRes.status}. No partial bundle kept.`,
          );
          return;
        }

        const blob = new Blob([f.data], { type: getMimeType(f.path) });
        const { error: uploadError } = await supabase.storage
          .from("landing-pages")
          .uploadToSignedUrl(signData.path, signData.token, blob, {
            contentType: getMimeType(f.path),
          });
        if (uploadError) {
          await fetch(`/api/admin/landing-pages/${slug}`, { method: "DELETE" });
          setError(
            `Upload of "${f.path}" failed: ${uploadError.message}. No partial bundle kept.`,
          );
          return;
        }

        setProgress({ done: i + 1, total: files.length });
      }

      onSuccess(slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border p-6 space-y-4"
      style={{
        background: "rgba(26,26,53,0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196,163,90,0.20)",
      }}
    >
      <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a]">
        ✦ NEW LANDING PAGE
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
            Slug
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            placeholder="winter-promo"
            required
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
          />
          <p className="mt-1 font-mono text-[11px] text-[#4a4866]">
            URL: /lp/{slug || "<slug>"}
          </p>
        </label>

        <label className="block">
          <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
            Title
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
          />
        </label>
      </div>

      <label className="block">
        <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
          Description (optional, internal only)
        </span>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Campaign ID, partner name, internal note…"
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
        />
      </label>

      <FileDropZone file={file} onPick={setFile} />

      {error && (
        <p className="font-sans text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}

      {progress && (
        <p className="font-mono text-xs text-[#6bcc9e]" role="status">
          Uploading {progress.done} / {progress.total} files…
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="py-2.5 px-6 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Uploading…" : "Upload ✦"}
        </button>
      </div>
    </form>
  );
}

function FileDropZone({
  file,
  onPick,
}: {
  file: File | null;
  onPick: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div>
      <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
        Bundle (.zip) or single .html
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) onPick(dropped);
        }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
        style={{
          borderColor: isDragging ? "#c4a35a" : "rgba(196,163,90,0.20)",
          background: isDragging
            ? "rgba(196,163,90,0.08)"
            : "rgba(6,6,15,0.35)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip,.html,.htm"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <>
            <p className="font-sans text-sm text-[#f0eff8] truncate">{file.name}</p>
            <p className="font-mono text-[11px] text-[#8f8daa] mt-1">
              {(file.size / 1024).toFixed(1)} KB · click or drop to replace
            </p>
          </>
        ) : (
          <>
            <p className="font-sans text-sm text-[#f0eff8]">
              Drop your .zip bundle or .html here, or click to browse
            </p>
            <p className="font-mono text-[11px] text-[#8f8daa] mt-1">
              .zip with assets or a single .html file · up to 50 MB per file
            </p>
          </>
        )}
      </div>
    </div>
  );
}
