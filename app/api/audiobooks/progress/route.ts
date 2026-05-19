import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    bookId?: string;
    chapterId?: string;
    position?: number;
    completed?: boolean;
  } | null;

  if (!body?.bookId || !body.chapterId) {
    return NextResponse.json({ error: "bookId and chapterId required" }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  await admin.from("user_audiobook_progress").upsert(
    {
      user_id: user.id,
      book_id: body.bookId,
      chapter_id: body.chapterId,
      position_seconds: Math.max(0, Math.floor(body.position ?? 0)),
      completed: Boolean(body.completed),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,book_id" },
  );

  return NextResponse.json({ ok: true });
}
