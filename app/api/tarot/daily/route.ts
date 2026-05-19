import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import { getAllCards, pickDailyCardId, todayISO } from "@/lib/tarot/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const deck = await getAllCards();
  if (deck.length === 0) {
    return NextResponse.json(
      { error: "deck not seeded" },
      { status: 503 },
    );
  }

  const date = todayISO();
  const { card, reversed } = pickDailyCardId(user.id, date, deck);

  // Look for an existing reading saved for today; if not present, save it.
  const admin = createSupabaseAdmin();
  const { data: existing } = await admin
    .from("tarot_readings")
    .select("id, ai_interpretation, cards")
    .eq("user_id", user.id)
    .eq("spread_type", "daily")
    .gte("created_at", `${date}T00:00:00Z`)
    .lt("created_at", `${date}T23:59:59Z`)
    .maybeSingle();

  let readingId: string;
  let aiInterpretation: string | null = null;

  if (existing) {
    readingId = existing.id;
    aiInterpretation = existing.ai_interpretation;
  } else {
    const cardsPayload = [{ position: "Today", card: { ...card, reversed } }];
    const { data: inserted, error } = await admin
      .from("tarot_readings")
      .insert({
        user_id: user.id,
        spread_type: "daily",
        cards: cardsPayload,
        question: null,
        ai_interpretation: null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    readingId = inserted.id as string;
  }

  return NextResponse.json({
    readingId,
    date,
    card: { ...card, reversed },
    aiInterpretation,
  });
}
