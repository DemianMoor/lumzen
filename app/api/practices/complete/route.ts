import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { markPracticeComplete, type PracticeKind } from "@/lib/practices/tracker";

export const dynamic = "force-dynamic";

const VALID_KINDS: PracticeKind[] = [
  "tarot",
  "affirmation",
  "meditation",
  "journaling",
  "gratitude",
];

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { kind?: string } | null;
  if (!body?.kind || !VALID_KINDS.includes(body.kind as PracticeKind)) {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 });
  }

  await markPracticeComplete(user.id, body.kind as PracticeKind);

  return NextResponse.json({ ok: true });
}
