import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_PILLARS = new Set(Object.keys(PILLARS));
const VALID_STATUSES = new Set(["draft", "scheduled", "published"]);

type CsvRow = {
  slug?: string;
  title?: string;
  subtitle?: string;
  pillar?: string;
  content?: string;
  excerpt?: string;
  tags?: string;
  status?: string;
  scheduled_for?: string;
  hero_image_url?: string;
};

type ImportResult = {
  inserted: number;
  updated: number;
  skipped: number;
  errors: { row: number; reason: string }[];
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing CSV file." }, { status: 400 });
  }

  const text = await file.text();
  const parsed = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  if (parsed.errors.length > 0) {
    return NextResponse.json(
      {
        error: "CSV could not be parsed.",
        details: parsed.errors.slice(0, 5).map((e) => e.message),
      },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdmin();
  const result: ImportResult = { inserted: 0, updated: 0, skipped: 0, errors: [] };

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const rowNo = i + 2; // header is row 1

    const title = row.title?.trim();
    const pillar = row.pillar?.trim();
    if (!title) {
      result.errors.push({ row: rowNo, reason: "Missing title." });
      result.skipped++;
      continue;
    }
    if (!pillar || !VALID_PILLARS.has(pillar)) {
      result.errors.push({
        row: rowNo,
        reason: `Invalid pillar "${pillar ?? ""}".`,
      });
      result.skipped++;
      continue;
    }

    const slug = (row.slug?.trim() ? slugify(row.slug.trim()) : slugify(title)) ||
      `article-${Date.now()}-${i}`;

    const status = row.status && VALID_STATUSES.has(row.status)
      ? row.status
      : "draft";

    const scheduledFor = row.scheduled_for?.trim()
      ? safeIso(row.scheduled_for.trim())
      : null;
    if (row.scheduled_for?.trim() && !scheduledFor) {
      result.errors.push({
        row: rowNo,
        reason: `Invalid scheduled_for "${row.scheduled_for}".`,
      });
      result.skipped++;
      continue;
    }

    const tags = row.tags
      ? row.tags
          .split(/[,;]/)
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 0)
          .slice(0, 20)
      : [];

    const payload = {
      title,
      slug,
      subtitle: row.subtitle?.trim() || null,
      excerpt: row.excerpt?.trim() || null,
      content: row.content ?? null,
      hero_image_url: row.hero_image_url?.trim() || null,
      pillar: pillar as PillarSlug,
      tags,
      status,
      scheduled_for: scheduledFor,
      published_at: status === "published" ? new Date().toISOString() : null,
      created_by: editor.user.id,
    };

    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("articles")
        .update(payload)
        .eq("id", existing.id);
      if (error) {
        result.errors.push({ row: rowNo, reason: error.message });
        result.skipped++;
      } else {
        result.updated++;
      }
    } else {
      const { error } = await supabase.from("articles").insert(payload);
      if (error) {
        result.errors.push({ row: rowNo, reason: error.message });
        result.skipped++;
      } else {
        result.inserted++;
      }
    }
  }

  return NextResponse.json({ success: true, result });
}

function safeIso(text: string): string | null {
  const d = new Date(text);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
