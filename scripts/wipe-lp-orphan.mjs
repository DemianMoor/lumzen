// Recursively wipe every object under landing-pages/<slug>/ in Supabase
// Storage AND drop the matching landing_pages row if present.
// Usage: node scripts/wipe-lp-orphan.mjs <slug>
//
// Use when a failed upload left orphans the admin DELETE can't see (e.g.
// nested folders before the recursive-cleanup fix).
// Run with: node --env-file=.env.local scripts/wipe-lp-orphan.mjs <slug>

import { createClient } from "@supabase/supabase-js";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/wipe-lp-orphan.mjs <slug>");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const BUCKET = "landing-pages";

async function collect(prefix) {
  const full = prefix ? `${slug}/${prefix}` : slug;
  const { data: items, error } = await supabase.storage
    .from(BUCKET)
    .list(full, { limit: 1000 });
  if (error) throw new Error(error.message);
  const out = [];
  for (const item of items ?? []) {
    const child = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.metadata) {
      out.push(`${slug}/${child}`);
    } else {
      out.push(...(await collect(child)));
    }
  }
  return out;
}

const paths = await collect("");
console.log(`Found ${paths.length} object(s) under ${slug}/.`);
if (paths.length > 0) {
  for (let i = 0; i < paths.length; i += 100) {
    const chunk = paths.slice(i, i + 100);
    const { error } = await supabase.storage.from(BUCKET).remove(chunk);
    if (error) throw new Error(error.message);
    console.log(`  removed ${chunk.length}`);
  }
}

const { error: dbError, count } = await supabase
  .from("landing_pages")
  .delete({ count: "exact" })
  .eq("slug", slug);
if (dbError) throw new Error(dbError.message);
console.log(`landing_pages rows deleted: ${count ?? 0}`);
console.log("Done.");
