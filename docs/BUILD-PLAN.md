# LumZen — Multi-Stage Build Plan
## From empty desktop to deployed production site

> **Read once, in full, before starting.** This plan assumes:
> - Option C confirmed: free signup-required platform, ad-monetized, no paid tiers
> - Same accounts as guidekin (new projects inside each)
> - Domain `lumzen.co` registered at Namecheap, DNS delegated to Cloudflare
> - Repo: fresh `lumzen` repo (Option A) — Claude Code reads guidekin files as a reference only, copies what's needed verbatim
> - You can run up to 3 worktrees in parallel
> - Final QA is yours after every stage's internal doublecheck is green

> **Stage gates.** Do not advance to the next stage until the doublecheck at the end of the current stage is fully green. Each stage's doublecheck is small; the final QA checklist (Stage 5) is the big one.

---

## TABLE OF STAGES

- **[Stage 0]** Manual setup — everything you configure by hand before any code runs
- **[Stage 1]** Foundation — single worktree, sequential, sets up the spine
- **[Stage 2]** Parallel build — three worktrees, simultaneous
- **[Stage 3]** Integration — merge worktrees, integration tests
- **[Stage 4]** Polish & launch readiness — copy review, accessibility, performance
- **[Stage 5]** Final QA checklist — your sign-off before going live

---

# STAGE 0 — MANUAL SETUP

**Goal:** Have every external service provisioned, every key generated, every DNS record propagated, the empty repo cloned locally, and the empty `.env.local` populated *before* you ever start Claude Code.

**Estimated time:** 60–90 minutes, mostly waiting on DNS propagation.

**Do these in order. Do not skip.**

---

## 0.1 — Domain DNS (Namecheap → Cloudflare)

