import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createSupabaseServerClient } from "@/lib/supabase";
import { buildClaudeSystemPrompt } from "@/lib/brand-voice";
import { rateLimit } from "@/lib/rate-limit";
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

  const rl = rateLimit(`affirm:${user.id}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate limited", retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    intention?: string;
    category?: string;
  };

  const intention = body.intention?.trim();
  if (!intention) {
    return NextResponse.json({ error: "intention required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "anthropic key not configured" },
      { status: 503 },
    );
  }

  const locale = getLocaleFromRequest(request);
  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: buildClaudeSystemPrompt("affirmation", locale),
    messages: [
      {
        role: "user",
        content: `Write 5 present-tense affirmations for this intention: "${intention}".
Each should start with "I am", "I have", or "I choose". Specific. No platitudes. No exclamation marks. Return one per line, nothing else.`,
      },
    ],
  });

  const text = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");

  const affirmations = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*\d.)\s]+/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, 5);

  return NextResponse.json({ affirmations });
}
