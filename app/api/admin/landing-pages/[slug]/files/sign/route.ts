import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "landing-pages";

/**
 * Returns a one-time-use signed upload URL so the browser can PUT a file
 * straight to Supabase Storage. Without this, every upload hits the Next.js
 * route and is capped by Vercel's 4.5 MB body limit.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;

  let body: { path?: string; upsert?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const targetPath = body.path?.trim();
  if (!targetPath) {
    return NextResponse.json({ error: "Target path required." }, { status: 400 });
  }
  if (
    targetPath.includes("..") ||
    targetPath.startsWith("/") ||
    targetPath.startsWith("\\")
  ) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const { data: page } = await supabase
    .from("landing_pages")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (!page) {
    return NextResponse.json(
      { error: "Landing page not found." },
      { status: 404 },
    );
  }

  const fullPath = `${slug}/${targetPath}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(fullPath, { upsert: body.upsert === true });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to sign upload URL." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    path: data.path,
    token: data.token,
    signedUrl: data.signedUrl,
  });
}
