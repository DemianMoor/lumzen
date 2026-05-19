import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import { fetchChapters } from "@/lib/audiobooks/librivox";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: book } = await supabase
    .from("audiobooks")
    .select("id, librivox_id")
    .eq("id", id)
    .maybeSingle();

  if (!book) {
    return NextResponse.json({ error: "book not found" }, { status: 404 });
  }

  // First, see if chapters are already cached in audiobook_chapters.
  const admin = createSupabaseAdmin();
  const { data: existing } = await admin
    .from("audiobook_chapters")
    .select("*")
    .eq("book_id", book.id)
    .order("chapter_number", { ascending: true });

  if (existing && existing.length > 0) {
    return NextResponse.json({ chapters: existing });
  }

  if (!book.librivox_id) {
    return NextResponse.json({ chapters: [] });
  }

  try {
    const chapters = await fetchChapters(book.librivox_id);
    if (chapters.length > 0) {
      const rows = chapters.map((c) => ({
        book_id: book.id,
        chapter_number: c.chapter_number,
        title: c.title,
        stream_url: c.stream_url,
        duration_seconds: c.duration_seconds,
      }));
      await admin.from("audiobook_chapters").insert(rows);

      const { data: saved } = await admin
        .from("audiobook_chapters")
        .select("*")
        .eq("book_id", book.id)
        .order("chapter_number", { ascending: true });

      return NextResponse.json({ chapters: saved ?? rows });
    }
    return NextResponse.json({ chapters: [] });
  } catch (err) {
    return NextResponse.json(
      { chapters: [], error: err instanceof Error ? err.message : "lookup failed" },
      { status: 502 },
    );
  }
}
