# LumZen — Stage 1 Build Instructions for Claude Code

> **Read this entire file before executing anything. Then read `docs/BRAND.md`,
> `docs/GUIDEKIN-REFERENCE.md`, and `docs/PLATFORM-RESEARCH.md` in full before
> writing a single line of code.**

## Context

You are building **LumZen**, a free signup-required spiritual practice platform
monetized by ads. The brand identity, copy, color system, typography, and
component patterns are fully specified in `docs/BRAND.md` — that document is
the single source of truth for everything visual and editorial.

The user has already completed all manual setup:
- DNS at Cloudflare → Vercel
- Supabase project provisioned (URL, anon key, service-role key)
- Vercel project linked to this GitHub repo
- Resend domain verified
- Anthropic, Freesound, GTM keys obtained
- `.env.local` populated with all real credentials
- Vercel env vars match `.env.local`
- This repo is empty except for `docs/` containing reference files

**You will perform all database operations programmatically.** The user does
not want to run any SQL or click anything in the Supabase dashboard. Every
migration, every seed, every schema change must be applied by you using the
Supabase service-role key.

## Operating principles (read carefully)

1. **Source of truth precedence.** When information conflicts:
   `docs/BRAND.md` > `docs/PLATFORM-RESEARCH.md` > guidekin's
   `$HOME/guidekin/CLAUDE.md` > this file > your training data.

2. **Don't improvise the brand.** Every color, every font weight, every
   line of copy must come from `docs/BRAND.md`. If you find yourself wanting
   to write a headline or pick a color that isn't there, stop and check the
   doc first.

3. **Don't blindly copy guidekin's voice.** You may copy guidekin's code
   patterns, file structures, function signatures, and architectural
   decisions. You may NOT copy guidekin's editorial voice, brand copy,
   pillar names, sage/amber color palette, or any user-facing strings.
   LumZen's voice and palette are completely different and live in BRAND.md.

4. **Webpack, not Turbopack.** Use `"dev": "next dev --webpack"` in
   package.json scripts. Turbopack has known incompatibilities with the
   project's Supabase + next/headers pattern.

5. **proxy.ts, not middleware.ts.** Place the auth refresh logic in a
   `proxy.ts` file at the repo root, following guidekin's pattern. Do not
   create a `middleware.ts` file.

6. **Three Supabase client factories.** `lib/supabase.ts` must export
   three factories: `createBrowserClient`, `createServerClient` (which
   dynamically imports `next/headers`), and `createAdminClient` (using
   the service-role key, server-only). Read guidekin's `lib/supabase.ts`
   for the exact pattern.

7. **No ORM.** Use `@supabase/supabase-js` queries directly. No Drizzle,
   no Prisma, no Kysely. This matches guidekin and applies to every table
   in LumZen.

8. **Windows / PowerShell environment.** When you suggest or run shell
   commands, use PowerShell syntax (`Remove-Item`, `New-Item`, semicolons
   instead of `&&`, backtick-escape brackets for `[slug]` paths).

9. **No exclamation marks anywhere in user-facing copy.** Grep for `!`
   in your `.tsx` files before committing. The LumZen voice never raises
   its voice. Banned vocabulary is listed in BRAND.md §2.3 — those words
   never appear either.

10. **Clear .next/ after creating new API routes.** Next.js sometimes
    caches stale route manifests. Whenever you add a new `app/api/*`
    route in this session, suggest the user run `Remove-Item -Recurse
    -Force .next` before next test.

## Pre-flight reads (do these now, in order, before writing code)

