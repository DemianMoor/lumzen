import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import { buildClaudeSystemPrompt } from "@/lib/brand-voice";
import { rateLimit } from "@/lib/rate-limit";
import type { ComputedChart } from "@/lib/astrology/ephemeris";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`natal:${user.id}`, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate limited", retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  const admin = createSupabaseAdmin();
  const { data: chart } = await admin
    .from("natal_charts")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!chart) {
    return NextResponse.json({ error: "no chart on file" }, { status: 404 });
  }

  if (chart.ai_interpretation) {
    return NextResponse.json({ interpretation: chart.ai_interpretation });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "anthropic key not configured" },
      { status: 503 },
    );
  }

  const data = chart.chart_data as ComputedChart;
  const prompt = formatNatalPrompt(data);

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1100,
    system: buildClaudeSystemPrompt("natal"),
    messages: [{ role: "user", content: prompt }],
  });

  const interpretation = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();

  await admin
    .from("natal_charts")
    .update({ ai_interpretation: interpretation })
    .eq("user_id", user.id);

  return NextResponse.json({ interpretation });
}

function formatNatalPrompt(chart: ComputedChart): string {
  const placements = chart.bodies
    .filter((b) => ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"].includes(b.key))
    .map(
      (b) =>
        `${b.label}: ${capitalize(b.sign)} (house ${b.house})${b.retrograde ? ", retrograde" : ""}`,
    )
    .join("\n");

  return `Natal placements:
Ascendant: ${capitalize(chart.ascendant.sign)}
Midheaven: ${capitalize(chart.midheaven.sign)}
${placements}

Write a 4-paragraph interpretation. Lead with Sun, Moon, and Rising — the trio that shapes identity, inner life, and how the seeker meets the world. Then mention one or two other placements that stand out (Mercury, Venus, or Mars). Close with what this chart asks the seeker to practice. Speak directly to the seeker as "you". No deterministic predictions. No exclamation marks.`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
