import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "landing-pages";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.entry_file === "string") {
    updates.entry_file = body.entry_file.trim() || "index.html";
  }
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
  if (typeof body.gtm_id === "string" || body.gtm_id === null) {
    updates.gtm_id = body.gtm_id || null;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("landing_pages")
    .update(updates)
    .eq("slug", slug)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ landingPage: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;
  const supabase = createSupabaseAdmin();

  // Best-effort cleanup of storage objects under this slug.
  const { data: files } = await supabase.storage.from(BUCKET).list(slug, {
    limit: 1000,
  });
  if (files && files.length > 0) {
    const paths = files.map((f) => `${slug}/${f.name}`);
    await supabase.storage.from(BUCKET).remove(paths);
  }

  const { error } = await supabase
    .from("landing_pages")
    .delete()
    .eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
