import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "landing-pages";

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
  const { data, error } = await supabase.storage.from(BUCKET).list(slug, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    files: (data ?? [])
      .filter((f) => !f.name.startsWith("."))
      .map((f) => ({
        name: f.name,
        size: f.metadata?.size ?? null,
        updated_at: f.updated_at ?? null,
      })),
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;
  const body = await request.json().catch(() => ({}));
  const name = (body?.name ?? "").toString().trim();
  if (!name || name.includes("..")) {
    return NextResponse.json({ error: "Invalid file name." }, { status: 400 });
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([`${slug}/${name}`]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