```
1. Read $HOME/lumzen/docs/BRAND.md in full.
2. Read $HOME/lumzen/docs/GUIDEKIN-REFERENCE.md in full.
3. Read $HOME/lumzen/docs/PLATFORM-RESEARCH.md in full.
4. Unzip $HOME/lumzen/docs/v0-design.zip and inspect:
   - app/globals.css (the color system, animation keyframes)
   - app/layout.tsx (the four-font setup)
   - app/page.tsx (the dashboard reference design)
   - components/mystical-icons.tsx (25 SVG icon components)
5. Read $HOME/guidekin/CLAUDE.md in full.
6. Read $HOME/guidekin/lib/supabase.ts (three-client-factory pattern).
7. Read $HOME/guidekin/lib/admin-auth.ts (getCurrentEditor gate).
8. Read $HOME/guidekin/proxy.ts (auth session refresh pattern).
9. Read $HOME/guidekin/app/api/subscribe/route.ts (TCPA-compliant subscribe).
10. Read $HOME/guidekin/package.json (overlapping dependency versions).
```

After all reads are complete, confirm to the user that you have absorbed
the brand, the codebase patterns, and the build plan. Then proceed.

---

## STAGE 1 EXECUTION — what to build

### 1.1 Scaffold the Next.js project

In `$HOME/lumzen`, scaffold a new Next.js 16.2 + React 19 + TypeScript + Tailwind v4 project using pnpm. Match the dependency versions from the v0 design `package.json` (already in `docs/v0-design.zip`) and add the additional dependencies needed for the LumZen feature set:

**From v0's package.json (already correct, keep as-is):**
- next@16.2.6, react@^19, react-dom@^19
- All Radix UI primitives
- lucide-react, class-variance-authority, clsx, tailwind-merge
- date-fns, embla-carousel-react, recharts, sonner, vaul, zod
- next-themes, react-hook-form, @hookform/resolvers
- @vercel/analytics
- tailwindcss@^4.2.0, @tailwindcss/postcss, tw-animate-css
- typescript@5.7.3

