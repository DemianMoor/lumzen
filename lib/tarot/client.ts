import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supabase";
import type { Locale } from "@/lib/i18n/config";

export type TarotCard = {
  id: string;
  name: string;
  type: "major" | "minor";
  suit: string | null;
  value: number | null;
  meaning_upright: string;
  meaning_reversed: string;
  description: string | null;
  image_url: string | null;
};

export type DrawnCard = TarotCard & { reversed: boolean };

export const SPREADS = {
  daily: { count: 1, positions: ["Today"] },
  three: { count: 3, positions: ["Past", "Present", "Future"] },
  yes_no: { count: 1, positions: ["Answer"] },
  love: {
    count: 3,
    positions: ["You", "The other", "Between you"],
  },
  career: {
    count: 3,
    positions: ["Where you stand", "The opening", "What it asks of you"],
  },
  celtic_cross: {
    count: 10,
    positions: [
      "The present",
      "The challenge",
      "The root",
      "The recent past",
      "The crown",
      "The near future",
      "Self",
      "Environment",
      "Hopes and fears",
      "The outcome",
    ],
  },
} as const;

export type SpreadKind = keyof typeof SPREADS;

/**
 * Get the full deck (all 78) for the given locale. Falls back to English rows
 * if the locale has no seeded translations yet. Public reference data, served
 * via the public tarot_cards SELECT policy.
 */
export async function getAllCards(locale: Locale = "en"): Promise<TarotCard[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tarot_cards")
    .select("*")
    .eq("locale", locale)
    .order("type", { ascending: true })
    .order("value", { ascending: true });

  if (error) throw error;
  if (data && data.length > 0) return data as TarotCard[];

  // Fallback: no rows for this locale yet → use English.
  if (locale !== "en") {
    const { data: enData, error: enError } = await supabase
      .from("tarot_cards")
      .select("*")
      .eq("locale", "en")
      .order("type", { ascending: true })
      .order("value", { ascending: true });
    if (enError) throw enError;
    return (enData ?? []) as TarotCard[];
  }
  return [];
}

/**
 * Deterministic per-user, per-day pick for the daily card. The same user
 * gets the same card on refresh until the date rolls over.
 */
export function pickDailyCardId(userId: string, isoDate: string, deck: TarotCard[]): {
  card: TarotCard;
  reversed: boolean;
} {
  const seed = hashString(`${userId}::${isoDate}`);
  const idx = seed % deck.length;
  const reversed = ((seed >> 8) & 1) === 1;
  return { card: deck[idx], reversed };
}

/**
 * Pick `count` distinct cards using a per-call random seed (Date.now() + Math.random()).
 * For the daily card, use pickDailyCardId instead.
 */
export function drawCards(deck: TarotCard[], count: number): DrawnCard[] {
  const available = [...deck];
  const out: DrawnCard[] = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    const [card] = available.splice(idx, 1);
    out.push({ ...card, reversed: Math.random() < 0.5 });
  }
  return out;
}

function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Save a reading to tarot_readings (admin client — RLS allows insert by
 * authenticated users but the API route runs server-side and we already
 * trust the user id from auth.getUser()).
 */
export async function saveReading(params: {
  userId: string;
  spreadType: SpreadKind;
  cards: Array<{ position: string; card: DrawnCard }>;
  question: string | null;
  aiInterpretation: string | null;
  locale: Locale;
}): Promise<{ id: string }> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("tarot_readings")
    .insert({
      user_id: params.userId,
      spread_type: params.spreadType,
      cards: params.cards,
      question: params.question,
      ai_interpretation: params.aiInterpretation,
      locale: params.locale,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id as string };
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
