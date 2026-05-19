import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";

const VALID_PILLARS = Object.keys(PILLARS) as PillarSlug[];
const VALID_STATUSES = ["draft", "scheduled", "published"] as const;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ article: data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.slug === "string") {
    const cleanSlug = body.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100);
    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug cannot be empty." }, { status: 400 });
    }
    const supabase = createSupabaseAdmin();
    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", cleanSlug)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "That slug is already used by another article." },
        { status: 400 },
      );
    }
    updates.slug = cleanSlug;
  }

  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.subtitle === "string" || body.subtitle === null) {
    updates.subtitle = body.subtitle || null;
  }
  if (typeof body.excerpt === "string" || body.excerpt === null) {
    updates.excerpt = body.excerpt || null;
  }
  if (typeof body.content === "string" || body.content === null) {
    updates.content = body.content || null;
  }
  if (typeof body.hero_image_url === "string" || body.hero_image_url === null) {
    updates.hero_image_url = body.hero_image_url || null;
  }
  if (Array.isArray(body.tags)) {
    updates.tags = body.tags
      .map((t: unknown) => String(t).trim())
      .filter((t: string) => t.length > 0)
      .slice(0, 20);
  }

  if (typeof body.pillar === "string") {
    if (!VALID_PILLARS.includes(body.pillar as PillarSlug)) {
      return NextResponse.json({ error: "Invalid pillar." }, { status: 400 });
    }
    updates.pillar = body.pillar;
  }

  if (typeof body.status === "string") {
    if (!VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    updates.status = body.status;
    if (body.status === "published") {
      updates.published_at = body.published_at ?? new Date().toISOString();
    } else if (body.status === "draft") {
      updates.published_at = null;
    }
  }

  if (body.scheduled_for === null) {
    updates.scheduled_for = null;
  } else if (typeof body.scheduled_for === "string") {
    const d = new Date(body.scheduled_for);
    if (isNaN(d.getTime())) {
      return NextResponse.json(
        { error: "Invalid scheduled-for date." },
        { status: 400 },
      );
    }
    updates.scheduled_for = d.toISOString();
  }

  if (body.published_at === null) updates.published_at = null;
  else if (typeof body.published_at === "string") {
    const d = new Date(body.published_at);
    if (isNaN(d.getTime())) {
      return NextResponse.json(
        { error: "Invalid published date." },
        { status: 400 },
      );
    }
    updates.published_at = d.toISOString();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Article PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ article: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) {
    console.error("Article DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