**Additional dependencies LumZen needs (add these):**
- @supabase/supabase-js
- @supabase/ssr
- @anthropic-ai/sdk
- resend
- @react-email/components
- papaparse, @types/papaparse
- jszip
- sharp
- moshier-ephemeris-js (pure-JS natal chart calculation; if it doesn't install cleanly, try `swisseph-wasm` instead — pick whichever builds without errors)
- tz-lookup (timezone from lat/lng, no API key needed)

**Critical config to apply:**
- `package.json` script: `"dev": "next dev --webpack"`
- `package.json` name: `"lumzen"`
- `.gitignore`: standard Next.js ignores + `.env.local` + `.next/` + `/supabase/.temp` + `*.log`

Commit nothing yet. Continue to 1.2.

### 1.2 Apply the LumZen design system

Copy these files from `docs/v0-design.zip` into the new repo verbatim:
- `app/globals.css` → `app/globals.css`
- `app/layout.tsx` → `app/layout.tsx`
- `components/mystical-icons.tsx` → `components/mystical-icons.tsx`
- All files in `components/ui/` → `components/ui/`
- `components.json` (shadcn config) → `components.json`
- `postcss.config.mjs` → `postcss.config.mjs`
- `tsconfig.json` → `tsconfig.json` (merge with anything pnpm scaffolded)
- `next.config.mjs` → `next.config.mjs` (merge as needed)
- `lib/utils.ts` → `lib/utils.ts`
- `hooks/use-mobile.ts`, `hooks/use-toast.ts` → `hooks/`
- `public/icon.svg`, `public/apple-icon.png`, `public/icon-*-32x32.png` → `public/`

Do not modify these files in this stage — they are the verified output of v0 and the user has approved them.

### 1.3 Build the Supabase plumbing

Create `lib/supabase.ts` with three client factories, mirroring guidekin's pattern exactly (read `$HOME/guidekin/lib/supabase.ts`):

- `createBrowserClient()` — uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `createServerClient()` — uses anon key, **dynamically imports** `next/headers` inside the function body (not at module top-level) to read cookies, attaches cookie set/remove handlers
- `createAdminClient()` — uses `SUPABASE_SERVICE_ROLE_KEY`, server-only, no cookie handling, used for migrations and admin operations

Create `lib/database.types.ts` as a stub. After the migration runs in step 1.5, regenerate this file using the Supabase CLI:
```powershell
npx supabase gen types typescript --project-id $env:SUPABASE_PROJECT_ID --schema public > lib/database.types.ts
```
(The project ID is the subdomain of your `NEXT_PUBLIC_SUPABASE_URL`.)

Create `lib/admin-auth.ts` with `getCurrentEditor()` — port from guidekin. This function:
1. Gets the current authenticated user via `createServerClient`
2. Looks up the `editors` table for a row with matching `user_id`
3. Returns `{ user, editor }` or `null`
4. Used in every `/admin/*` layout to redirect non-editors to `/admin/signin`

Create `proxy.ts` at the repo root — port from guidekin. This Next.js middleware function refreshes Supabase auth sessions on non-API routes. Do not create `middleware.ts`.

### 1.4 Create the LumZen brand-voice helper

Create `lib/brand-voice.ts` with:

```typescript
export const LUMZEN_BANNED_WORDS = [
  // exact strings to flag/reject in copy generation
  'users', 'customers',
  'raise your vibration', 'manifest your dream', 'high-vibe',
  'good vibes', 'good vibes only',
  'love & light', 'love and light', 'namaste',
  'divine feminine', 'divine masculine',
  'abundance mindset', // when used as filler
];

export const LUMZEN_VOICE_RULES = `
LumZen voice rules (apply to all generated copy):

ABSOLUTE RULES:
- No exclamation marks, ever.
- No ALL CAPS for emphasis.
- No emoji in body copy. Only ✦ in brand contexts and pillar markers (📖 🎧 ✨ 🔮 🌌 🌙 ☀️ ↑).
- No toxic positivity ("you've got this," "raise your vibes").
- No spiritual jargon without grounding.
- No claims of guaranteed outcomes. Use "may support," "is associated with," "practices that have helped many."
- No gendered framing as default.

VOICE PILLARS (always all four):
- Calm authority: confident without performing expertise.
- Mystical but grounded: cosmic language, never woo-woo.
- Editorial, not promotional: magazine prose, not landing-page hype.
- Quiet warmth: welcoming without being effusive.

BANNED VOCABULARY (replace if encountered):
- "users", "customers" → "community", "seekers", "you"
- "raise your vibration" → "tune your attention", "shift your frequency"
- "manifest your dream" → "align with what you want", "move toward what calls you"
- "high-vibe", "good vibes only", "love & light", "namaste" → drop entirely
- "abundance mindset" (as filler) → "receivership", "openness", or be concrete

HEADLINE STYLE:
Cormorant Garamond serif, often italic. Headlines pose paradox or invitation, not claim.
Good: "The light is already within you." "The cosmos has always been speaking."
Bad: "Manifest your dreams today." "The #1 spiritual app for 2026."

CTA STYLE:
Invitations, not demands. Often end with gold ✦ glyph.
Good: "Begin Your Journey ✦" "Reveal Today's Card ✦"
Bad: "Sign Up Now" "Get Started Free"
`;

export function buildClaudeSystemPrompt(role: 'tarot' | 'natal' | 'affirmation' | 'guide'): string {
  // Returns the appropriate system prompt for each AI role,
  // always prepended with LUMZEN_VOICE_RULES
  ...
}
```

This file is imported by every Claude API endpoint (tarot interpretation, natal interpretation, affirmation generation, guide generation) to ensure consistent voice.

### 1.5 Apply the database schema PROGRAMMATICALLY

This is the key automation step. The user explicitly does not want to run SQL manually. You will:

1. Create the migration file at `supabase/migrations/0001_initial_schema.sql` for version control.
2. Apply the migration immediately using the service-role key via a Node script.
3. Verify the migration succeeded by querying the resulting schema.
4. Regenerate `lib/database.types.ts` from the live schema.

**The migration file `supabase/migrations/0001_initial_schema.sql`** should contain CREATE TABLE statements for:

- `user_profiles` — extends `auth.users` with: id (FK to auth.users), display_name, avatar_url, sun_sign, moon_sign, rising_sign, day_streak (int default 0), last_practice_date, onboarding_completed (bool default false), created_at, updated_at
- `editors` — id, user_id (FK), role ('admin' | 'editor'), created_at
- `articles` — id, slug (unique), title, subtitle, content (text), excerpt, hero_image_url, pillar ('guides' | 'audiobooks' | 'affirmations' | 'sound' | 'celestial'), tags (text[]), status ('draft' | 'scheduled' | 'published'), scheduled_for, published_at, created_at, updated_at, created_by (FK to auth.users)
- `subscribers` — id, email (unique), phone (nullable), email_consent_at, sms_consent_at, ip_address, user_agent, source, unsubscribed_at, created_at
- `landing_pages` — id, slug (unique), title, is_active (bool default true), gtm_id (nullable per-page override), created_at, updated_at
- `tarot_cards` — id (text primary key, e.g. "ar00"), name, type ('major' | 'minor'), suit (nullable), value, meaning_upright, meaning_reversed, description, image_url
- `tarot_readings` — id (uuid), user_id (FK), spread_type, cards (jsonb), question (nullable), ai_interpretation, created_at
- `natal_charts` — id (uuid), user_id (FK, unique), name, birth_date, birth_time (nullable), birth_city, birth_lat, birth_lng, birth_timezone, chart_data (jsonb), chart_svg (text), sun_sign, moon_sign, rising_sign, ai_interpretation (nullable), created_at, updated_at
- `affirmations` — id (uuid), text, category, subcategory (nullable), tags (text[]), chakra (nullable), is_active (bool default true), created_at
- `user_affirmation_sessions` — id (uuid), user_id (FK), affirmation_id (FK), activity_type ('mirror_work' | 'journaling' | 'breathing' | 'repeat_aloud' | 'sequence' | 'challenge'), session_date (date), completed (bool default false), notes (nullable), created_at
- `audio_tracks` — id (uuid), title, category, subcategory (nullable), duration_seconds, source ('freesound' | 'pixabay' | 'generated' | 'uploaded'), source_id (text), stream_url, license, frequency_hz (nullable, for solfeggio), tags (text[]), cover_image_url (nullable), is_active (bool default true), created_at
- `user_audio_history` — id (uuid), user_id (FK), track_id (FK), played_at, duration_played
- `audiobooks` — id (uuid), librivox_id (text unique), title, author, description, cover_image_url, duration_total, language (default 'English'), genre (text[]), rss_url, zip_url (nullable), is_featured (bool default false), created_at
- `audiobook_chapters` — id (uuid), book_id (FK), chapter_number, title, stream_url, duration_seconds
- `user_audiobook_progress` — id (uuid), user_id (FK), book_id (FK), chapter_id (FK, nullable), position_seconds (int default 0), completed (bool default false), updated_at, UNIQUE(user_id, book_id)
- `spiritual_guides` — id (uuid), slug (unique), title, category, description, content (markdown text), cover_image_url (nullable), author, read_time_minutes, difficulty ('beginner' | 'intermediate' | 'advanced'), tags (text[]), related_chakra (nullable), is_featured (bool default false), is_active (bool default true), created_at, updated_at
- `daily_practices` — id (uuid), user_id (FK), practice_date (date), affirmation_done (bool default false), meditation_done (bool default false), journaling_done (bool default false), tarot_done (bool default false), gratitude_done (bool default false), UNIQUE(user_id, practice_date)
- `site_settings` — key (text primary key), value (jsonb), updated_at, updated_by (FK to auth.users nullable)

**Also include:**
- A shared `set_updated_at()` trigger function and apply it to every table that has `updated_at`.
- Indexes on `articles.slug`, `articles.pillar`, `articles.status`, `articles.scheduled_for`, `tarot_readings.user_id`, `natal_charts.user_id`, `daily_practices.user_id`, `daily_practices.practice_date`, `spiritual_guides.slug`, `audio_tracks.category`.
- RLS enabled on every table.
- RLS policies (this is critical for security):
  - `user_profiles`: SELECT/INSERT/UPDATE where `auth.uid() = id`; admin role sees all
  - `editors`: SELECT for the user where `auth.uid() = user_id`; only service role can INSERT
  - `articles`: public can SELECT where `status = 'published'`; editors can do everything via service role
  - `subscribers`: only service role
  - `landing_pages`: public can SELECT where `is_active = true`; editors via service role
  - `tarot_cards`: public can SELECT (it's reference data)
  - `tarot_readings`: SELECT/INSERT where `auth.uid() = user_id`
  - `natal_charts`: SELECT/INSERT/UPDATE where `auth.uid() = user_id`
  - `affirmations`: public can SELECT (reference data)
  - `user_affirmation_sessions`: SELECT/INSERT/UPDATE where `auth.uid() = user_id`
  - `audio_tracks`: public can SELECT
  - `user_audio_history`: SELECT/INSERT where `auth.uid() = user_id`
  - `audiobooks`, `audiobook_chapters`: public can SELECT
  - `user_audiobook_progress`: SELECT/INSERT/UPDATE where `auth.uid() = user_id`
  - `spiritual_guides`: public can SELECT where `is_active = true`
  - `daily_practices`: SELECT/INSERT/UPDATE where `auth.uid() = user_id`
  - `site_settings`: public can SELECT; only service role can UPDATE
- A trigger on `auth.users` INSERT that automatically creates a corresponding `user_profiles` row with the new user's ID.

**Apply the migration programmatically** by writing a Node script at `scripts/apply-migration.mjs`:

```javascript
import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function applyMigrations() {
  const migrationsDir = 'supabase/migrations';
  const files = (await readdir(migrationsDir)).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`Applying ${file}...`);
    const sql = await readFile(join(migrationsDir, file), 'utf-8');

    // Supabase JS client doesn't have a direct SQL-execute method on the public API.
    // Use the postgres REST endpoint via fetch with the service-role key:
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to apply ${file}: ${error}`);
    }
    console.log(`✓ ${file} applied`);
  }
}

