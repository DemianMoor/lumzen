import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "landing-pages";
const MAX_BYTES = 50 * 1024 * 1024;
const MAX_FILE_COUNT = 500;

function contentTypeFor(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  switch (ext) {
    case "html":
    case "htm":
      return "text/html; charset=utf-8";
    case "css":
      return "text/css; charset=utf-8";
    case "js":
    case "mjs":
      return "application/javascript; charset=utf-8";
    case "json":
      return "application/json; charset=utf-8";
    case "svg":
      return "image/svg+xml";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "ico":
      return "image/x-icon";
    case "avif":
      return "image/avif";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    case "ttf":
      return "font/ttf";
    case "otf":
      return "font/otf";
    case "eot":
      return "application/vnd.ms-fontobject";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mp3":
      return "audio/mpeg";
    case "pdf":
      return "application/pdf";
    case "txt":
      return "text/plain; charset=utf-8";
    case "xml":
      return "application/xml; charset=utf-8";
    case "map":
      return "application/json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function isSafePath(p: string): boolean {
  if (!p) return false;
  if (p.includes("..")) return false;
  if (p.startsWith("/") || p.startsWith("\\")) return false;
  return true;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;
  if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdmin();

  const { data: page } = await supabase
    .from("landing_pages")
    .select("slug, entry_file")
    .eq("slug", slug)
    .maybeSingle();
  if (!page) {
    return NextResponse.json(
      { error: "Landing page not found." },
      { status: 404 },
    );
  }

  const zipEntry = formData.get("zip");
  if (zipEntry instanceof File) {
    if (zipEntry.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `Zip exceeds ${MAX_BYTES / 1024 / 1024} MB limit.` },
        { status: 400 },
      );
    }
    const buffer = Buffer.from(await zipEntry.arrayBuffer());
    let zip: JSZip;
    try {
      zip = await JSZip.loadAsync(buffer);
    } catch {
      return NextResponse.json({ error: "Invalid ZIP file." }, { status: 400 });
    }

    type Entry = { path: string; data: Buffer };
    const entries: Entry[] = [];
    for (const [name, file] of Object.entries(zip.files)) {
      if (file.dir) continue;
      if (name.startsWith("__MACOSX/")) continue;
      if (name.includes("/.DS_Store") || name.endsWith(".DS_Store")) continue;
      if (entries.length >= MAX_FILE_COUNT) {
        return NextResponse.json(
          { error: `Too many files in zip. Max ${MAX_FILE_COUNT}.` },
          { status: 400 },
        );
      }
      const cleaned = name.replace(/^\/+/, "");
      if (!isSafePath(cleaned)) {
        return NextResponse.json(
          { error: `Invalid path in zip: "${name}"` },
          { status: 400 },
        );
      }
      const data = await file.async("nodebuffer");
      entries.push({ path: cleaned, data });
    }

    // Strip a common top-level folder (e.g. partner ZIP wraps everything in
    // "promo-page/"). Otherwise the entry HTML ends up at slug/promo-page/index.html
    // and the /lp/<slug> proxy can't find it.
    const topLevels = new Set(entries.map((e) => e.path.split("/")[0]));
    let strippedPrefix = "";
    if (
      topLevels.size === 1 &&
      entries.length > 0 &&
      entries.every((e) => e.path.includes("/"))
    ) {
      strippedPrefix = [...topLevels][0] + "/";
      for (const e of entries) {
        e.path = e.path.substring(strippedPrefix.length);
      }
    }

    if (entries.length === 0) {
      return NextResponse.json(
        { error: "Zip contained no files." },
        { status: 400 },
      );
    }

    // Detect entry file. Honor the existing entry_file if it matches; otherwise
    // pick index.html / index.htm / first top-level .html.
    const existingEntry = (page.entry_file || "index.html").trim();
    let detectedEntry: string | null = null;
    if (entries.some((e) => e.path === existingEntry)) {
      detectedEntry = existingEntry;
    } else {
      const idx = entries.find(
        (e) => e.path === "index.html" || e.path === "index.htm",
      );
      if (idx) detectedEntry = idx.path;
      else {
        const firstHtml = entries.find((e) => /^[^/]+\.html?$/i.test(e.path));
        if (firstHtml) detectedEntry = firstHtml.path;
      }
    }

    const uploadResults: { path: string; error?: string }[] = [];
    for (const e of entries) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(`${slug}/${e.path}`, e.data, {
          contentType: contentTypeFor(e.path),
          upsert: true,
          cacheControl: "300",
        });
      uploadResults.push({ path: e.path, error: error?.message });
    }

    const failed = uploadResults.filter((r) => r.error);

    // Persist detected entry_file when it changed (and exists on disk now).
    if (detectedEntry && detectedEntry !== existingEntry) {
      await supabase
        .from("landing_pages")
        .update({ entry_file: detectedEntry })
        .eq("slug", slug);
    }

    return NextResponse.json({
      success: failed.length === 0,
      uploaded: uploadResults.length - failed.length,
      failed,
      stripped_prefix: strippedPrefix || null,
      entry_file: detectedEntry,
      entry_changed: Boolean(detectedEntry && detectedEntry !== existingEntry),
    });
  }

  const file = formData.get("file");
  if (file instanceof File) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_BYTES / 1024 / 1024} MB limit.` },
        { status: 400 },
      );
    }
    const requestedPath = (formData.get("path")?.toString() || file.name)
      .replace(/^\/+/, "")
      .replace(/\\/g, "/");
    if (!isSafePath(requestedPath)) {
      return NextResponse.json({ error: "Invalid path." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullPath = `${slug}/${requestedPath}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fullPath, buffer, {
      contentType: contentTypeFor(requestedPath),
      upsert: true,
      cacheControl: "300",
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, path: requestedPath });
  }

  return NextResponse.json(
    { error: "Provide either a 'zip' or a 'file'." },
    { status: 400 },
  );
}
