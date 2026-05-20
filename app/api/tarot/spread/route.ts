import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  SPREADS,
  type SpreadKind,
  drawCards,
  getAllCards,
  saveReading,
} from "@/lib/tarot/client";
import { getLocaleFromRequest } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    spread?: string;
    question?: string;
  };

  const spread = (body.spread ?? "three") as SpreadKind;
  if (!(spread in SPREADS)) {
    return NextResponse.json({ error: "unknown spread" }, { status: 400 });
  }

  const locale = getLocaleFromRequest(request);
  const config = SPREADS[spread];
  const deck = await getAllCards(locale);
  if (deck.length === 0) {
    return NextResponse.json({ error: "deck not seeded" }, { status: 503 });
  }

  const drawn = drawCards(deck, config.count);
  const placed = config.positions.map((position, i) => ({
    position,
    card: drawn[i],
  }));

  const { id } = await saveReading({
    userId: user.id,
    spreadType: spread,
    cards: placed,
    question: body.question?.trim() || null,
    aiInterpretation: null,
    locale,
  });

  return NextResponse.json({
    readingId: id,
    spread,
    cards: placed,
    question: body.question ?? null,
  });
}