applyMigrations().catch(err => {
  console.error(err);
  process.exit(1);
});
```

**There is a catch with the `exec_sql` RPC.** Supabase does not expose a default SQL execution RPC for security reasons. There are three options — use them in this order of preference:

**Option A (preferred): Use the Supabase Management API.** This is the same API the Supabase CLI uses. Requires a `SUPABASE_ACCESS_TOKEN` (different from the service role key — it's a user-level access token from `supabase.com/dashboard/account/tokens`). If the user has this in their `.env.local`, use:

```javascript
const response = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  }
);
```

**Option B: Create a helper SQL function once via the Supabase CLI, then call it.** Use the Supabase CLI to link the project and push migrations:

```powershell
# In the lumzen project directory:
pnpm dlx supabase@latest login
pnpm dlx supabase@latest link --project-ref <project-ref-from-url>
pnpm dlx supabase@latest db push
```

The CLI handles authentication and migration application end-to-end. This is the cleanest path.

**Option C: Use the Supabase REST endpoint with a custom `exec_sql` function.** Create the function once manually (we want to avoid this — option B is better).

**Decision flow:**
1. Check if `SUPABASE_ACCESS_TOKEN` is in `.env.local`. If yes → use Option A.
2. If not, but `pnpm dlx supabase` is available → guide the user to run `supabase login` once (one-time auth in their browser), then use Option B via `supabase db push` from the script. This is the cleanest long-term path.
3. After auth is set up, every future migration is just: drop a new `.sql` file into `supabase/migrations/`, run `pnpm db:push` (script you'll add to package.json).

**Recommended: use Option B.** Add these scripts to package.json:

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "db:link": "supabase link --project-ref $env:SUPABASE_PROJECT_REF",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset",
    "db:types": "supabase gen types typescript --linked > lib/database.types.ts",
    "db:diff": "supabase db diff"
  }
}
```

