/**
 * Translate seeded reference content (tarot_cards, affirmations, spiritual_guides)
 * from English into Ukrainian and Russian via Claude, then upsert into Supabase.
 *
 * Strategy:
 *   - Read all rows with locale='en' from each table.
 *   - Translate text fields in batches via Claude (one call per chunk per locale).
 *   - Upsert translated rows with locale='uk' or 'ru', preserving keys/relations.
 *
 * Run with: node scripts/translate-seed.mjs
 *           node scripts/translate-seed.mjs --only=tarot
 *           node scripts/translate-seed.mjs --only=affirmations
 *           node scripts/translate-seed.mjs --only=guides
 *           node scripts/translate-seed.mjs --only=tarot --locale=ru
 *
 * Requires ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
import { readFile } from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

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

const required = ["ANTHROPIC_API_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
for (const k of required) {
  if (!process.env[k]) {
    console.error(`Missing ${k} in .env.local`);
    process.exit(1);
  }
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--(\w+)=(.+)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  }),
);

const ONLY = args.only;
const LOCALES = args.locale ? [args.locale] : ["uk", "ru"];

const TARGETS = {
  uk: { name: "Ukrainian", endonym: "українська" },
  ru: { name: "Russian", endonym: "русский" },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6";

function translatorSystem(target, contentType) {
  const baseRules = `You are translating LumZen content from English into ${target.name} (${target.endonym}).

LumZen is a calm, editorial spiritual-practice website. Voice: calm authority, mystical but grounded, editorial not promotional, quiet warmth. Magazine prose, never landing-page hype.

ABSOLUTE RULES:
1. Output ONLY a single JSON object — same numeric keys as input, translated values. No prose, no markdown fences. Begin with { and end with }.
2. NO exclamation marks anywhere.
3. NO ALL CAPS for emphasis.
4. Use ${target.code === "ru" ? "formal Russian (вы / ваш)" : "formal Ukrainian (Ви / Ваш)"}, not informal.
5. Tarot card names and astrological terms: use established traditional ${target.name} equivalents (Russian: "Дурак / Маг / Жрица / Императрица"; Ukrainian: "Дурень / Маг / Жриця / Імператриця"). Do NOT transliterate English.
6. Suit names — Russian: Жезлы / Кубки / Мечи / Пентакли. Ukrainian: Жезли / Кубки / Мечі / Пентаклі.
7. Court cards — Russian: Паж / Рыцарь / Королева / Король. Ukrainian: Паж / Лицар / Королева / Король.
8. "Chakra" → чакра. Use locally accepted chakra names.
9. Keep brand name "LumZen" in Latin characters where it appears.
10. Keep the gold star glyph (✦) intact where it appears in the source.
11. Em-dashes (—) and en-dashes (–) and bullets (·) stay as-is.
12. Acronyms (AI, TCPA, SMS) stay in English. URLs, email addresses, phone numbers unchanged.
13. Headlines may use grammatical inversion typical of the target language.
14. The translation should feel native, not a literal word-for-word rendering. Adapt idioms and metaphors so they land in the target language.`;

  const typeRules = {
    tarot: `\n\nTAROT-SPECIFIC:
- The 'name' field uses the traditional ${target.name} tarot card name.
- 'meaning_upright' and 'meaning_reversed' are 1-2 sentence interpretations. Keep them concise, evocative, never fatalistic.
- 'description' is a single sentence of poetic guidance. Render it with the same compression and weight.
- Reference the seeker's agency. Never deterministic ("you will lose your job"). Always reflective ("notice what is asking to be released").`,
    affirmation: `\n\nAFFIRMATION-SPECIFIC:
- These are first-person present-tense affirmations. ${target.code === "ru" ? "Russian: start with 'Я являюсь', 'Я выбираю', 'У меня есть', 'Я открыт/открыта', etc. Use grammatical gender naturally — prefer the formulation that does not require choosing a gender (e.g. 'Я выбираю', 'Я открываюсь' over 'Я открыт/открыта')." : "Ukrainian: start with 'Я є', 'Я обираю', 'У мене є', 'Я відкритий/відкрита', etc. Use grammatical gender naturally — prefer the formulation that does not require choosing a gender."}
- Emotionally resonant. Specific. No platitudes.
- Keep the same number of affirmations as input.`,
    guide: `\n\nGUIDE-SPECIFIC:
- These are long-form spiritual practice essays in markdown. PRESERVE all markdown formatting (## headings, paragraphs, line breaks, emphasis).
- 'title' is a short editorial headline. 'description' is a 1-2 sentence summary. 'content' is the full body in markdown.
- 'category' and 'difficulty' enums (energy_systems, shadow_work, beginner, etc.) STAY IN ENGLISH — they are identifiers, not user-facing labels.
- 'author' name stays unchanged.
- Tags array stays in English.`,
  };

  return baseRules + (typeRules[contentType] || "");
}

async function translateBatch(target, contentType, items, fields) {
  const input = {};
  items.forEach((row, idx) => {
    const obj = {};
    for (const f of fields) {
      if (row[f] !== null && row[f] !== undefined) obj[f] = row[f];
    }
    input[String(idx)] = obj;
  });

  const userMessage = `Translate every text value in this JSON into ${target.name}. Preserve the JSON keys (the numeric indexes) and field names exactly. Return ONLY the JSON object.

${JSON.stringify(input, null, 2)}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: translatorSystem(target, contentType),
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error(`No JSON object found in response: ${text.slice(0, 200)}`);
  }
  const parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1));
  return { parsed, usage: response.usage };
}

function chunked(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ─────────────────────────────────────────────────────────────────
// Tarot
// ─────────────────────────────────────────────────────────────────
async function translateTarot() {
  console.log("\n→ tarot_cards");
  const { data: rows, error } = await supabase
    .from("tarot_cards")
    .select("id, name, type, suit, value, meaning_upright, meaning_reversed, description, image_url, locale")
    .eq("locale", "en")
    .order("id");

  if (error) throw error;
  console.log(`  fetched ${rows.length} English cards`);

  const fields = ["name", "meaning_upright", "meaning_reversed", "description"];

  for (const code of LOCALES) {
    const target = { ...TARGETS[code], code };
    console.log(`\n  → ${target.name} (${code})`);

    const chunks = chunked(rows, 12);
    const allTranslated = [];
    for (let i = 0; i < chunks.length; i++) {
      process.stdout.write(`    chunk ${i + 1}/${chunks.length} (${chunks[i].length} cards)... `);
      const { parsed, usage } = await translateBatch(target, "tarot", chunks[i], fields);
      for (let j = 0; j < chunks[i].length; j++) {
        const orig = chunks[i][j];
        const tr = parsed[String(j)] || {};
        allTranslated.push({
          id: orig.id,
          name: tr.name || orig.name,
          type: orig.type,
          suit: orig.suit,
          value: orig.value,
          meaning_upright: tr.meaning_upright || orig.meaning_upright,
          meaning_reversed: tr.meaning_reversed || orig.meaning_reversed,
          description: tr.description || orig.description,
          image_url: orig.image_url,
          locale: code,
        });
      }
      process.stdout.write(`done (${usage.input_tokens} in, ${usage.output_tokens} out)\n`);
    }

    const { error: upsertError } = await supabase
      .from("tarot_cards")
      .upsert(allTranslated, { onConflict: "id,locale" });
    if (upsertError) throw upsertError;
    console.log(`    upserted ${allTranslated.length} tarot_cards rows (locale=${code})`);
  }
}

// ─────────────────────────────────────────────────────────────────
// Affirmations
// ─────────────────────────────────────────────────────────────────
async function translateAffirmations() {
  console.log("\n→ affirmations");
  const { data: rows, error } = await supabase
    .from("affirmations")
    .select("id, text, category, subcategory, tags, chakra, is_active, locale")
    .eq("locale", "en")
    .order("category, id");

  if (error) throw error;
  console.log(`  fetched ${rows.length} English affirmations`);

  const fields = ["text"];

  for (const code of LOCALES) {
    const target = { ...TARGETS[code], code };
    console.log(`\n  → ${target.name} (${code})`);

    const chunks = chunked(rows, 40);
    const translatedRows = [];
    for (let i = 0; i < chunks.length; i++) {
      process.stdout.write(`    chunk ${i + 1}/${chunks.length} (${chunks[i].length} affirmations)... `);
      const { parsed, usage } = await translateBatch(target, "affirmation", chunks[i], fields);
      for (let j = 0; j < chunks[i].length; j++) {
        const orig = chunks[i][j];
        const tr = parsed[String(j)] || {};
        translatedRows.push({
          // new uuid auto-generated; identify by (text, locale) uniqueness via upsert-on-conflict if available
          text: tr.text || orig.text,
          category: orig.category,
          subcategory: orig.subcategory,
          tags: orig.tags,
          chakra: orig.chakra,
          is_active: orig.is_active,
          locale: code,
        });
      }
      process.stdout.write(`done (${usage.input_tokens} in, ${usage.output_tokens} out)\n`);
    }

    // Delete existing rows for this locale to keep the seed clean (avoid duplicates on rerun).
    const { error: delError } = await supabase
      .from("affirmations")
      .delete()
      .eq("locale", code);
    if (delError) throw delError;

    const { error: insertError } = await supabase
      .from("affirmations")
      .insert(translatedRows);
    if (insertError) throw insertError;
    console.log(`    replaced ${translatedRows.length} affirmations rows (locale=${code})`);
  }
}

// ─────────────────────────────────────────────────────────────────
// Spiritual Guides
// ─────────────────────────────────────────────────────────────────
async function translateGuides() {
  console.log("\n→ spiritual_guides");
  const { data: rows, error } = await supabase
    .from("spiritual_guides")
    .select("id, slug, title, category, description, content, cover_image_url, author, read_time_minutes, difficulty, tags, related_chakra, is_featured, is_active, locale")
    .eq("locale", "en")
    .order("slug");

  if (error) throw error;
  console.log(`  fetched ${rows.length} English guides`);

  const fields = ["title", "description", "content"];

  for (const code of LOCALES) {
    const target = { ...TARGETS[code], code };
    console.log(`\n  → ${target.name} (${code})`);

    // Guides are large; translate one at a time to stay under max_tokens comfortably.
    const translated = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      process.stdout.write(`    guide ${i + 1}/${rows.length}: ${row.slug}... `);
      const { parsed, usage } = await translateBatch(target, "guide", [row], fields);
      const tr = parsed["0"] || {};
      translated.push({
        slug: row.slug,
        title: tr.title || row.title,
        category: row.category,
        description: tr.description || row.description,
        content: tr.content || row.content,
        cover_image_url: row.cover_image_url,
        author: row.author,
        read_time_minutes: row.read_time_minutes,
        difficulty: row.difficulty,
        tags: row.tags,
        related_chakra: row.related_chakra,
        is_featured: row.is_featured,
        is_active: row.is_active,
        locale: code,
      });
      process.stdout.write(`done (${usage.input_tokens} in, ${usage.output_tokens} out)\n`);
    }

    const { error: upsertError } = await supabase
      .from("spiritual_guides")
      .upsert(translated, { onConflict: "slug,locale" });
    if (upsertError) throw upsertError;
    console.log(`    upserted ${translated.length} spiritual_guides rows (locale=${code})`);
  }
}

// ─────────────────────────────────────────────────────────────────
async function main() {
  const tasks = [];
  if (!ONLY || ONLY === "tarot") tasks.push(translateTarot);
  if (!ONLY || ONLY === "affirmations") tasks.push(translateAffirmations);
  if (!ONLY || ONLY === "guides") tasks.push(translateGuides);

  for (const task of tasks) await task();

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
