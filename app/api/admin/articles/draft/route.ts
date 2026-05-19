import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentEditor } from "@/lib/admin-auth";
import {
  buildClaudeSystemPrompt,
  PILLARS,
  type PillarSlug,
} from "@/lib/brand-voice";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_PILLARS = Object.keys(PILLARS) as PillarSlug[];
const MODEL = "claude-haiku-4-5";

export async function POST(request: NextRequest) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await request.json();
  const topic = (body?.topic ?? "").toString().trim();
  const pillar = (body?.pillar ?? "").toString().trim() as PillarSlug;
  const notes = (body?.notes ?? "").toString().trim();

  if (!topic) {
    return NextResponse.json({ error: "Please provide a topic." }, { status: 400 });
  }
  if (!VALID_PILLARS.includes(pillar)) {
    return NextResponse.json({ error: "Pick a valid pillar." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI drafting is not configured (ANTHROPIC_API_KEY missing)." },
      { status: 500 },
    );
  }

  const pillarMeta = PILLARS[pillar];

  const userPrompt = `Draft a LumZen editorial article for the "${pillarMeta.name}" pillar.

Topic: ${topic}
${notes ? `Editor notes: ${notes}` : ""}

Return STRICTLY a JSON object with these keys and nothing else:
{
  "title": "string — Cormorant-feeling headline, no exclamation marks, no ALL CAPS",
  "subtitle": "string — one-line dek, 1–2 sentences",
  "excerpt": "string — 2–3 sentence summary for cards and meta description",
  "content": "string — full article body in markdown, ~700–1000 words, with ## subheadings and 3–6 sections",
  "tags": ["3–6 lowercase tag strings"]
}

Apply every LumZen voice rule from the system prompt. No exclamation marks. No banned vocabulary.`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      temperature: 0.7,
      system: buildClaudeSystemPrompt("guide"),
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Claude returned no text content." },
        { status: 502 },
      );
    }

    const raw = textBlock.text.trim();
    const jsonText = extractJson(raw);
    let draft: {
      title: string;
      subtitle?: string;
      excerpt?: string;
      content: string;
      tags?: string[];
    };
    try {
      draft = JSON.parse(jsonText);
    } catch (err) {
      console.error("Claude JSON parse error:", err, "raw:", raw.slice(0, 400));
      return NextResponse.json(
        { error: "Claude returned malformed JSON. Try again." },
        { status: 502 },
      );
    }

    if (!draft.title || !draft.content) {
      return NextResponse.json(
        { error: "Claude returned incomplete draft. Try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ draft });
  } catch (err) {
    console.error("AI draft generation error:", err);
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json(
      { error: `Could not generate the draft: ${message}` },
      { status: 500 },
    );
  }
}

/**
 * Claude sometimes wraps JSON in ```json fences or prefatory text.
 * Strip fences and grab the first {...} block.
 */
function extractJson(raw: string): string {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1] : raw;
  const objMatch = candidate.match(/\{[\s\S]*\}/);
  return objMatch ? objMatch[0] : candidate;
}
