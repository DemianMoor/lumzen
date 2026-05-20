/**
 * Translate messages/en.json into Ukrainian (uk) and Russian (ru) via Claude.
 *
 * - One API call per locale (cheaper, more consistent voice within locale)
 * - System prompt encodes LumZen voice rules + i18n rules
 * - Output: messages/uk.json and messages/ru.json (overwrites)
 *
 * Run with: node scripts/translate-ui.mjs
 * Requires ANTHROPIC_API_KEY in .env.local.
 */
import { readFile, writeFile } from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";

// Minimal .env.local loader (avoids requiring dotenv as a dep).
async function loadEnv() {
  try {
    const raw = await readFile(".env.local", "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}
await loadEnv();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY not set in .env.local");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6";

const TARGETS = [
  { code: "uk", name: "Ukrainian", endonym: "українська" },
  { code: "ru", name: "Russian", endonym: "русский" },
];

const TRANSLATOR_SYSTEM = (target) => `You are translating UI strings for LumZen — a calm, editorial spiritual-practice website — from English into ${target.name} (${target.endonym}).

ABSOLUTE RULES:
1. Output a single JSON object — same keys as input, translated values. No prose, no markdown fences, no commentary. Begin your response with { and end with }.
2. NEVER translate the brand name "LumZen". Keep it in Latin characters.
3. NEVER translate or remove the ✦ glyph (gold star). Keep it exactly where it appears.
4. NEVER translate placeholder tokens in braces like {name}, {count}, {year}, {email}, {siteUrl}, {legalEntity}, {brand}, {seconds}, {max}, {current}, {total}, {remaining}, {province}, {width}, {height}. Keep them intact with the same brace syntax.
5. Use NO exclamation marks anywhere. The LumZen voice never raises its voice.
6. Tarot card names and astrological terms: use the standard ${target.name} equivalents (e.g. Russian: "Дурак", "Маг", "Жрица"; Ukrainian: "Дурень", "Маг", "Жриця"). Use established traditional translations, not transliterations of English.
7. "Chakra" → standard ${target.name} word for chakra (чакра); keep specific chakra names in the locally accepted form.
8. Tone: calm authority, mystical but grounded, editorial not promotional, quiet warmth. Magazine prose, not landing-page hype.
9. Headlines may be poetic and use grammatical inversion typical of the target language.
10. Keep arrows (→, ←), bullets (·), and em-dashes (—) exactly as they appear in source.
11. Email addresses (hello@lumzen.co, privacy@lumzen.co) and phone numbers stay unchanged.
12. Acronyms like TCPA, CAN-SPAM, HIPAA, COPPA, GPC, DAA, NAI, SMS, IP, AI, GDPR stay in English.
13. Legal text (privacy/terms sections): translate accurately and naturally. ${target.name} legal phrasing where standard equivalents exist; otherwise faithful translation.
14. ${target.code === "ru" ? "Use formal Russian (вы / ваш), not informal (ты / твой)." : "Use formal Ukrainian (Ви / Ваш), not informal (ти / твій)."}
15. CTAs are invitations, not commands ("Begin your journey ✦" → an inviting form, not an imperative bark).
16. Where the source contains "the community", "seekers", "the practice" — preserve that quiet, communal framing. Do not use marketing words for "users" or "customers".

VOCAB GUIDANCE:
- "Sanctuary" → ${target.code === "ru" ? "святилище / убежище" : "святилище / прихисток"} (whichever fits the line)
- "Stillness" → ${target.code === "ru" ? "тишина / покой" : "тиша / спокій"}
- "Practice" (spiritual) → ${target.code === "ru" ? "практика" : "практика"}
- "Journey" → ${target.code === "ru" ? "путь / странствие" : "шлях / мандрівка"}
- "Pillar" (as in five pillars of LumZen) → ${target.code === "ru" ? "столп" : "стовп / опора"}

Output JSON shape:
{
  "key.one": "translated value 1",
  "key.two": "translated value 2",
  ...
}

If a key's value is a single English word that has no natural ${target.name} equivalent (e.g. a proper noun), keep it in English.`;

async function translateLocale(target, entries) {
  // Chunk into ~150 keys per request to keep response < max_tokens comfortably.
  const CHUNK_SIZE = 150;
  const chunks = [];
  for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
    chunks.push(entries.slice(i, i + CHUNK_SIZE));
  }

  const merged = {};
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const inputObj = Object.fromEntries(chunk);
    const userMessage = `Translate every value in this JSON into ${target.name}. Return ONLY the JSON object — no fences, no prose.\n\n${JSON.stringify(inputObj, null, 2)}`;

    process.stdout.write(`  chunk ${i + 1}/${chunks.length} (${chunk.length} keys)... `);

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system: TRANSLATOR_SYSTEM(target),
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Strip any leading/trailing prose around the JSON.
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error(`Chunk ${i + 1}: no JSON object found in response: ${text.slice(0, 200)}`);
    }
    const jsonText = text.slice(firstBrace, lastBrace + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error(`\nParse error on chunk ${i + 1}:`, err.message);
      console.error("Raw text (first 500 chars):", text.slice(0, 500));
      throw err;
    }

    // Verify same key set returned.
    const missing = chunk.map(([k]) => k).filter((k) => !(k in parsed));
    if (missing.length) {
      console.warn(`\n  warning: ${missing.length} keys missing from response; backfilling from English:`, missing.slice(0, 5));
      for (const k of missing) parsed[k] = inputObj[k];
    }

    Object.assign(merged, parsed);
    process.stdout.write(`done (${response.usage.input_tokens} in, ${response.usage.output_tokens} out)\n`);
  }

  return merged;
}

async function main() {
  const enRaw = await readFile("messages/en.json", "utf-8");
  const en = JSON.parse(enRaw);
  const entries = Object.entries(en).filter(([k]) => !k.startsWith("_meta"));

  console.log(`Translating ${entries.length} keys.`);

  for (const target of TARGETS) {
    console.log(`\n→ ${target.name} (${target.code})`);
    const translated = await translateLocale(target, entries);

    // Sort and write.
    const sorted = Object.fromEntries(
      Object.entries(translated).sort(([a], [b]) => a.localeCompare(b))
    );
    await writeFile(
      `messages/${target.code}.json`,
      JSON.stringify(sorted, null, 2) + "\n",
      "utf-8",
    );
    console.log(`  wrote messages/${target.code}.json (${Object.keys(sorted).length} keys)`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
