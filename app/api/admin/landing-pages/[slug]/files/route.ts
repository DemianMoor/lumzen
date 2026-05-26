import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "landing-pages";

function isSafePath(p: string): boolean {
  if (!p) return false;
  if (p.includes("..")) return false;
  if (p.startsWith("/") || p.startsWith("\\")) return false;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;
  const recursive = request.nextUrl.searchParams.get("recursive") === "true";
  const supabase = createSupabaseAdmin();

  if (!recursive) {
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
          path: f.name,
          size: f.metadata?.size ?? null,
          updated_at: f.updated_at ?? null,
        })),
    });
  }

  // Walk the bucket recursively. Supabase Storage returns folder placeholders
  // with a null metadata field; real files carry a metadata object with size.
  type FlatFile = {
    path: string;
    size: number;
    updated_at: string | null;
  };
  const out: FlatFile[] = [];

  async function walk(prefix: string): Promise<void> {
    const full = prefix ? `${slug}/${prefix}` : slug;
    const { data: items, error } = await supabase.storage.from(BUCKET).list(full, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(error.message);
    for (const item of items ?? []) {
      if (item.name.startsWith(".")) continue;
      const childPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.metadata) {
        out.push({
          path: childPath,
          size: (item.metadata as { size?: number }).size ?? 0,
          updated_at: item.updated_at ?? null,
        });
      } else {
        await walk(childPath);
      }
    }
  }

  try {
    await walk("");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "List failed." },
      { status: 500 },
    );
  }
  return NextResponse.json({ files: out });
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

  // Accept either ?path=foo/bar.png or a JSON body { name | path }.
  let targetPath = request.nextUrl.searchParams.get("path") ?? "";
  if (!targetPath) {
    const body = await request.json().catch(() => ({}));
    targetPath = (body?.path ?? body?.name ?? "").toString();
  }
  targetPath = targetPath.trim();

  if (!isSafePath(targetPath)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([`${slug}/${targetPath}`]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
