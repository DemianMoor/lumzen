import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await request.json();
  const slug = cleanSlug((body?.slug ?? "").toString());
  const title = (body?.title ?? "").toString().trim();
  const description = body?.description ? body.description.toString().trim() || null : null;
  const entryFile = (body?.entry_file ?? "index.html").toString().trim();
  const gtmId = body?.gtm_id ? body.gtm_id.toString().trim() : null;

  if (!slug || !/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase letters, digits, and dashes." },
      { status: 400 },
    );
  }
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const { data: existing } = await supabase
    .from("landing_pages")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { error: "A landing page with that slug already exists." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("landing_pages")
    .insert({
      slug,
      title,
      description,
      entry_file: entryFile,
      gtm_id: gtmId,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Landing page init error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ landingPage: data });
}
