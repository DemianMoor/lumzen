import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "landing-pages";

function isSafePath(p: string): boolean {
  if (!p) return false;
  if (p.includes("..")) return false;
  if (p.startsWith("/") || p.startsWith("\\")) return false;
  return true;
}

/**
 * Signs upload URLs for many paths in one request.
 *
 * The per-file /files/sign endpoint required one Vercel invocation per file,
 * and a single cold start over the default 10s function timeout cost the
 * whole bundle ("Gateway Timeout. No partial bundle kept."). Here we
 * do one auth check + a parallel set of Supabase createSignedUploadUrl
 * calls and return the lot.
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

  let body: { paths?: string[]; upsert?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const paths = Array.isArray(body.paths) ? body.paths : null;
  if (!paths || paths.length === 0) {
    return NextResponse.json({ error: "paths[] required." }, { status: 400 });
  }
  if (paths.length > 500) {
    return NextResponse.json(
      { error: "Too many paths in one batch (max 500)." },
      { status: 400 },
    );
  }
  for (const p of paths) {
    if (typeof p !== "string" || !isSafePath(p)) {
      return NextResponse.json(
        { error: `Invalid path: "${p}"` },
        { status: 400 },
      );
    }
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

  const upsert = body.upsert === true;

  // Sign all paths in parallel. createSignedUploadUrl is a quick local-JWT
  // op on the Supabase side, so this scales linearly with little wall time.
  const signed = await Promise.all(
    paths.map(async (path) => {
      const fullPath = `${slug}/${path}`;
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUploadUrl(fullPath, { upsert });
      if (error || !data) {
        return {
          path,
          error: error?.message ?? "Failed to sign upload URL.",
        };
      }
      return {
        path,
        signedPath: data.path,
        token: data.token,
        signedUrl: data.signedUrl,
      };
    }),
  );

  return NextResponse.json({ signed });
}
