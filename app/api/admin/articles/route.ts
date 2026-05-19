import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";

const VALID_PILLARS = Object.keys(PILLARS) as PillarSlug[];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(request: NextRequest) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const pillar = searchParams.get("pillar")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";

  const supabase = createSupabaseAdmin();
  let query = supabase
    .from("articles")
    .select("id, slug, title, subtitle, pillar, status, scheduled_for, published_at, updated_at, tags")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (q) {
    query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%,subtitle.ilike.%${q}%`);
  }
  if (pillar && VALID_PILLARS.includes(pillar as PillarSlug)) {
    query = query.eq("pillar", pillar);
  }
  if (status && ["draft", "scheduled", "published"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Articles list error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ articles: data ?? [] });
}

export async function POST(request: NextRequest) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await request.json();
  const title = (body?.title ?? "").toString().trim();
  const pillar = (body?.pillar ?? "").toString().trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!VALID_PILLARS.includes(pillar as PillarSlug)) {
    return NextResponse.json({ error: "Pick a valid pillar." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  let slug = slugify(title) || `article-${Date.now()}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${slugify(title)}-${attempt + 2}`;
  }

  const { data: article, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      pillar,
      status: "draft",
      created_by: editor.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Article create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ article });
}
