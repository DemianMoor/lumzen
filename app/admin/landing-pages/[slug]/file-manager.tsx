"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase";
import { ChromeSettings } from "./chrome-settings";

type LandingPage = {
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  entry_file: string;
  gtm_id: string | null;
};

type ChromeProps = {
  useSiteChrome: boolean;
  effective: boolean;
  pendingRevertAtIso: string | null;
  pendingRevertTo: boolean | null;
};

type FileRow = {
  path: string;
  size: number;
  updated_at?: string | null;
};

type Banner = { kind: "ok" | "err"; text: string } | null;

const STORAGE_PUBLIC_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public/landing-pages`;

const TEXT_EXTENSIONS = new Set([
  "html",
  "htm",
  "css",
  "js",
  "mjs",
  "json",
  "svg",
  "txt",
  "xml",
  "map",
  "md",
]);

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "ico",
  "avif",
]);

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
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  pdf: "application/pdf",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
};

function ext(path: string): string {
  return path.split(".").pop()?.toLowerCase() ?? "";
}
function getMimeType(path: string): string {
  return MIME_TYPES[ext(path)] ?? "application/octet-stream";
}
function isText(path: string): boolean {
  return TEXT_EXTENSIONS.has(ext(path));
}
function isImage(path: string): boolean {
  return IMAGE_EXTENSIONS.has(ext(path));
}
function encodeFilePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}
function formatBytes(b: number | null | undefined): string {
  if (b == null) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export function FileManager({
  page,
  initialFiles,
  chrome,
}: {
  page: LandingPage;
  initialFiles: FileRow[];
  chrome: ChromeProps;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(page.title);
  const [description, setDescription] = useState(page.description ?? "");
  const [entryFile, setEntryFile] = useState(page.entry_file);
  const [gtmId, setGtmId] = useState(page.gtm_id ?? "");
  const [isActive, setIsActive] = useState(page.is_active);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsBanner, setSettingsBanner] = useState<Banner>(null);
  const [showDelete, setShowDelete] = useState(false);

  const [files, setFiles] = useState<FileRow[]>(initialFiles);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [filesBanner, setFilesBanner] = useState<Banner>(null);

  const [uploadingZip, setUploadingZip] = useState(false);

  const refreshFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch(
        `/api/admin/landing-pages/${page.slug}/files?recursive=true`,
        { cache: "no-store" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFilesBanner({
          kind: "err",
          text: data.error || "Could not list files.",
        });
        setFiles([]);
        return;
      }
      setFiles(data.files ?? []);
    } finally {
      setLoadingFiles(false);
    }
  }, [page.slug]);

  // Re-fetch recursively on mount: the SSR pass only lists the top level.
  useEffect(() => {
    void refreshFiles();
  }, [refreshFiles]);

  // Pick the entry file (or first file) once we have something to show.
  useEffect(() => {
    if (selectedPath || files.length === 0) return;
    const entry = files.find((f) => f.path === entryFile) ?? files[0];
    if (entry) setSelectedPath(entry.path);
  }, [files, entryFile, selectedPath]);

  const grouped = useMemo(() => {
    const map = new Map<string, FileRow[]>();
    for (const f of files) {
      const slash = f.path.indexOf("/");
      const folder = slash === -1 ? "" : f.path.substring(0, slash);
      if (!map.has(folder)) map.set(folder, []);
      map.get(folder)!.push(f);
    }
    const folders = [...map.keys()].sort((a, b) => {
      if (a === "") return -1;
      if (b === "") return 1;
      return a.localeCompare(b);
    });
    return folders.map((folder) => ({
      folder,
      items: map.get(folder)!.sort((a, b) => a.path.localeCompare(b.path)),
    }));
  }, [files]);

  const selectedFile = useMemo(
    () => files.find((f) => f.path === selectedPath) ?? null,
    [files, selectedPath],
  );

  async function handleUploadZip(file: File) {
    setUploadingZip(true);
    setFilesBanner(null);
    try {
      const fd = new FormData();
      fd.append("zip", file);
      const res = await fetch(`/api/admin/landing-pages/${page.slug}/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      const parts: string[] = [];
      parts.push(`Uploaded ${data.uploaded} file${data.uploaded === 1 ? "" : "s"}.`);
      if (data.stripped_prefix) {
        parts.push(`Stripped wrapping folder "${data.stripped_prefix}".`);
      }
      if (data.entry_changed && data.entry_file) {
        parts.push(`Entry set to ${data.entry_file}.`);
        setEntryFile(data.entry_file);
      }
      if (data.failed?.length) {
        parts.push(`${data.failed.length} failed.`);
      }
      setFilesBanner({ kind: "ok", text: parts.join(" ") });
      await refreshFiles();
      router.refresh();
    } catch (err) {
      setFilesBanner({
        kind: "err",
        text: err instanceof Error ? err.message : "Upload failed.",
      });
    } finally {
      setUploadingZip(false);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsBanner(null);
    try {
      const res = await fetch(`/api/admin/landing-pages/${page.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          entry_file: entryFile.trim() || "index.html",
          gtm_id: gtmId.trim() || null,
          is_active: isActive,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setSettingsBanner({ kind: "ok", text: "Saved." });
      router.refresh();
    } catch (err) {
      setSettingsBanner({
        kind: "err",
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSavingSettings(false);
    }
  }

  async function deletePage() {
    const res = await fetch(`/api/admin/landing-pages/${page.slug}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSettingsBanner({
        kind: "err",
        text: data.error || "Could not delete.",
      });
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
            {page.description && (
              <p className="mt-1 font-sans text-sm text-[#8f8daa]">
                {page.description}
              </p>
            )}
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

      <div className="mb-6">
        <ChromeSettings
          slug={page.slug}
          initialUseSiteChrome={chrome.useSiteChrome}
          initialEffective={chrome.effective}
          initialPendingRevertAtIso={chrome.pendingRevertAtIso}
          initialPendingRevertTo={chrome.pendingRevertTo}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ZipUploadCard
            disabled={uploadingZip}
            onPick={handleUploadZip}
            banner={filesBanner}
          />

          <FileBrowser
            slug={page.slug}
            groups={grouped}
            files={files}
            loading={loadingFiles}
            selectedFile={selectedFile}
            onSelect={setSelectedPath}
            entryFile={entryFile}
            onAdded={(text) => {
              setFilesBanner({ kind: "ok", text });
              void refreshFiles();
            }}
            onError={(text) => setFilesBanner({ kind: "err", text })}
            onChanged={(text) => {
              setFilesBanner({ kind: "ok", text });
              void refreshFiles();
            }}
            onDeleted={(path) => {
              setFilesBanner({ kind: "ok", text: `Deleted ${path}.` });
              setSelectedPath(null);
              void refreshFiles();
            }}
          />
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
                Description (internal only)
              </span>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Campaign ID, partner name, internal note…"
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
              <p className="mt-1 font-mono text-[11px] text-[#4a4866]">
                Relative to the bundle root.
              </p>
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
              disabled={savingSettings}
              className="w-full py-2.5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingSettings ? "Saving…" : "Save"}
            </button>

            {settingsBanner && (
              <p
                className={`font-mono text-xs ${settingsBanner.kind === "ok" ? "text-[#6bcc9e]" : "text-[#ef4444]"}`}
                role={settingsBanner.kind === "ok" ? "status" : "alert"}
              >
                {settingsBanner.text}
              </p>
            )}
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

function ZipUploadCard({
  disabled,
  onPick,
  banner,
}: {
  disabled: boolean;
  onPick: (file: File) => void;
  banner: Banner;
}) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{
        background: "rgba(26,26,53,0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196,163,90,0.15)",
      }}
    >
      <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-4 text-[#c4a35a]">
        ✦ UPLOAD ZIP BUNDLE
      </p>
      <label className="block">
        <span className="sr-only">ZIP bundle</span>
        <input
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
          className="block w-full font-sans text-sm text-[#8f8daa] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#c4a35a] file:text-[#06060f] file:font-medium file:cursor-pointer disabled:opacity-60"
        />
      </label>
      <p className="mt-2 font-sans text-[11px] text-[#4a4866]">
        Up to 50 MB. Existing files are overwritten. A wrapping top-level
        folder is stripped automatically, and the entry HTML is detected.
      </p>
      {banner && (
        <p
          className={`mt-3 font-mono text-xs ${banner.kind === "ok" ? "text-[#6bcc9e]" : "text-[#ef4444]"}`}
          role={banner.kind === "ok" ? "status" : "alert"}
        >
          {banner.text}
        </p>
      )}
    </section>
  );
}

function FileBrowser({
  slug,
  groups,
  files,
  loading,
  selectedFile,
  onSelect,
  entryFile,
  onAdded,
  onError,
  onChanged,
  onDeleted,
}: {
  slug: string;
  groups: { folder: string; items: FileRow[] }[];
  files: FileRow[];
  loading: boolean;
  selectedFile: FileRow | null;
  onSelect: (path: string) => void;
  entryFile: string;
  onAdded: (text: string) => void;
  onError: (text: string) => void;
  onChanged: (text: string) => void;
  onDeleted: (path: string) => void;
}) {
  return (
    <section
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(26,26,53,0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196,163,90,0.15)",
      }}
    >
      <div
        className="px-6 py-4 border-b flex items-center justify-between gap-3"
        style={{ borderColor: "rgba(196,163,90,0.10)" }}
      >
        <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a]">
          ✦ FILES ({files.length})
        </p>
        <p className="font-mono text-[10px] text-[#4a4866]">
          ★ entry file
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        <FileTree
          groups={groups}
          selectedPath={selectedFile?.path ?? null}
          onSelect={onSelect}
          loading={loading}
          entryFile={entryFile}
        />

        <div
          className="p-5 border-t md:border-t-0 md:border-l space-y-5"
          style={{ borderColor: "rgba(196,163,90,0.10)" }}
        >
          <AddFileForm slug={slug} onChange={onAdded} onError={onError} />

          {selectedFile ? (
            <FileEditor
              slug={slug}
              file={selectedFile}
              isEntry={selectedFile.path === entryFile}
              onChanged={onChanged}
              onError={onError}
              onDeleted={() => onDeleted(selectedFile.path)}
            />
          ) : (
            <p className="font-serif italic text-[#8f8daa]">
              {files.length === 0
                ? "No files yet. Upload a ZIP or drop a single file."
                : "Pick a file from the tree."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function FileTree({
  groups,
  selectedPath,
  onSelect,
  loading,
  entryFile,
}: {
  groups: { folder: string; items: FileRow[] }[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  loading: boolean;
  entryFile: string;
}) {
  return (
    <aside
      className="max-h-[70vh] overflow-y-auto p-3 text-sm"
      style={{ background: "rgba(6,6,15,0.35)" }}
    >
      {loading ? (
        <p className="font-mono text-[11px] text-[#8f8daa] px-2 py-2">
          Loading…
        </p>
      ) : groups.length === 0 ? (
        <p className="font-mono text-[11px] text-[#8f8daa] px-2 py-2">
          No files.
        </p>
      ) : (
        groups.map(({ folder, items }) => (
          <div key={folder} className="mb-3">
            {folder !== "" && (
              <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] px-2 py-1">
                {folder}/
              </p>
            )}
            <ul>
              {items.map((f) => {
                const display =
                  folder === "" ? f.path : f.path.substring(folder.length + 1);
                const isSelected = f.path === selectedPath;
                const isEntry = f.path === entryFile;
                return (
                  <li key={f.path}>
                    <button
                      onClick={() => onSelect(f.path)}
                      title={f.path}
                      className="w-full text-left rounded-md px-2 py-1.5 flex items-center justify-between gap-2 transition-colors"
                      style={{
                        background: isSelected
                          ? "rgba(196,163,90,0.18)"
                          : "transparent",
                        color: isSelected ? "#f0eff8" : "#c8c6df",
                      }}
                    >
                      <span className="truncate font-mono text-[11px]">
                        {folder !== "" && (
                          <span className="opacity-50 mr-1">└</span>
                        )}
                        {display}
                        {isEntry && (
                          <span
                            className="ml-1"
                            style={{ color: "#c4a35a" }}
                            aria-label="entry file"
                          >
                            ★
                          </span>
                        )}
                      </span>
                      <span
                        className="font-mono text-[10px] tabular-nums"
                        style={{ color: isSelected ? "#f0eff8" : "#4a4866" }}
                      >
                        {formatBytes(f.size)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </aside>
  );
}

function FileEditor({
  slug,
  file,
  isEntry,
  onChanged,
  onError,
  onDeleted,
}: {
  slug: string;
  file: FileRow;
  isEntry: boolean;
  onChanged: (text: string) => void;
  onError: (text: string) => void;
  onDeleted: () => void;
}) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setContent("");
    setOriginalContent("");
    if (!isText(file.path)) return;
    setLoadingContent(true);
    fetch(
      `${STORAGE_PUBLIC_BASE}/${slug}/${encodeFilePath(file.path)}?ts=${Date.now()}`,
      { cache: "no-store" },
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(`Fetch returned ${r.status}.`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        setContent(text);
        setOriginalContent(text);
      })
      .catch((err) => {
        if (!cancelled)
          onError(
            `Failed to load "${file.path}": ${err instanceof Error ? err.message : "unknown"}`,
          );
      })
      .finally(() => {
        if (!cancelled) setLoadingContent(false);
      });
    return () => {
      cancelled = true;
    };
  }, [file.path, slug, onError]);

  const dirty = content !== originalContent;

  async function handleSaveText() {
    setBusy(true);
    try {
      const blob = new Blob([content], { type: getMimeType(file.path) });
      await uploadOverwrite(slug, file.path, blob);
      setOriginalContent(content);
      onChanged(`Saved ${file.path}.`);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReplace(newFile: File) {
    setBusy(true);
    try {
      await uploadOverwrite(slug, file.path, newFile);
      onChanged(`Replaced ${file.path}.`);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Replace failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (isEntry) {
      onError(
        "Cannot delete the entry file. Change the entry file in settings first.",
      );
      return;
    }
    if (!confirm(`Delete ${file.path}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/landing-pages/${slug}/files?path=${encodeURIComponent(file.path)}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Delete returned ${res.status}.`);
      onDeleted();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(196,163,90,0.10)",
      }}
    >
      <header
        className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: "rgba(196,163,90,0.10)" }}
      >
        <div className="min-w-0">
          <p
            className="font-mono text-xs text-[#f0eff8] truncate"
            title={file.path}
          >
            {file.path}
            {isEntry && <span className="ml-2 text-[#c4a35a]">★ entry</span>}
          </p>
          <p className="font-mono text-[10px] text-[#4a4866] mt-0.5">
            {formatBytes(file.size)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ReplaceButton onPick={handleReplace} disabled={busy} />
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="font-sans text-xs text-[#8f8daa] hover:text-[#ef4444] transition-colors disabled:opacity-50 px-2 py-1.5"
          >
            Delete
          </button>
        </div>
      </header>

      <div className="p-4">
        {isText(file.path) ? (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              disabled={loadingContent || busy}
              placeholder={loadingContent ? "Loading…" : ""}
              className="w-full min-h-[420px] p-3 font-mono text-xs leading-relaxed text-[#f0eff8] bg-[rgba(6,6,15,0.55)] border border-[rgba(196,163,90,0.10)] rounded-md focus:outline-none focus:border-[#c4a35a] disabled:opacity-50"
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="font-mono text-[11px] text-[#8f8daa]">
                {dirty ? "Unsaved changes" : "Up to date"}
              </p>
              <button
                type="button"
                onClick={handleSaveText}
                disabled={!dirty || busy || loadingContent}
                className="py-2 px-4 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-xs font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        ) : isImage(file.path) ? (
          <div
            className="rounded-md p-4 text-center"
            style={{
              background: "rgba(6,6,15,0.45)",
              border: "1px solid rgba(196,163,90,0.10)",
            }}
          >
            <img
              src={`${STORAGE_PUBLIC_BASE}/${slug}/${encodeFilePath(file.path)}?ts=${Date.now()}`}
              alt={file.path}
              className="max-h-[420px] mx-auto"
            />
          </div>
        ) : (
          <p className="font-sans text-sm text-[#8f8daa]">
            This file type isn&apos;t editable in-browser. Use Replace to upload
            a new version, or Delete to remove it.
          </p>
        )}
      </div>
    </div>
  );
}

function ReplaceButton({
  onPick,
  disabled,
}: {
  onPick: (file: File) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="py-1.5 px-3 rounded-full bg-[rgba(196,163,90,0.18)] text-[#c4a35a] font-sans text-xs font-medium hover:bg-[rgba(196,163,90,0.28)] transition-all disabled:opacity-50"
      >
        Replace
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
    </>
  );
}

function AddFileForm({
  slug,
  onChange,
  onError,
}: {
  slug: string;
  onChange: (text: string) => void;
  onError: (text: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [path, setPath] = useState("");
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && !path) setPath(file.name);
  }, [file, path]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      onError("Pick a file first.");
      return;
    }
    const cleanPath = path.trim().replace(/\\/g, "/");
    if (!cleanPath) {
      onError("Target path is required.");
      return;
    }
    if (
      cleanPath.includes("..") ||
      cleanPath.startsWith("/") ||
      cleanPath.startsWith("\\")
    ) {
      onError("Invalid path.");
      return;
    }
    setBusy(true);
    try {
      await uploadOverwrite(slug, cleanPath, file);
      setFile(null);
      setPath("");
      onChange(`Added ${cleanPath}.`);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Add failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleAdd}
      className="rounded-xl border p-4 space-y-3"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(196,163,90,0.10)",
      }}
    >
      <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a]">
        ✦ ADD OR REPLACE FILE
      </p>

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
          if (dropped) setFile(dropped);
        }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
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
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <>
            <p className="font-sans text-sm text-[#f0eff8] truncate">{file.name}</p>
            <p className="font-mono text-[11px] text-[#8f8daa] mt-1">
              {formatBytes(file.size)} · click or drop to replace
            </p>
          </>
        ) : (
          <>
            <p className="font-sans text-sm text-[#f0eff8]">
              Drop a file here, or click to browse
            </p>
            <p className="font-mono text-[11px] text-[#8f8daa] mt-1">
              Image, font, script, or any asset · uploads to Supabase directly
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-[200px]">
          <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
            Path inside bundle
          </span>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="images/new-hero.png"
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
          />
        </label>
        <button
          type="submit"
          disabled={!file || busy}
          className="py-2.5 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Adding…" : "Add file"}
        </button>
      </div>
    </form>
  );
}

async function getSignedUrl(
  slug: string,
  path: string,
  upsert: boolean,
): Promise<{ path: string; token: string }> {
  const res = await fetch(`/api/admin/landing-pages/${slug}/files/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, upsert }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Sign returned ${res.status}.`);
  }
  return { path: data.path, token: data.token };
}

async function uploadOverwrite(
  slug: string,
  path: string,
  body: Blob | File,
): Promise<void> {
  const { path: signedPath, token } = await getSignedUrl(slug, path, true);
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from("landing-pages")
    .uploadToSignedUrl(signedPath, token, body, {
      contentType: getMimeType(path),
      upsert: true,
    });
  if (error) throw new Error(error.message);
}