**Instructions for the first-run:** The user needs to authenticate the Supabase CLI exactly once. Have them run:

```powershell
cd $HOME/lumzen
pnpm dlx supabase@latest login
# (browser opens, user authenticates, returns)
pnpm dlx supabase@latest link --project-ref <project-ref>
```

The `project-ref` is the subdomain in `NEXT_PUBLIC_SUPABASE_URL`. Extract it from `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
                                  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                  this is the project-ref
```

Tell the user this is a one-time setup. After that, you (Claude Code) will run `pnpm db:push` whenever you add migrations, and the user does not click anything in the Supabase dashboard ever again.

After the migration is applied:
- Run `pnpm db:types` to regenerate `lib/database.types.ts`
- Verify by listing tables via the service-role client in a small `scripts/verify-schema.mjs`

### 1.6 Wire up auth pages

Build these auth routes using LumZen styling (read BRAND.md §8 for component patterns):

- `app/auth/signin/page.tsx` — email + password form, link to signup and forgot-password. Header: "Welcome back, traveler ✦" (Cormorant italic). CTA: "Sign In ✦"
- `app/auth/signup/page.tsx` — email + password + name. Header: "Begin your journey ✦". CTA: "Create Account ✦". Below: "By creating an account, you join a free, ad-supported community. No payment, ever."
- `app/auth/forgot-password/page.tsx` — email entry. Header: "Find your way back". CTA: "Send Reset Link"
- `app/auth/reset-password/page.tsx` — new password. Header: "Set your new key"
- `app/auth/callback/route.ts` — Supabase code exchange (port from guidekin)
- `app/admin/signin/page.tsx` — separate admin signin (no signup option). Header: "Editor access". CTA: "Sign In"

