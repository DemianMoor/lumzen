import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data ?? [] });
}

export async function PUT(request: NextRequest) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await request.json();
  const key = (body?.key ?? "").toString().trim();
  if (!key || !/^[a-z][a-z0-9_]{0,80}$/.test(key)) {
    return NextResponse.json(
      { error: "Key must be lowercase letters, digits, and underscores." },
      { status: 400 },
    );
  }

  let value: unknown = body?.value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed === "true" || trimmed === "false" || trimmed === "null" || /^-?\d+(\.\d+)?$/.test(trimmed)) {
      try {
        value = JSON.parse(trimmed);
      } catch {
        value = trimmed;
      }
    }
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key,
        value,
        updated_by: editor.user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    )
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ setting: data });
}

export async function DELETE(request: NextRequest) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key")?.trim();
  if (!key) {
    return NextResponse.json({ error: "Missing key." }, { status: 400 });
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("site_settings").delete().eq("key", key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
