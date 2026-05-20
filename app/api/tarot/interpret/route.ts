import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import { buildClaudeSystemPrompt } from "@/lib/brand-voice";
import { rateLimit } from "@/lib/rate-limit";
import { getLocaleFromRequest } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type PlacedCard = {
  position: string;
  card: {
    name: string;
    reversed: boolean;
    meaning_upright: string;
    meaning_reversed: string;
  };
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`tarot:${user.id}`, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate limited", retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  const locale = getLocaleFromRequest(request);

  const body = (await request.json().catch(() => ({}))) as {
    readingId?: string;
  };

  if (!body.readingId) {
    return NextResponse.json({ error: "readingId required" }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  const { data: reading, error } = await admin
    .from("tarot_readings")
    .select("id, user_id, cards, question, spread_type, ai_interpretation, locale")
    .eq("id", body.readingId)
    .maybeSingle();

  if (error || !reading) {
    return NextResponse.json({ error: "reading not found" }, { status: 404 });
  }

  if (reading.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Reuse existing interpretation only if it was generated in the same locale.
  if (reading.ai_interpretation && reading.locale === locale) {
    return NextResponse.json({ interpretation: reading.ai_interpretation });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "anthropic key not configured" },
      { status: 503 },
    );
  }

  const cards = reading.cards as PlacedCard[];
  const userPrompt = formatPrompt(reading.spread_type, reading.question, cards);

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    system: buildClaudeSystemPrompt("tarot", locale),
    messages: [{ role: "user", content: userPrompt }],
  });

  const interpretation = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();

  await admin
    .from("tarot_readings")
    .update({ ai_interpretation: interpretation, locale })
    .eq("id", reading.id);

  return NextResponse.json({ interpretation });
}

function formatPrompt(
  spreadType: string,
  question: string | null,
  cards: PlacedCard[],
): string {
  const drawn = cards
    .map(
      (c, i) =>
        `${i + 1}. ${c.position}: ${c.card.name}${c.card.reversed ? " (reversed)" : ""} — ${
          c.card.reversed ? c.card.meaning_reversed : c.card.meaning_upright
        }`,
    )
    .join("\n");

  const intro = question
    ? `The seeker brought this question: "${question}"`
    : "The seeker drew these cards as an open inquiry.";

  return `Spread type: ${spreadType}
${intro}

Cards drawn:
${drawn}

Compose a reading in 3 to 5 short paragraphs. Speak directly to the seeker as "you". Read each position in turn, then close with a gentle integration. Reference the seeker's agency. No deterministic predictions. No exclamation marks.`;
}