All auth pages render against the cosmic background (StarField + NebulaBackground), centered card with `rgba(26,26,53,0.85)` background and gold border per BRAND.md §3 and §8.

### 1.7 Build the stub dashboard

Create `app/dashboard/page.tsx` as a server component:

- Server-side auth check via `createServerClient`. Redirect to `/auth/signin` if not authenticated.
- For Stage 1, render a minimal stub:
  - StarField + NebulaBackground in the background
  - Centered card with: "Welcome to LumZen, {display_name or email} ✦" in Cormorant italic
  - Subtitle: "Your sanctuary is being prepared."
  - The full dashboard build happens in Stage 2 Worktree 1

### 1.8 Build the stub landing page

Create `app/page.tsx` as a server component:

- Full cosmic background (StarField + NebulaBackground + LumGlow orb)
- Centered hero:
  - `✦` glyph in gold, 32px
  - "LumZen" in Cinzel, 24px, gold, letter-spacing 0.1em
  - "Where Light Meets Stillness." in Cormorant Garamond italic, 48px (responsive: 32px on mobile)
  - Single button "Begin Your Journey ✦" linking to `/auth/signup`
  - Below button: "Free forever. No payment. Just practice."
- Full landing page rebuilt in Stage 2 Worktree 2

### 1.9 Set up the cron route stub

Create `app/api/cron/publish-scheduled/route.ts` as a stub guarded by `CRON_SECRET`:

```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // TODO Stage 2: Query articles table for status='scheduled' AND scheduled_for <= now()
  // Update them to status='published', set published_at=now()
  return NextResponse.json({ ok: true, message: 'Stub — implementation in Stage 2' });
}
```

