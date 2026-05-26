import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { detectChrome } from "@/lib/landing-page-chrome";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const STORAGE_PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public/landing-pages`;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;

  const supabase = createSupabaseAdmin();
  const { data: page, error } = await supabase
    .from("landing_pages")
    .select("entry_file")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !page) {
    return NextResponse.json(
      { error: error?.message || "Landing page not found." },
      { status: 404 },
    );
  }

  const entry = page.entry_file || "index.html";
  const entryUrl = `${STORAGE_PUBLIC_BASE}/${slug}/${entry}`;

  let html: string;
  try {
    const res = await fetch(entryUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Bundle missing (${res.status}).` },
        { status: 502 },
      );
    }
    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch landing-page bundle." },
      { status: 502 },
    );
  }

  const result = detectChrome(html);
  return NextResponse.json(result);
}
