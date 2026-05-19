import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "landing-pages";
const MAX_BYTES = 25 * 1024 * 1024;

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
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    case "ttf":
      return "font/ttf";
    case "otf":
      return "font/otf";
    case "txt":
      return "text/plain; charset=utf-8";
    case "xml":
      return "application/xml; charset=utf-8";
    default:
      return "application/octet-stream";
  }
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

  const zipEntry = formData.get("zip");
  if (zipEntry instanceof File) {
    if (zipEntry.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Zip exceeds 25 MB limit." },
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

    const uploadResults: { path: string; error?: string }[] = [];
    const entries = Object.entries(zip.files);
    for (const [name, file] of entries) {
      if (file.dir) continue;
      if (name.includes("..")) continue;
      const cleanName = name.replace(/^\/+/, "");
      const content = await file.async("nodebuffer");
      const path = `${slug}/${cleanName}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, content, {
          contentType: contentTypeFor(cleanName),
          upsert: true,
          cacheControl: "300",
        });
      if (error) {
        uploadResults.push({ path: cleanName, error: error.message });
      } else {
        uploadResults.push({ path: cleanName });
      }
    }
    return NextResponse.json({
      success: true,
      uploaded: uploadResults.filter((r) => !r.error).length,
      failed: uploadResults.filter((r) => r.error),
    });
  }

  const file = formData.get("file");
  if (file instanceof File) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 25 MB limit." },
        { status: 400 },
      );
    }
    const requestedPath = (formData.get("path")?.toString() || file.name)
      .replace(/^\/+/, "")
      .replace(/\.\.+/g, "");
    if (!requestedPath) {
      return NextResponse.json({ error: "Missing path." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const path = `${slug}/${requestedPath}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
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