Add `vercel.json` at repo root:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "0 6 * * *"
    }
  ]
}
```

(6 AM UTC, matching guidekin's schedule.)

### 1.10 Commit Stage 1

After everything above is done, run:

```powershell
cd $HOME/lumzen
git add .
git commit -m "stage 1: foundation — Next.js 16 + Supabase + LumZen design system + auth + stub dashboard"
git push -u origin main
```

This triggers the first Vercel deploy. It should succeed because the env vars are already configured.

### 1.11 Verify Stage 1 is green

Run these checks and report results to the user:

```powershell
cd $HOME/lumzen
pnpm install                # should complete without errors
pnpm db:push                # should apply 0001_initial_schema.sql
pnpm db:types               # should regenerate lib/database.types.ts
pnpm build                  # should succeed with zero TypeScript errors
pnpm dev                    # should serve on localhost:3000
```

Then verify manually (or guide the user to verify):

1. Visit `http://localhost:3000` — landing stub renders with stars
2. Visit `http://localhost:3000/dashboard` — redirects to `/auth/signin`
3. Visit `http://localhost:3000/auth/signup` — form renders with LumZen styling
4. Create a test account — should redirect to `/dashboard` and show "Welcome to LumZen, [name] ✦"
5. Sign out and back in — should work
6. Visit Supabase dashboard → Table Editor — confirm all ~20 tables exist
7. Visit Supabase dashboard → Auth → Users — confirm the test user is there
8. Push to GitHub triggers a Vercel deploy — should succeed
9. Visit `https://lumzen.co` (or the preview URL) — landing stub renders in production

If any of these fail, fix the failure before declaring Stage 1 complete.

### Stage 1 doublecheck — report to user

After committing and verifying, post a checklist to the user with each item as ✓ or ✗:

- [ ] Next.js 16.2 + React 19 scaffold complete
- [ ] All v0 design files copied verbatim
- [ ] Webpack used, not Turbopack
- [ ] `proxy.ts` at root, no `middleware.ts`
- [ ] Three Supabase client factories in `lib/supabase.ts`
- [ ] `lib/brand-voice.ts` created with voice rules
- [ ] Migration `0001_initial_schema.sql` applied successfully via `supabase db push`
- [ ] All ~20 tables visible in Supabase Table Editor
- [ ] RLS policies applied (verify by checking a few tables in dashboard)
- [ ] `auth.users` INSERT trigger creates `user_profiles` row automatically
- [ ] `lib/database.types.ts` regenerated from live schema
- [ ] Auth flow works: signup → dashboard, signout, signin
- [ ] Admin signin page exists at `/admin/signin`
- [ ] Cron stub responds to authorized requests
- [ ] `vercel.json` cron schedule applied
- [ ] `pnpm build` succeeds with zero errors
- [ ] `pnpm lint` passes
- [ ] Production deploy at `lumzen.co` works
- [ ] No exclamation marks in any user-facing copy (grep result is clean)
- [ ] No banned vocabulary (grep result is clean)
- [ ] Git log shows one clean Stage 1 commit

When all items are ✓, tell the user: "Stage 1 complete. Ready for Stage 2 worktree setup whenever you are."

---

## Things NOT to do in Stage 1

- Do not build the full dashboard. That's Stage 2 Worktree 1.
- Do not build the public landing page beyond the stub hero. Stage 2 Worktree 2.
- Do not port the admin modules (Articles, Subscribers, Landing Pages). Stage 2 Worktree 2.
- Do not build tarot, natal chart, affirmations, audiobooks, sound, or guides features. Stage 2 Worktree 3.
- Do not seed content data (tarot cards, affirmations, audiobooks, guides). Those are separate migration files added in Stage 2 Worktree 3.
- Do not add ad slots. Stage 2 Worktree 1.
- Do not add the subscribe popup. Stage 2 Worktree 2.

Keep Stage 1 surgical: foundation + design system + schema + auth + stubs. That's it.

---

## Communicating with the user

- After completing each major substep (1.1, 1.2, etc.), give a one-line status update.
- If you hit an error that requires user input (e.g., Supabase CLI auth), pause and explain exactly what they need to do.
- If something in `docs/BRAND.md` or `docs/PLATFORM-RESEARCH.md` is ambiguous, ask before guessing.
- When you finish Stage 1, post the doublecheck checklist with each item marked. Do not declare success unless all are ✓.

---

*LumZen Stage 1 Instructions — give this file to Claude Code at `$HOME/lumzen/CLAUDE.md` or pass it as the first message in your Claude Code session.*