1. Log into **Cloudflare** dashboard.
2. **Add Site** → enter `lumzen.co` → choose Free plan → Continue.
3. Cloudflare gives you **two nameservers** (something like `eva.ns.cloudflare.com` and `kirk.ns.cloudflare.com`). Copy both.
4. Log into **Namecheap** → Domain List → `lumzen.co` → Manage.
5. **Nameservers** section → switch from "Namecheap BasicDNS" to "Custom DNS".
6. Paste both Cloudflare nameservers → ✓ Save.
7. Back in **Cloudflare** → click **Done, check nameservers**. Propagation takes 5 min – 24 hours (usually under an hour).
8. While waiting, in Cloudflare → **DNS** tab, prepare these records (don't add yet — Vercel will tell you the exact values in step 0.4):

| Type | Name | Value | Proxy | TTL |
|---|---|---|---|---|
| CNAME | `@` (or `lumzen.co`) | `cname.vercel-dns.com` | DNS only (gray cloud — Vercel needs this) | Auto |
| CNAME | `www` | `cname.vercel-dns.com` | Proxied (orange cloud) | Auto |

9. **SSL/TLS** tab → **Overview** → set encryption mode to **Full (strict)**.
10. **SSL/TLS** → **Edge Certificates** → ensure **Always Use HTTPS** is ON.

✅ **Done when:** Cloudflare dashboard shows `lumzen.co` as "Active" (green).

---

## 0.2 — Supabase Project

1. Log into **Supabase**.
2. **New Project** → Organization (your existing one) → Name: `lumzen` → Database Password: **generate a strong one and store it in your password manager** → Region: closest to your target audience (US-East likely if mainly US users) → **Create**.
3. Wait ~2 minutes for provisioning.
4. Once ready, go to **Project Settings** → **API**:
   - Copy **Project URL** → save as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon / public** key → save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role** key → save as `SUPABASE_SERVICE_ROLE_KEY` (⚠ keep this one secret, never expose client-side)
5. **Authentication** → **Providers** → ensure **Email** is enabled, **Confirm email** is ON for production (you can leave it OFF during development for faster testing).
6. **Authentication** → **URL Configuration** → Site URL: `https://lumzen.co` → Redirect URLs (add all): `http://localhost:3000/**`, `https://lumzen.co/**`, `https://*.vercel.app/**` (for preview deploys).
7. **Storage** → **Create new bucket**: name = `landing-pages`, **Public** = OFF. Set RLS to "Restricted" — only the service role writes; we'll read via signed URLs.
8. **Storage** → **Create new bucket**: name = `images`, **Public** = ON. This holds article hero images and content thumbnails.
9. **Database** → **Replication** → leave defaults.

✅ **Done when:** You have URL + anon key + service_role key saved in a temporary local file, two Storage buckets exist, Email auth provider is enabled.

---

## 0.3 — GitHub Repo

1. Log into **GitHub**.
2. **New Repository** → Name: `lumzen` → **Private** → no README, no .gitignore, no license (Next.js will scaffold these) → **Create**.
3. Copy the SSH or HTTPS clone URL.
4. On your local machine (PowerShell):
   ```powershell
   cd $HOME
   git clone <paste-url-here> lumzen
   cd lumzen
   ```
5. Leave the repo open in this PowerShell window for Stage 1.

✅ **Done when:** Empty `lumzen` repo exists on GitHub and is cloned to `$HOME\lumzen` locally.

---

## 0.4 — Vercel Project

> Do this *after* DNS in 0.1 is showing Active, otherwise the domain bind in step 6 will fail.

1. Log into **Vercel**.
2. **Add New** → **Project** → **Import** your GitHub `lumzen` repo. (You'll need to grant the Vercel GitHub app access if you haven't yet.)
3. **Framework Preset:** Next.js (auto-detected).
4. **Root Directory:** leave as `./`.
5. **Build & Output Settings:** leave defaults.
6. **Environment Variables** section — paste all of these (most values come from later steps; placeholders are fine for now, you'll fill them at the end of Stage 0):
   ```
   NEXT_PUBLIC_SUPABASE_URL=<from 0.2>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from 0.2>
   SUPABASE_SERVICE_ROLE_KEY=<from 0.2>
   RESEND_API_KEY=<from 0.5>
   RESEND_FROM_ADDRESS=LumZen <hello@lumzen.co>
   ANTHROPIC_API_KEY=<from 0.6>
   FREESOUND_API_KEY=<from 0.7>
   CRON_SECRET=<generate a long random string yourself>
   NEXT_PUBLIC_GTM_ID=<from 0.8>
   NEXT_PUBLIC_SITE_URL=https://lumzen.co
   ```
7. **Deploy** — first deploy will likely fail because the repo is still empty. That's fine, we just needed the project to exist.
8. **Project Settings** → **Domains** → Add `lumzen.co` and `www.lumzen.co`. Vercel will give you exact DNS values:
   - `lumzen.co` → A record `76.76.21.21` OR CNAME `cname.vercel-dns.com`
   - `www.lumzen.co` → CNAME `cname.vercel-dns.com`
9. Go back to **Cloudflare** → DNS → add the records Vercel specified. Set proxy to **gray cloud (DNS only)** for the apex `lumzen.co` (Vercel handles its own SSL). `www` can stay orange (proxied) if you want CDN, gray if you want Vercel-only.
10. Wait 1–5 min for Vercel to verify. Both domains should show ✓ Valid Configuration.

✅ **Done when:** Vercel project exists, env vars (placeholders OK for now) are entered, both `lumzen.co` and `www.lumzen.co` show as Valid in the Domains tab.

---

## 0.5 — Resend (Transactional Email)

1. Log into **Resend**.
2. **Domains** → **Add Domain** → enter `lumzen.co` → **Add**.
3. Resend shows you DNS records to add (TXT for SPF, DKIM, optional DMARC, plus MX if you want bounce handling).
4. In **Cloudflare** → DNS → add each record Resend specified, exactly as shown. (Cloudflare auto-strips the apex when you type `_dmarc.lumzen.co` — make sure the final record reads correctly.)
5. Back in Resend → click **Verify DNS Records**. May take 5–30 min for propagation.
6. Once verified, **API Keys** → **Create API Key** → name it `lumzen-prod` → permissions: **Sending access** → restrict to domain `lumzen.co` → **Create**.
7. Copy the API key → save as `RESEND_API_KEY`.

✅ **Done when:** Resend dashboard shows `lumzen.co` as Verified, API key is saved.

---

## 0.6 — Anthropic API Key

1. Log into **console.anthropic.com**.
2. **API Keys** → **Create Key** → name it `lumzen-prod` → **Create**.
3. Copy the key → save as `ANTHROPIC_API_KEY`.
4. Note: this is the same Anthropic account guidekin uses. Set a separate **Workspace** named `lumzen` so usage/billing is trackable per project, and create the key inside that workspace.
5. **Settings** → **Billing** → make sure your usage limits are set sensibly. For LumZen's AI features (tarot interpretation, affirmation generation, natal chart reading), expect <$0.05 per active user per day at scale.

✅ **Done when:** Key is in your `.env` notes, `lumzen` workspace exists in the Anthropic console.

---

## 0.7 — Freesound API Key (for meditation audio)

1. Go to **freesound.org** → create an account (or log in).
2. **freesound.org/apiv2/apply** → fill the form:
   - Name: `LumZen`
   - URL: `https://lumzen.co`
   - Description: "Subscriber-only spiritual practice platform; streams meditation and ambient audio under Creative Commons licenses."
3. You'll receive an API key immediately via email/dashboard → save as `FREESOUND_API_KEY`.
4. **Important:** Freesound's free tier has rate limits (~60 requests/min). The plan will use Supabase to cache stream URLs and metadata so we don't hammer the API on every page load.

✅ **Done when:** Freesound API key is saved.

---

## 0.8 — Google Tag Manager (analytics)

1. Log into **Google Tag Manager** (same Google account as guidekin).
2. **Create Container** → Name: `LumZen` → Target: Web → **Create**.
3. Copy the **GTM container ID** (format `GTM-XXXXXXX`) → save as `NEXT_PUBLIC_GTM_ID`.
4. Inside the container, set up two tags now so they're ready:
   - **GA4 Configuration tag**: create a new GA4 property at **analytics.google.com** named `LumZen`, copy the Measurement ID (`G-XXXXXXXXXX`), paste into the GTM tag. Trigger: All Pages.
   - **Microsoft Clarity tag** (optional, GuideKin uses it): create a project at **clarity.microsoft.com**, get the tracking script, add as Custom HTML tag in GTM, trigger All Pages.
5. **Submit** the container → name the version `Initial setup` → **Publish**.

✅ **Done when:** GTM container is published, container ID is saved.

---

## 0.9 — Local environment — Claude Code prep

1. Verify Claude Code is installed and authenticated:
   ```powershell
   claude --version
   ```
2. Verify git worktree is available:
   ```powershell
   git worktree --help
   ```
3. Create the env file (don't commit it — `.gitignore` will exclude it once the repo is scaffolded):
   ```powershell
   cd $HOME\lumzen
   New-Item -Path .env.local -ItemType File
   ```
4. Open `.env.local` in your editor and paste *all* the values you collected in 0.2 through 0.8:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   RESEND_API_KEY=re_xxx
   RESEND_FROM_ADDRESS=LumZen <hello@lumzen.co>
   ANTHROPIC_API_KEY=sk-ant-xxx
   FREESOUND_API_KEY=xxx
   CRON_SECRET=<long-random-string-you-generate>
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   NEXT_PUBLIC_SITE_URL=https://lumzen.co
   ```
5. Go back to **Vercel** → Project → Settings → Environment Variables and replace any placeholders with the real values you now have. Apply to **Production**, **Preview**, and **Development** environments for the public env vars; **Production + Preview only** for secrets.

✅ **Done when:** `.env.local` exists with every real value, Vercel env vars match it, Claude Code runs `claude --version` successfully.

---

## 0.10 — Drop the LumZen design + brand assets into the new repo

The Claude Code stages need a few files to reference. Put them in `$HOME\lumzen` now so they're in the working tree:

```powershell
cd $HOME\lumzen
New-Item -ItemType Directory -Path docs

# Copy the v0 design export and the brand/context docs into docs/
Copy-Item <path-to-lum-zen-v0-design.zip> .\docs\v0-design.zip
Copy-Item <path-to-BRAND.md> .\docs\BRAND.md
Copy-Item <path-to-LUMZEN-V0-PROMPT.md> .\docs\LUMZEN-V0-PROMPT.md
Copy-Item <path-to-LUMINA-PLATFORM-RESEARCH.md> .\docs\PLATFORM-RESEARCH.md
```

Also helpful for Claude Code: drop in pointers to the guidekin reference files (don't copy them — Claude Code can read them from `$HOME\guidekin` directly):

Create `docs/GUIDEKIN-REFERENCE.md`:
```markdown
# GuideKin reference paths

When porting the 3 admin modules (Articles, Subscribers, Landing Pages) to LumZen,
Claude Code should read these guidekin files at:

- $HOME/guidekin/CLAUDE.md  — operational source of truth for guidekin
- $HOME/guidekin/PROJECT_CONTEXT.md  — strategic source of truth
- $HOME/guidekin/lib/supabase.ts  — three Supabase client factories
- $HOME/guidekin/lib/admin-auth.ts  — getCurrentEditor() pattern
- $HOME/guidekin/proxy.ts  — auth session refresh (NOT middleware.ts)
- $HOME/guidekin/app/admin/articles/  — articles admin module
- $HOME/guidekin/app/api/admin/articles/  — articles API
- $HOME/guidekin/app/api/subscribe/route.ts  — subscriber capture
- $HOME/guidekin/app/admin/subscribers/  — subscribers admin
- $HOME/guidekin/components/subscribe-popup.tsx  — popup component
- $HOME/guidekin/lib/popup-context.tsx  — popup provider
- $HOME/guidekin/emails/welcome-email.tsx  — Resend welcome email
- $HOME/guidekin/app/lp/[slug]/route.ts  — landing page handler
- $HOME/guidekin/app/admin/landing-pages/  — landing pages admin
- $HOME/guidekin/app/api/admin/landing-pages/  — landing pages API
- $HOME/guidekin/vercel.json  — cron schedule

CRITICAL: Adapt patterns to LumZen's schema and brand voice. Do NOT copy guidekin's
editorial brand voice, pillar names, color palette, or copy. Use LumZen's BRAND.md.
```

Stage gate doublecheck for Stage 0:

- [ ] Cloudflare shows `lumzen.co` Active, SSL Full Strict, Always Use HTTPS ON
- [ ] Supabase project `lumzen` exists with both Storage buckets (`landing-pages` private, `images` public)
- [ ] GitHub repo `lumzen` is cloned to `$HOME\lumzen`, currently empty
- [ ] Vercel project linked to repo, both `lumzen.co` and `www.lumzen.co` Valid
- [ ] Resend domain `lumzen.co` Verified
- [ ] Anthropic API key created in `lumzen` workspace
- [ ] Freesound API key obtained
- [ ] GTM container published with GA4 + (optional) Clarity tags
- [ ] `$HOME\lumzen\.env.local` contains all real values
- [ ] Vercel env vars match `.env.local` (Production + Preview + Development as appropriate)
- [ ] `$HOME\lumzen\docs\` contains BRAND.md, LUMZEN-V0-PROMPT.md, PLATFORM-RESEARCH.md, v0-design.zip, GUIDEKIN-REFERENCE.md
- [ ] Claude Code runs locally

When this is green, you're ready for Stage 1.

---

# STAGE 1 — FOUNDATION (single worktree, sequential)

**Goal:** Working Next.js 16 + Supabase + Tailwind v4 + LumZen design system + auth wired. After Stage 1 completes, you can `npm run dev`, visit `localhost:3000`, see a styled splash page with the cosmic background, sign up as a test user, and reach an empty (but auth-gated) dashboard route.

**Why single worktree, sequential:** Everything in Stage 1 has tight ordering dependencies. Schema must exist before queries; queries must exist before components; auth must exist before the dashboard can be gated. Parallel here would create more merge pain than it saves time.

**Estimated time:** 1 Claude Code session, ~1.5–2 hours.

### Stage 1 prompt to give to Claude Code

```
Read $HOME/lumzen/docs/BRAND.md and $HOME/lumzen/docs/GUIDEKIN-REFERENCE.md
in full before doing anything else.

Then build the LumZen foundation in $HOME/lumzen:

1. Scaffold a Next.js 16.2 + React 19 + TypeScript + Tailwind v4 project.
   - Use webpack, NOT Turbopack (script: "next dev --webpack")
   - Match the exact dependency set in $HOME/guidekin/package.json for the
     overlapping packages (@supabase/supabase-js, @supabase/ssr, sharp,
     papaparse, jszip, resend, @react-email/components, @anthropic-ai/sdk,
     lucide-react). Plus: @vercel/analytics, swisseph-wasm (or moshier-ephemeris-js
     as fallback) for natal charts.
   - Use pnpm (the v0 export uses pnpm).

2. Set up the lib/ folder MIRRORING guidekin's pattern:
   - lib/supabase.ts: three client factories (browser, server, admin) with
     next/headers dynamic-imported. Read $HOME/guidekin/lib/supabase.ts and adapt.
   - lib/admin-auth.ts: getCurrentEditor() gatekeeper. Read
     $HOME/guidekin/lib/admin-auth.ts and adapt.
   - lib/brand-voice.ts: NEW for LumZen — encodes the voice rules from BRAND.md §2
     (no exclamation marks, banned vocabulary, preferred vocabulary, system prompt
     for Claude API calls).
   - lib/database.types.ts: stub for now, will be regenerated by Supabase CLI
     after schema is applied.

3. Place proxy.ts at repo root (NOT middleware.ts) using guidekin's pattern for
   Supabase session refresh on non-API routes.

4. Apply the LumZen design system from BRAND.md:
   - app/globals.css: copy from docs/v0-design.zip's app/globals.css
   - app/layout.tsx: copy from docs/v0-design.zip's app/layout.tsx (the four-font
     setup — Cormorant Garamond, Cinzel, Jost, JetBrains Mono — and the theme
     metadata)
   - components/mystical-icons.tsx: copy verbatim from docs/v0-design.zip
   - components/ui/: copy the shadcn/ui components from docs/v0-design.zip

5. Create the Supabase schema as a single migration file at
   supabase/migrations/0001_initial_schema.sql containing:
   - users table extension (profile fields: display_name, sun_sign, moon_sign,
     rising_sign, subscription_status='active' default, day_streak, last_practice_date)
   - editors table (id, user_id FK, role) for admin gating
   - articles, article_chapters tables (port shape from guidekin)
   - subscribers table (port from guidekin — TCPA-compliant: email, phone,
     email_consent_at, sms_consent_at, ip_address, user_agent)
   - landing_pages table
   - tarot_cards (seed with full 78-card Rider-Waite deck), tarot_readings
   - natal_charts (user_id unique, birth_date, birth_time, birth_lat, birth_lng,
     birth_timezone, chart_data jsonb, sun_sign, moon_sign, rising_sign)
   - affirmations, user_affirmation_sessions
   - audio_tracks, user_audio_history
   - audiobooks, audiobook_chapters, user_audiobook_progress
   - spiritual_guides
   - daily_practices (one row per user per date, with bool flags)
   - site_settings (key/value, port from guidekin)
   - All tables: created_at, updated_at with shared set_updated_at() trigger
   - RLS policies: users see only their own data; admin role sees all
   Output the migration file but DO NOT apply it — I will run it through Supabase
   dashboard SQL editor manually so I can inspect.

6. Wire up Supabase Auth:
   - app/auth/signup/page.tsx — public signup (email + password, no admin flag)
   - app/auth/signin/page.tsx — public signin
   - app/auth/callback/route.ts — Supabase code exchange (port from guidekin)
   - app/admin/signin/page.tsx — admin signin (separate route from public)
   - app/admin/forgot-password/page.tsx, reset-password/page.tsx — port from guidekin
   - Apply LumZen brand voice to all auth copy (gold ✦ glyph, no exclamation marks,
     Cormorant headings, Cinzel labels)

7. Create the empty dashboard shell at app/dashboard/page.tsx:
   - Server-side auth check; redirect to /auth/signin if not logged in
   - For now, render just: "Welcome to LumZen, {name} ✦" in Cormorant italic
   - The full dashboard build will happen in Stage 2

8. Create a public landing page stub at app/page.tsx:
   - Hero with brand glyph + "LumZen — Where Light Meets Stillness."
   - Single "Begin Your Journey ✦" CTA linking to /auth/signup
   - Use the StarField + NebulaBackground components from the v0 design
   - This is a temporary stub — full landing page is built in Stage 2

9. Apply vercel.json with the daily 6 AM UTC cron at /api/cron/publish-scheduled
   (route stub for now, port full implementation from guidekin in Stage 2)

10. Apply .gitignore: standard Next.js + .env.local + .next + node_modules +
    /supabase/.temp

11. Commit everything in one initial commit:
    git add .
    git commit -m "stage 1: foundation — Next.js 16 + Supabase + LumZen design system + auth"

12. Verify: pnpm install, pnpm dev, manually open localhost:3000.
    Report back which steps succeeded and any errors.

CRITICAL gotchas to respect (from BRAND.md and guidekin's CLAUDE.md):
- Use webpack, NOT Turbopack
- Use proxy.ts, NOT middleware.ts
- next/headers must be dynamically imported in lib/supabase.ts
- After creating new API routes, delete .next/ before retesting
- No exclamation marks anywhere in copy
- No banned vocabulary from BRAND.md §2.3
- Three Supabase client factories: browser, server, admin
- Direct @supabase/supabase-js queries — NO ORM, NO Drizzle
- Dev environment is Windows / PowerShell — use Remove-Item, New-Item syntax in
  any shell commands you suggest

After step 11, stop and wait for me to apply the migration and verify Stage 1 is
green before moving to Stage 2.
```

### Stage 1 doublecheck (before Stage 2)

- [ ] `pnpm dev` runs without errors
- [ ] `localhost:3000` shows the brand stub landing page with stars + nebula visible
- [ ] Fonts (Cormorant, Cinzel, Jost, JetBrains Mono) render correctly — inspect any text
- [ ] Background is `#06060f`, not pure black
- [ ] Cosmetic check: gold `✦` glyph appears in the brand mark, color `#c4a35a`
- [ ] `/auth/signup` form renders with LumZen styling
- [ ] You can create a test account
- [ ] `/dashboard` redirects to `/auth/signin` when logged out
- [ ] `/dashboard` shows the welcome stub when logged in
- [ ] Supabase migration applied without errors (run via SQL editor)
- [ ] Two Storage buckets still exist and are configured correctly
- [ ] Git log shows one clean initial commit
- [ ] No `middleware.ts` file (only `proxy.ts`)
- [ ] No exclamation marks anywhere in the code you can grep
- [ ] `pnpm build` succeeds

If everything is green, commit & push to GitHub, then start Stage 2.

---

# STAGE 2 — PARALLEL BUILD (3 worktrees, simultaneous)

**Goal:** Build the three large content areas in parallel, then merge them.

**Why parallel:** These three areas have minimal cross-dependencies. The dashboard shell doesn't need the admin module to exist; the public site doesn't need the dashboard's audio player. Stage 1 already gave them shared foundations (auth, schema, design system, lib/), so they can diverge cleanly.

**Estimated time per worktree:** 1.5–3 hours. Total wall-clock with 3 parallel: 2–4 hours.

## Setting up the worktrees

From `$HOME\lumzen` after Stage 1 is committed and pushed:

```powershell
# Make sure main is up to date
git checkout main
git pull

# Create three worktrees as sibling directories
git worktree add ../lumzen-w1-dashboard -b feature/dashboard
git worktree add ../lumzen-w2-public-admin -b feature/public-admin
git worktree add ../lumzen-w3-features -b feature/features

# Verify
git worktree list
```

You now have three parallel working directories. Each has its own `.git` reference but shares the same repository.

**Critical: copy `.env.local` to each worktree** (it's gitignored, so it doesn't carry):
```powershell
Copy-Item .\.env.local ..\lumzen-w1-dashboard\.env.local
Copy-Item .\.env.local ..\lumzen-w2-public-admin\.env.local
Copy-Item .\.env.local ..\lumzen-w3-features\.env.local
```

Run `pnpm install` once in each worktree.

Open three terminals, one per worktree. Run Claude Code in each.

---

## Worktree 1 — DASHBOARD SHELL & ADS

**Branch:** `feature/dashboard`
**Path:** `$HOME\lumzen-w1-dashboard`

### Prompt for Claude Code, Worktree 1

```
Read $HOME/lumzen/docs/BRAND.md and unzip $HOME/lumzen/docs/v0-design.zip
to inspect the reference design (especially app/page.tsx, the dashboard layout).

Build the LumZen authenticated dashboard in this worktree:

1. Recreate the v0 dashboard at app/dashboard/page.tsx with these components:
   - Sidebar (collapsed 68px, expanded 220px on hover, navItems from BRAND.md §10.7)
   - Mobile bottom nav (768px breakpoint)
   - Sticky Header with time-based greeting from BRAND.md §2.6 (Good morning/afternoon/evening/Rest well, with LumZen-voice subtitle)
   - TodaysPracticeCard with gradient background, ✦ glyph eyebrow, Cormorant headline,
     progress ring, three quick-start pills
   - StarField (150 stars, three tiers) + NebulaBackground + LumGlow orb as in v0
   - Persistent AudioPlayer bar at bottom

2. The dashboard pulls real user data:
   - User profile from auth.users + the user_profiles table
   - day_streak from the daily_practices table (count of consecutive days)
   - Sun/Moon/Rising signs from natal_charts table if exists

3. Add an ad slot system since this is ad-monetized:
   - components/ad-slot.tsx — a generic placeholder component that renders a
     neutral, brand-appropriate "Ad" placeholder (gold-bordered rectangle, Cinzel
     "✦ SPONSORED ✦" label) until real ad code is wired
   - Insert ad slots in three places: (a) between the TodaysPracticeCard and the first
     content row, (b) midway through the dashboard between content rows, (c) bottom
     of the dashboard above the audio player
   - Use Tailwind size variants: leaderboard (728x90), in-feed (300x250), sticky
     footer (320x50 mobile only)
   - Comment in the code: "// TODO: wire to ad provider when contracted"

4. Content category rows (the 5 horizontal scroll rows from BRAND.md §10.2):
   - Each row reads from its corresponding Supabase table (spiritual_guides,
     audiobooks, affirmations, audio_tracks, celestial_tools)
   - For Stage 2 worktree 1, the queries are real but the tables may be empty —
     show an empty state ("The wisdom is waiting. Begin with what calls to you.")
     when no rows exist
   - Use the ContentCard pattern from BRAND.md §8.2
   - Use the pillar accent colors strictly per BRAND.md §3.3

5. SolfeggioSection — copy from v0 design, all 9 frequencies with their tagline colors

6. Build the Solfeggio tone generator (Web Audio API) at lib/audio/solfeggio.ts
   following the spec in $HOME/lumzen/docs/PLATFORM-RESEARCH.md §3.b. When a user
   clicks a frequency card, play the tone client-side; the AudioPlayer bar reflects
   the active frequency.

7. Build the CelestialToolsSection (Daily Tarot pull + Natal Chart) — but ONLY the
   UI scaffolding. The actual tarot draw and natal chart generation belong to
   worktree 3. For now, the buttons can be wired to /api/tarot/daily and
   /api/natal/generate as placeholders that return 501 Not Implemented.

8. Page motion: staggered fadeUp animation per BRAND.md §7.2.

9. Apply all gotchas from BRAND.md §12 implementation checklist.

10. Commit:
    git add .
    git commit -m "stage 2/w1: dashboard shell + ads + solfeggio + cosmic background"
    git push -u origin feature/dashboard

Wait for instructions before merging.
```

### Worktree 1 doublecheck
- [ ] Dashboard renders at `/dashboard` for logged-in users
- [ ] Sidebar expands on hover, all 8 nav items present, collapses on mobile
- [ ] Greeting matches time of day with correct subtitle
- [ ] All 9 Solfeggio frequencies play actual tones in browser
- [ ] Audio player updates when frequency is clicked
- [ ] Three ad slot placeholders are visible
- [ ] Star field, nebula, lum-orb all animate
- [ ] No exclamation marks, no banned vocab

---

## Worktree 2 — PUBLIC SITE + ADMIN MODULES

**Branch:** `feature/public-admin`
**Path:** `$HOME\lumzen-w2-public-admin`

### Prompt for Claude Code, Worktree 2

```
Read $HOME/lumzen/docs/BRAND.md, $HOME/lumzen/docs/GUIDEKIN-REFERENCE.md, and
$HOME/guidekin/CLAUDE.md in full. The admin modules in this worktree port code
from guidekin to LumZen.

Build two parallel things in this worktree:

PART A — PUBLIC MARKETING SITE (app/page.tsx and supporting pages)

1. Build the public landing page at app/page.tsx with sections per the v0 prompt
   and BRAND.md §10:
   - Hero ("Where Light Meets Stillness.", Cormorant Garamond 48px, ✦ glyph)
   - Trust bar (500+ Guided Meditations · 78-Card Tarot System · etc.)
   - "What is LumZen" section
   - Five Pillars cards (one per pillar with its accent color)
   - How It Works (4 steps from BRAND.md §10 / v0 prompt)
   - Testimonials (4, hardcoded for now)
   - The "Why Subscribe" section — rewrite the original pricing section as a
     "Free Forever, Ad-Supported" section. Single big card explaining: free
     account, no payment, ad-supported, all five pillars included, cancel anytime.
   - Final CTA → /auth/signup
   - Footer with the 4 columns from BRAND.md §10

2. Build supporting public pages:
   - app/about/page.tsx — "Our Purpose"
   - app/privacy/page.tsx — privacy policy (placeholder copy you can flag for
     legal review)
   - app/terms/page.tsx — terms of service (placeholder)
   - app/contact/page.tsx — simple contact form posting to /api/contact
   - app/subscribe/page.tsx — email-only subscribe page (for newsletter list,
     port from guidekin and rewrite copy)

3. Build the subscribe popup:
   - components/subscribe-popup.tsx and lib/popup-context.tsx
   - Port from $HOME/guidekin/components/subscribe-popup.tsx and
     $HOME/guidekin/lib/popup-context.tsx exactly
   - Apply LumZen styling per BRAND.md
   - Exclude paths: /admin/*, /auth/*, /api/*, /subscribe, /dashboard

4. Build the subscribe API:
   - app/api/subscribe/route.ts — port from $HOME/guidekin/app/api/subscribe/route.ts
   - Same TCPA fields (email_consent_at, sms_consent_at, ip, ua)
   - Send welcome email via Resend
   - emails/welcome-email.tsx — port from $HOME/guidekin/emails/welcome-email.tsx,
     rewrite with LumZen voice (gold ✦, Cormorant headline, no exclamation marks)

PART B — ADMIN MODULES (the 3 from guidekin)

5. Admin auth (port from guidekin):
   - app/admin/layout.tsx — admin chrome with editor gate (call getCurrentEditor(),
     redirect to /admin/signin if null)
   - app/admin/page.tsx — admin dashboard with stats (subscriber count, article
     count, landing page count). Apply LumZen styling.

6. Articles admin module (port from $HOME/guidekin/app/admin/articles/ and
   $HOME/guidekin/app/api/admin/articles/):
   - app/admin/articles/page.tsx — list view
   - app/admin/articles/new/page.tsx — new article form
   - app/admin/articles/[id]/page.tsx — edit form with article-editor.tsx
   - app/admin/articles/import/page.tsx — CSV bulk import
   - app/api/admin/articles/route.ts — CRUD
   - app/api/admin/articles/[id]/route.ts — single article
   - app/api/admin/articles/draft/route.ts — AI draft via Anthropic API
   - app/api/admin/articles/images/upload/route.ts — image upload to images bucket
   - app/api/admin/articles/import/route.ts — CSV import with papaparse
   - components/article-image.tsx — port the MANDATORY image component
   - The schema differs from guidekin: LumZen articles belong to one of the 5
     pillars (Spiritual Guides | Audiobooks | Affirmations | Meditation & Sound
     | Celestial Tools), not 6 editorial pillars. Adjust the pillar enum.
   - app/api/cron/publish-scheduled/route.ts — port from guidekin, protected by
     CRON_SECRET

7. Subscribers admin module (port from $HOME/guidekin/app/admin/subscribers/):
   - app/admin/subscribers/page.tsx — table view with email, phone, consent
     timestamps, source, signup_date
   - Add a CSV export button
   - LumZen styling throughout

8. Landing pages admin module (port from $HOME/guidekin/app/admin/landing-pages/
   and $HOME/guidekin/app/api/admin/landing-pages/, plus $HOME/guidekin/app/lp/[slug]/):
   - app/lp/[slug]/route.ts — raw HTML serve with GTM injection and asset path
     rewriting (port the regex rewriter exactly, keep the documented limitation
     comment)
   - app/admin/landing-pages/page.tsx — list
   - app/admin/landing-pages/[slug]/page.tsx — file manager per slug
   - app/api/admin/landing-pages/init/route.ts — create new slug
   - app/api/admin/landing-pages/[slug]/upload/route.ts — zip + single file upload
   - app/api/admin/landing-pages/[slug]/files/route.ts — list & signed URLs
   - Uses jszip and the landing-pages Storage bucket

9. Site settings admin (port from $HOME/guidekin/app/admin/site-images/):
   - app/admin/site-settings/page.tsx — key/value editor
   - app/api/admin/site-settings/route.ts — writer

10. Commit:
    git add .
    git commit -m "stage 2/w2: public landing + footer + admin (articles, subscribers, landing-pages)"
    git push -u origin feature/public-admin

CRITICAL gotchas:
- All article images render through components/article-image.tsx (never raw <img>)
- All admin pages call getCurrentEditor() at the top
- After creating new API routes, advise clearing .next/ before testing
- Apply LumZen brand voice (no exclamation marks, no banned vocab) to ALL copy
  — do NOT copy guidekin's editorial voice verbatim, only the code patterns
- Free tier model: there is no "subscribe and pay" — only "create free account"
```

### Worktree 2 doublecheck
- [ ] Public landing renders correctly with all 5 pillars
- [ ] CTA flows to `/auth/signup`
- [ ] Subscribe popup appears after 5 sec on public pages, doesn't appear on `/admin/*`, `/dashboard`, `/auth/*`
- [ ] Welcome email actually sends through Resend (test with a real email address)
- [ ] `/admin` requires editor account; logged-out users redirect to admin signin
- [ ] Articles CRUD works
- [ ] CSV import successfully imports a test CSV
- [ ] Subscribers list shows test subscribers from the public form
- [ ] Landing pages: upload a test zip, visit `/lp/test`, see the raw HTML with GTM injected
- [ ] `app/lp/[slug]/route.ts` rewrites asset paths correctly
- [ ] All admin pages use LumZen styling, not guidekin's sage/amber

---

## Worktree 3 — CELESTIAL TOOLS + CONTENT FEATURES

**Branch:** `feature/features`
**Path:** `$HOME\lumzen-w3-features`

### Prompt for Claude Code, Worktree 3

```
Read $HOME/lumzen/docs/BRAND.md and $HOME/lumzen/docs/PLATFORM-RESEARCH.md
in full.

Build the LumZen content features in this worktree:

1. TAROT (full implementation):
   - lib/tarot/client.ts — wraps tarotapi.dev (no auth, free)
   - Seed migration supabase/migrations/0002_seed_tarot.sql — fetch all 78
     Rider-Waite cards from tarotapi.dev and INSERT into tarot_cards table.
     Output the SQL but don't apply it — I'll run manually.
   - app/api/tarot/daily/route.ts — daily card pull (seeded per user per day
     so a user gets the same card if they refresh)
   - app/api/tarot/spread/route.ts — multi-card spreads (3-card, Celtic Cross,
     Yes/No, Love, Career)
   - app/api/tarot/interpret/route.ts — calls Claude API for AI interpretation
     using the system prompt from BRAND.md voice rules; never makes deterministic
     predictions
   - app/(dashboard)/tarot/page.tsx — full tarot interface: daily pull, choose
     spread, see history
   - app/(dashboard)/tarot/reading/[id]/page.tsx — single past reading view
   - components/tarot-card.tsx — face-down + face-up card with the v0 flip
     animation; uses Rider-Waite public domain images

2. NATAL CHART (fully free, no paid API):
   - Use the swisseph-wasm package (Swiss Ephemeris compiled to WebAssembly).
     If swisseph-wasm has issues, fall back to moshier-ephemeris-js (pure JS,
     no WASM). Test both, pick the one that builds clean on Vercel.
   - lib/astrology/ephemeris.ts — wrapper around the ephemeris library; exposes
     getPlanetaryPositions(birthDate, birthTime, lat, lng, timezone)
   - lib/astrology/houses.ts — calculate Placidus house cusps
   - lib/astrology/aspects.ts — calculate aspects between planets
   - lib/astrology/geocoding.ts — OpenStreetMap Nominatim wrapper (free, no key,
     User-Agent: "LumZen/1.0")
   - components/natal-wheel.tsx — SVG zodiac wheel using D3 (or pure SVG) — render
     planet positions, house cusps, aspect lines. Use LumZen gold for accents,
     violet for cusps, mist for aspect lines.
   - app/api/natal/generate/route.ts — POST with birth data, calculate full chart,
     upsert into natal_charts table, return chart data + SVG
   - app/api/natal/interpret/route.ts — Claude API call for personalized
     interpretation (Sun/Moon/Rising emphasis, with caveats — no deterministic
     predictions)
   - app/(dashboard)/natal/page.tsx — natal chart form for new users, full chart
     display for users who already have one, regenerate button
   - Note: timezone resolution from lat/lng can use the free
     'timezone-from-lat-long' or 'tz-lookup' npm package (no API key needed)

3. AFFIRMATIONS:
   - lib/affirmations/seed.ts — seed 200+ affirmations across the categories
     (abundance, love, health, identity, manifestation, morning, sleep,
     shadow_work, chakra_root, chakra_sacral, chakra_solar, chakra_heart,
     chakra_throat, chakra_third_eye, chakra_crown). Generate the seed data
     yourself using BRAND.md's voice rules.
   - Migration supabase/migrations/0003_seed_affirmations.sql — INSERT statements
   - app/(dashboard)/affirmations/page.tsx — choose category, start a session
   - Build the 5 activity types from BRAND.md / earlier docs:
     - Mirror Work (camera-based, full-screen affirmation card)
     - 21-Day Identity Shift (challenge tracker)
     - Morning Abundance Flow (5-min guided sequence)
     - Chakra Sequence (7 affirmations, one per chakra, with corresponding
       Solfeggio frequency playing)
     - Breathe & Affirm (synchronized breathing + affirmation reveal)
   - app/api/affirmations/generate/route.ts — Claude API call for personalized
     I AM affirmations (input: user goal/intention/category, output: 5 affirmations)

4. AUDIOBOOKS:
   - lib/audiobooks/librivox.ts — wraps the LibriVox API (free, no auth)
   - Migration supabase/migrations/0004_seed_audiobooks.sql — INSERT statements
     for the 10 curated spiritual titles from PLATFORM-RESEARCH.md §4.a
   - app/api/audiobooks/[id]/chapters/route.ts — fetch chapter stream URLs from
     LibriVox RSS feed
   - app/(dashboard)/audiobooks/page.tsx — library view
   - app/(dashboard)/audiobooks/[id]/page.tsx — book detail + chapter player
   - Track progress in user_audiobook_progress (resume from last position)

5. MEDITATION & SOUND:
   - lib/audio/freesound.ts — wraps Freesound API (uses FREESOUND_API_KEY,
     CC-licensed tracks only)
   - Migration supabase/migrations/0005_seed_audio.sql — pre-curated tracks
     across categories: Healing Frequencies, Tibetan Bowls, Nature & Earth,
     Deep Space, Breathwork, Sleep & Delta, Chakra, Chanting & Mantra
   - app/(dashboard)/sound/page.tsx — sound temple browse view
   - Track listening history in user_audio_history

6. SPIRITUAL GUIDES:
   - Migration supabase/migrations/0006_seed_guides.sql — seed initial guide
     articles in spiritual_guides table for these topics (write full markdown
     content using LumZen voice from BRAND.md): The Seven Chakras, Shadow Work
     Foundations, Moon Phase Rituals, Sacred Geometry 101, The Akashic Records,
     Crystal Basics, Breathwork Foundations, Numerology Primer, Sun/Moon/Rising
     Explained, Dream Journaling
   - app/(dashboard)/guides/page.tsx — library view
   - app/(dashboard)/guides/[slug]/page.tsx — single guide reader

7. DAILY PRACTICES tracking:
   - lib/practices/tracker.ts — server function to mark a practice complete
     (tarot, affirmation, meditation, journaling, gratitude)
   - app/api/practices/complete/route.ts — POST endpoint called when a user
     finishes any activity; upserts a daily_practices row
   - Streak calculation: consecutive days with at least one practice completed

8. Commit:
   git add .
   git commit -m "stage 2/w3: tarot + natal chart + affirmations + audiobooks + sound + guides + practice tracking"
   git push -u origin feature/features

CRITICAL gotchas:
- Natal chart MUST use a free library (swisseph-wasm or moshier-ephemeris-js) —
  no RapidAPI Astrologer, no paid services
- Tarot card images: use Rider-Waite 1909 public domain images — host them in
  the Supabase images bucket or reference the sacred-texts.com URLs
- All Claude API calls use the LumZen voice prompt from lib/brand-voice.ts
- AI must never make deterministic predictions (no "you will meet someone in
  June") — always probabilistic, always empowering, always references agency
- Seed migrations OUTPUT the SQL but do NOT apply automatically — I will run
  them manually
- All audio streams from external URLs (LibriVox, Freesound previews) —
  Supabase only stores metadata
```

### Worktree 3 doublecheck
- [ ] Tarot daily pull returns same card on refresh same day
- [ ] Tarot interpretation reads like a wise reader, not generic AI
- [ ] Natal chart accepts birth data, calculates positions correctly (cross-check 1–2 famous birth charts — e.g., Carl Jung 1875-07-26 19:32 Kesswil, Switzerland)
- [ ] Natal chart SVG renders all 10 planets in correct positions
- [ ] Natal chart interpretation calls out Sun/Moon/Rising specifically
- [ ] Affirmations: at least one category works end-to-end (e.g., morning abundance flow plays for 5 min)
- [ ] Mirror work activates the camera
- [ ] 21-day challenge tracker persists across sessions
- [ ] Audiobook: open The Prophet, click chapter 1, audio streams from LibriVox
- [ ] Audiobook resume: close mid-chapter, reopen, resumes from same position
- [ ] Solfeggio frequencies play (this is from worktree 1, but worktree 3 may add chakra sequence integration)
- [ ] Spiritual guides display in clean Cormorant + Jost typography
- [ ] Daily practice marks streak correctly

---

# STAGE 3 — INTEGRATION (merge worktrees, integration tests)

**Goal:** Get all three worktrees back into `main` with no conflicts or regressions, then exercise the full system end-to-end.

**Estimated time:** 1 Claude Code session, ~1.5 hours including testing.

## Merge order
Merge in this exact order to minimize conflict surface:

1. **Worktree 2 first** (public + admin) — touches mostly distinct paths, lowest conflict risk
2. **Worktree 1 second** (dashboard shell) — touches the dashboard route which doesn't exist in `main` yet
3. **Worktree 3 last** (features) — adds the routes the dashboard shell links to

### Merge prompt for Claude Code

Run this from `$HOME\lumzen` (the main worktree):

```
We have three feature branches to merge to main, in this order:
  1. feature/public-admin
  2. feature/dashboard
  3. feature/features

For EACH branch in order:

1. git checkout main
2. git pull
3. git merge --no-ff <branch> -m "merge: <branch> into main"
4. If there are conflicts, resolve them and report what was conflicting.
   - For shared files like app/layout.tsx, lib/supabase.ts, etc., prefer the
     more complete version (usually feature/public-admin or feature/dashboard).
   - For package.json conflicts, union the dependencies from both sides.
5. After resolving, run:
   pnpm install
   pnpm typecheck (or pnpm tsc --noEmit if no typecheck script)
   pnpm lint
   pnpm build
6. If build fails, FIX the errors before continuing to the next merge.
7. Commit the merge.

After all three are merged:

8. Run integration smoke tests by booting the app:
   pnpm dev

9. Walk through the full user journey and verify each step works:
   a. Visit / (logged out) — landing page loads, no console errors
   b. Click "Begin Your Journey ✦" → /auth/signup form renders
   c. Sign up with a fresh test email → redirects to /dashboard
   d. Dashboard renders with greeting, all 5 content rows, audio player at bottom
   e. Click "Reveal Today's Card" → tarot card flips, shows a real card
   f. Click "Read Full Interpretation" → AI-generated reading appears (uses
      Anthropic API — verify the call goes through)
   g. Click a Solfeggio frequency → tone plays in browser
   h. Click "Generate My Natal Chart" with test birth data → chart calculates
      and renders SVG wheel
   i. Click an affirmation activity → activity loads
   j. Click an audiobook → chapter list loads, click chapter → audio streams
   k. Visit /admin/signin → admin auth page loads
   l. Sign in as admin (you'll need to mark a user as editor in Supabase) →
      /admin loads with stats
   m. Create an article via admin → it appears in the Spiritual Guides row
      on the dashboard
   n. Upload a test landing page zip → /lp/test serves the HTML
   o. Subscribe popup appears after 5s on / but NOT on /dashboard or /admin

10. Report any failures with the exact step that failed and the console/network
    error you saw.

11. Clean up the worktrees:
    git worktree remove ../lumzen-w1-dashboard
    git worktree remove ../lumzen-w2-public-admin
    git worktree remove ../lumzen-w3-features
    git branch -d feature/dashboard feature/public-admin feature/features
    git push origin --delete feature/dashboard feature/public-admin feature/features

12. Final push:
    git push origin main

Wait for me to confirm Stage 3 is green before Stage 4.
```

### Stage 3 doublecheck
- [ ] `pnpm build` succeeds with zero TypeScript errors
- [ ] All routes from worktrees 1, 2, 3 are accessible
- [ ] Every step of the user journey above completed without error
- [ ] No console errors in browser DevTools on the dashboard
- [ ] No 404s on any dashboard link
- [ ] Subscribe popup behaves correctly (appears on public pages, suppressed on app pages)
- [ ] Welcome email actually delivers
- [ ] Vercel preview deploy from `main` succeeds (push to GitHub triggers it)

---

# STAGE 4 — POLISH & LAUNCH READINESS

**Goal:** Take the working-but-rough product and bring it to production polish. This is the stage where small issues are fixed, copy is tightened, and the site is hardened.

**Estimated time:** 1 Claude Code session, ~2 hours, plus your manual review.

## Areas to address

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation: tab through dashboard, verify focus rings are gold and visible
- Color contrast: confirm `--text-muted #4a4866` is only used for decorative captions (it doesn't pass AA against `#06060f`)
- `prefers-reduced-motion` support: star animation, nebula drift, shimmer sweep should all stop when this is enabled
- Alt text on all images
- Screen reader test: read through a tarot reading with VoiceOver/NVDA

### Performance
- Image optimization: confirm all images route through `next/image`
- Font loading: verify font-display: swap is applied
- Bundle analysis: `pnpm build` and inspect the chunk sizes
- Lighthouse pass on the production build (target: 90+ across all four)

### SEO
- Open Graph image generated (the brand calls for one at `/og-image.png`, 1200×630)
- robots.txt configured — allow indexing on `/` and `/about`, `/privacy`, `/terms`; disallow `/admin`, `/api`, `/dashboard`, `/auth`
- sitemap.xml at `/sitemap.xml`
- Structured data: at minimum, Organization schema on the homepage

### Copy review
- Walk every page, every button, every label. Verify against BRAND.md §10.
- No exclamation marks anywhere (grep `!` in TSX files)
- No banned vocabulary from BRAND.md §2.3 (grep "manifest your", "raise your vibration", "users", "customers", "good vibes", etc.)
- Time-based greeting matches BRAND.md §2.6 exactly

### Security
- RLS policies on every Supabase table — verify a non-admin user can only read/write their own rows
- `SUPABASE_SERVICE_ROLE_KEY` never reaches the client bundle (`pnpm build` then search the .next output)
- `ANTHROPIC_API_KEY` only used in server-side routes
- CSRF: Supabase auth handles this, but verify auth callback validates state
- Rate limit on Claude API endpoints (tarot interpret, affirmation generate, natal interpret) — 5 requests per user per minute

### Empty state polish
- All empty states use BRAND.md §10.9 copy
- All loading states use a consistent spinner or skeleton (Cinzel "Loading…" with a soft pulse)

### Ad slot infrastructure
- Verify the ad slot component is responsive and doesn't break layout
- Add a single env var `NEXT_PUBLIC_ADS_ENABLED=false` for dev so you see the placeholder slots; flip to `true` in production when ads are wired

### Prompt for Claude Code, Stage 4

```
Read BRAND.md §12 (implementation checklist) in full. Then audit the entire
LumZen codebase against it. For each item that fails, fix it. Specifically:

1. Add prefers-reduced-motion overrides in app/globals.css for all infinite
   animations.
2. Audit copy: grep for "!" in .tsx files, grep for banned vocabulary, fix any
   instances.
3. Generate /app/og-image.tsx for dynamic OG image generation (1200x630, dark
   cosmic background, "LumZen — Where Light Meets Stillness", gold ✦ glyph).
4. Create /app/robots.ts and /app/sitemap.ts with appropriate rules.
5. Add Organization JSON-LD structured data to app/layout.tsx metadata.
6. Verify all images route through next/image; convert any raw <img> tags.
7. Add rate limiting to /api/tarot/interpret, /api/affirmations/generate,
   /api/natal/interpret using a simple in-memory token bucket (5 per minute
   per user_id; reset on the minute).
8. Audit Supabase RLS policies by reviewing supabase/migrations/0001 — for
   every table, confirm there is a policy that says auth.uid() = user_id for
   user tables. List any tables missing this.
9. Verify SUPABASE_SERVICE_ROLE_KEY and ANTHROPIC_API_KEY do not appear in
   the client bundle: pnpm build, then grep the .next/static directory.
10. Add NEXT_PUBLIC_ADS_ENABLED env var to the ad-slot component; when false,
    render the gold-bordered placeholder; when true, render an empty div ready
    for ad provider script injection.
11. Update empty states to match BRAND.md §10.9 exactly.
12. Run pnpm build and report any TypeScript or build errors.
13. Run pnpm lint and fix all warnings.
14. Commit: "stage 4: polish — accessibility, SEO, security, copy audit, ads
    config"
    git push
```

### Stage 4 doublecheck
- [ ] All BRAND.md §12 items pass
- [ ] Lighthouse: 90+ Performance, 95+ Accessibility, 95+ Best Practices, 95+ SEO
- [ ] Reduced motion: with the OS setting enabled, no animation runs
- [ ] No console errors on any page
- [ ] grep finds zero `!` characters in .tsx copy strings
- [ ] grep finds zero banned vocabulary terms
- [ ] Service-role key not in `.next/` build output
- [ ] OG image renders when you visit `/og-image`
- [ ] robots.txt and sitemap.xml accessible
- [ ] Vercel production deploy succeeds; visit `https://lumzen.co` and the live site works

---

# STAGE 5 — FINAL QA CHECKLIST

**This is yours.** Run through every item below personally. Mark each pass/fail. Don't trust Claude Code's "all green" — verify with your own eyes.

## Manual setup verification
- [ ] DNS for `lumzen.co` resolves and serves the site over HTTPS
- [ ] `www.lumzen.co` redirects (or serves) correctly
- [ ] Email from `hello@lumzen.co` arrives in your inbox (not spam) when you sign up
- [ ] Welcome email renders correctly (no broken layout, no broken links)
- [ ] GA4 receives a `page_view` event when you visit the site
- [ ] Clarity (if enabled) records your session

## Visual & brand
- [ ] Background is `#06060f` (use color picker — never pure black)
- [ ] Star field visible and animates
- [ ] Nebula gradients visible and drift
- [ ] LumGlow orb visible behind hero
- [ ] All gold accents are `#c4a35a` exactly
- [ ] Cormorant Garamond renders on hero headlines (not a fallback serif)
- [ ] Cinzel renders on section labels in all caps
- [ ] Jost renders on body and buttons
- [ ] JetBrains Mono renders on Hz numbers and time codes
- [ ] `✦` glyph appears in gold next to the LumZen wordmark
- [ ] Mobile breakpoint at 768px works — sidebar collapses to bottom nav
- [ ] All five pillar accent colors appear correctly in their respective rows
- [ ] No exclamation marks visible anywhere
- [ ] No banned vocabulary visible anywhere

## Auth & onboarding
- [ ] Fresh signup with a new email works end-to-end
- [ ] Confirmation email arrives (if Confirm Email is enabled)
- [ ] Sign in works with the new credentials
- [ ] Forgot password flow works (request, email, reset)
- [ ] After signup, lands on `/dashboard`
- [ ] Logout works
- [ ] `/dashboard` (logged out) redirects to `/auth/signin`
- [ ] Cannot access `/admin/*` without editor role

## Dashboard
- [ ] Greeting matches current time of day with correct subtitle
- [ ] Today's date and moon phase display correctly
- [ ] Day streak counter shows the correct number
- [ ] All 5 content rows display
- [ ] Each content row uses the correct pillar accent color
- [ ] Cards have hover lift + gold glow shadow
- [ ] Sibling cards dim when one card in a row is hovered
- [ ] Sidebar expand-on-hover works smoothly
- [ ] Audio player bar fixed at bottom
- [ ] Audio player updates when you click a Solfeggio frequency
- [ ] Three ad placeholders visible (with `NEXT_PUBLIC_ADS_ENABLED=false`)

## Tarot
- [ ] Daily card pull: face-down card flips on click
- [ ] Same card appears all day on refresh (per-user-per-day seeded)
- [ ] AI interpretation reads in LumZen voice, not generic
- [ ] AI interpretation never makes deterministic predictions
- [ ] Three-card spread works (Past/Present/Future)
- [ ] Reading history saves to Supabase
- [ ] Yesterday's card displays

## Natal chart
- [ ] Form accepts birth date, time, city
- [ ] City search autocompletes via OpenStreetMap
- [ ] Chart calculates without error (cross-check Carl Jung's chart or another famous birth)
- [ ] SVG wheel renders with all planets
- [ ] Sun, Moon, Rising pills display in correct colors
- [ ] AI interpretation focuses on Sun/Moon/Rising
- [ ] Regenerate button works
- [ ] Chart persists in `natal_charts` table

## Affirmations
- [ ] Category selection works
- [ ] Morning Abundance Flow plays 5-min sequence
- [ ] Mirror Work activates camera (browser permission prompt appears)
- [ ] 21-Day Challenge tracks day number across sessions
- [ ] Chakra Sequence plays the correct Solfeggio frequency per chakra
- [ ] Breathe & Affirm syncs animation with breath rhythm
- [ ] Personal I AM generator returns 5 affirmations in LumZen voice

## Audiobooks
- [ ] Library shows the 10 seeded titles
- [ ] Click a book → chapter list loads
- [ ] Click a chapter → audio streams (verify in network tab)
- [ ] Close mid-chapter, reopen → resume position works
- [ ] Cover images display

## Meditation & Sound
- [ ] Sound temple shows curated categories
- [ ] Click a track → audio streams from Freesound preview URL
- [ ] All 9 Solfeggio frequencies play correctly when clicked
- [ ] Frequency card glows when active
- [ ] Audio player reflects the active frequency

## Spiritual Guides
- [ ] Library shows the 10 seeded guides
- [ ] Click a guide → renders with clean Cormorant + Jost typography
- [ ] Content reads in LumZen voice, no banned vocabulary

## Admin
- [ ] Admin sign-in works
- [ ] Dashboard shows accurate stats (subscriber count, article count, landing page count)
- [ ] Create new article → appears on the public dashboard's guide row
- [ ] Edit article → changes persist
- [ ] CSV import: prepare a small test CSV with 3 articles, import, verify all 3 appear
- [ ] Subscribers list: shows test subscribers, CSV export works
- [ ] Landing pages: upload a test zip, visit `/lp/test`, see the HTML with GTM injected
- [ ] Site settings key/value editor works

## Email
- [ ] Welcome email sends to a fresh test address
- [ ] Email renders correctly in Gmail, Apple Mail, Outlook
- [ ] Links in email work
- [ ] Unsubscribe link works (if implemented; if not, flag for v1.1)

## SEO & metadata
- [ ] View source on `/` — title, description, OG tags all present
- [ ] OG image renders when you share the URL on Slack/Discord/Twitter
- [ ] robots.txt is correct (disallows `/admin`, `/dashboard`, `/api`, `/auth`)
- [ ] sitemap.xml is accessible and lists public pages

## Security
- [ ] Service-role key not in client bundle (verified via grep on `.next/static`)
- [ ] Anthropic key not in client bundle
- [ ] Admin pages return 403/redirect for non-admin users
- [ ] RLS prevents cross-user data access (test: log in as user A, try to fetch user B's natal chart via API — should fail)
- [ ] Rate limit on AI endpoints works (hit `/api/tarot/interpret` 6 times in a minute — 6th should 429)

## Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] First paint under 2 sec on Fast 3G simulation
- [ ] No layout shift (CLS = 0)

## Accessibility
- [ ] Keyboard tab navigation works on all pages
- [ ] Focus rings visible in gold
- [ ] Screen reader: read a tarot reading aloud, verify it's coherent
- [ ] Reduced motion: animations stop when OS setting is enabled
- [ ] Color contrast: all body text passes WCAG AA (4.5:1) against background

## Cross-browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, including iOS Safari)
- [ ] Edge (latest)

## Cross-device
- [ ] Desktop 1920×1080
- [ ] Laptop 1366×768
- [ ] Tablet (iPad portrait + landscape)
- [ ] Phone (iPhone, Android)

## Final readiness
- [ ] All TODO comments resolved or filed as v1.1 issues
- [ ] All console.log debug statements removed
- [ ] Vercel production deploy succeeds
- [ ] Production env vars verified (no placeholders, no localhost URLs)
- [ ] Custom domain SSL is active and valid
- [ ] You can hand a friend the URL `lumzen.co` and they can sign up and complete a tarot reading without help

---

# READY-TO-USE PROMPTS SUMMARY

For your convenience, here are all the Claude Code prompts in one place. Run them in order from their respective working directories.

| Stage | Where | What |
|---|---|---|
| Stage 1 | `$HOME\lumzen` | Single foundation prompt (see Stage 1 section above) |
| Stage 2 W1 | `$HOME\lumzen-w1-dashboard` | Dashboard shell prompt |
| Stage 2 W2 | `$HOME\lumzen-w2-public-admin` | Public + admin prompt |
| Stage 2 W3 | `$HOME\lumzen-w3-features` | Features prompt |
| Stage 3 | `$HOME\lumzen` | Merge prompt |
| Stage 4 | `$HOME\lumzen` | Polish prompt |
| Stage 5 | (yours) | Manual QA — no Claude Code needed |

---

*LumZen Build Plan — Version 1.0 — May 18, 2026*
*Stages 0–5 · Estimated total time: 1–2 days of focused work + ad hoc fixes*
