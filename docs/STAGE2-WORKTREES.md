# LumZen — Stage 2 Worktree Specifications

> **For Claude Code sessions starting fresh in a Stage 2 worktree.**
>
> Pre-flight reads (in order):
> 1. `CLAUDE.md` — Stage 1 build instructions + operating principles. The Stage 1 *implementation* is already done on `main`; what matters from CLAUDE.md is the operating principles (§Operating principles) and the brand/voice/code rules.
> 2. `docs/BRAND.md` — the brand book. Source of truth for color, type, copy, components.
> 3. This file — your worktree's specific scope.
> 4. `docs/PLATFORM-RESEARCH.md` and `docs/BUILD-PLAN.md` — wider context as needed (don't read end-to-end; grep for what you're building).
>
> Pre-flight greps before writing code:
> - Read `lib/supabase.ts`, `lib/admin-auth.ts`, `lib/brand-voice.ts`, `proxy.ts` — they are the patterns you extend.
> - Read `app/auth/signin/page.tsx` for the auth-page styling pattern (cosmic background + centered card).
> - Read `components/cosmic-background.tsx` for `StarField` / `NebulaBackground` / `LumGlowOrb`.
>
> All three worktrees branch from `main` at the commit where Stage 1 was sealed. Stage 1 already shipped: 18-table schema, RLS, the `handle_new_user` trigger, the auth flow (signin/signup/forgot/reset/callback + admin/signin), a stub `/` landing, a stub `/dashboard`, the `/api/cron/publish-scheduled` stub, and `vercel.json` cron.

---

## Common rules for all three worktrees

- **Voice:** no exclamation marks, no ALL CAPS, no emoji in body copy, no banned vocabulary (`docs/BRAND.md` §2.3). Run `grep -RE "[a-zA-Z ]!" --include='*.tsx' --include='*.ts'` on your changes before committing; the only `!` should be TS non-null assertions.
- **Styling:** Tailwind v4 + the LumZen design tokens already in `app/globals.css`. Use `font-serif` (Cormorant), `font-display` (Cinzel uppercase), `font-sans` (Jost), `font-mono` (JetBrains). Cosmic dark `#06060f` background everywhere.
- **Supabase:** always use the helpers in `lib/supabase.ts`. `createSupabaseServerClient` for server components, `createSupabaseBrowserClient` for client, `createSupabaseAdmin` for cron/admin server-only.
- **Admin gating:** every `/admin/*` route uses `getCurrentEditor()` from `lib/admin-auth.ts` and redirects to `/admin/signin` if null.
- **No turbopack for dev.** `pnpm dev` already uses webpack via package.json.
- **PowerShell.** Use PowerShell syntax for any commands you suggest the user run.
- **Commits.** Small, focused. End the Stage 2 worktree with `pnpm build` + `pnpm lint` green, a clean commit message, and a push to `origin/feature/<worktree-branch>`. Don't merge to `main` yourself — the human will merge.

---

## WORKTREE 1 — Dashboard shell & ads

**Branch:** `feature/dashboard`
**Worktree path:** `c:\AFF\lumzen\w1-dashboard`

### Scope

Build the authenticated dashboard from stub to full implementation, plus the foundational ad-slot component and the solfeggio tone generator (W3 reuses it).

### New / replaced files

```
app/dashboard/page.tsx                 REPLACE stub with full layout (server component)
app/dashboard/layout.tsx               NEW — sidebar + header chrome
components/sidebar.tsx                 NEW — collapsible, 68/220px (BRAND.md §6.2)
components/site-header.tsx             NEW — sticky, backdrop-blur, time-based greeting
components/todays-practice-card.tsx    NEW — hero card "Today's Practice", quick-start pills
components/content-card.tsx            NEW — pillar-accented card per §8.2
components/content-row.tsx             NEW — horizontal scroll row with section header §8.1
components/audio-player.tsx            NEW — sticky bottom bar (state can be local for now)
components/ad-slot.tsx                 NEW — gold-bordered placeholder, "✦ SPONSORED ✦" label
lib/audio/solfeggio.ts                 NEW — Web Audio API tone generator, 174–963 Hz
```

### Behavior

- `app/dashboard/page.tsx` is a server component: read `user_profiles` for the logged-in user, build the time-based greeting per `BRAND.md §2.6`, hand off to a client `<DashboardLayout>` that renders the chrome + content rows.
- Content rows for Stage 2 W1 can render placeholder cards (mystical icons + dummy titles) — the real content fetches land in W3. Just structure the row so W3 can swap data sources in.
- Ad slots: read `NEXT_PUBLIC_ADS_ENABLED`. When `"false"` (default), render a gold-bordered placeholder showing `✦ SPONSORED ✦` in Cinzel + a faint "ad slot reserved" caption. When `"true"`, render an empty container with the slot dimensions (real provider plugged in later).
- Three placements per `PLATFORM-RESEARCH.md`: leaderboard between hero and first row (728×90), in-feed mid-dashboard (300×250), sticky footer above audio player (320×50 mobile / hidden desktop).

### Database

None new. Stage 1 already shipped the 18 tables W1 needs.

### Done when

- `pnpm build` green, `pnpm lint` green
- Browser: signin → `/dashboard` shows the full layout (no stub copy left)
- The solfeggio module exports a `playFrequency(hz: number, durationMs: number)` API and `stopAll()` — testable from a browser console
- No exclamation marks, no banned vocab
- One clean commit on `feature/dashboard`, pushed

---

## WORKTREE 2 — Public site & admin modules

**Branch:** `feature/public-admin`
**Worktree path:** `c:\AFF\lumzen\w2-public-admin`

### Scope

Replace the stub landing with the full public site, build the four marketing pages, port the subscribe flow, and build all four admin modules (articles, subscribers, landing-pages, site-settings).

### New / replaced files

```
app/page.tsx                                      REPLACE stub — full landing
app/about/page.tsx                                NEW
app/privacy/page.tsx                              NEW
app/terms/page.tsx                                NEW
app/contact/page.tsx                              NEW + form
app/subscribe/page.tsx                            NEW — full subscribe page
app/api/contact/route.ts                          NEW
app/api/subscribe/route.ts                        NEW — TCPA-compliant capture + Resend welcome
emails/welcome-email.tsx                          NEW — React Email template (LumZen voice)
components/subscribe-popup.tsx                    NEW (5s timer, session-scoped, opt-out via <NoSubscribePopup/>)
lib/popup-context.tsx                             NEW — port from guidekin pattern

app/admin/layout.tsx                              NEW — editor gate + admin chrome
app/admin/page.tsx                                NEW — dashboard (subscriber count, article count, lp count)
app/admin/forgot-password/page.tsx                NEW
app/admin/reset-password/page.tsx                 NEW

app/admin/articles/page.tsx                       NEW — list, search, pillar filter
app/admin/articles/new/page.tsx                   NEW
app/admin/articles/[id]/page.tsx                  NEW
app/admin/articles/[id]/article-editor.tsx        NEW — editor client component
app/admin/articles/import/page.tsx                NEW — CSV bulk import UI
app/api/admin/articles/route.ts                   NEW — GET list, POST create
app/api/admin/articles/[id]/route.ts              NEW — GET, PATCH, DELETE
app/api/admin/articles/draft/route.ts             NEW — Claude API call for AI draft
app/api/admin/articles/images/upload/route.ts     NEW — upload to images bucket
app/api/admin/articles/import/route.ts            NEW — papaparse CSV import
components/article-image.tsx                      NEW — MANDATORY wrapper for article images

app/admin/subscribers/page.tsx                    NEW — table + CSV export

app/lp/[slug]/route.ts                            NEW — raw HTML serve, GTM inject, asset rewrite
app/admin/landing-pages/page.tsx                  NEW — list
app/admin/landing-pages/[slug]/page.tsx           NEW — file manager
app/api/admin/landing-pages/init/route.ts         NEW
app/api/admin/landing-pages/[slug]/upload/route.ts NEW
app/api/admin/landing-pages/[slug]/files/route.ts NEW

app/admin/site-settings/page.tsx                  NEW
app/api/admin/site-settings/route.ts              NEW

app/api/cron/publish-scheduled/route.ts           REPLACE stub — real implementation
```

### Behavior

- Landing page: implement the brand hero per `BRAND.md` + the five pillar cards (gold/rose/mint/mist/glow accents). Use real copy from `BRAND.md §10.1`.
- Subscribe popup: appears after 5s on session start, session-scoped (sessionStorage to avoid showing twice), excludes `/admin/*`, `/auth/*`, `/api/*`, `/subscribe`. `<NoSubscribePopup />` marker component opts a page out.
- Subscribe route: writes to `subscribers` table with `email_consent_at` / `sms_consent_at` / `ip_address` / `user_agent` / `source`. If `email_consent_at` set, send welcome email via Resend. Don't fail the API on email errors — log only.
- Welcome email: React Email template, plain text + HTML, copy in LumZen voice (no `!`).
- Article editor: title + slug + subtitle + pillar select + content (textarea or simple MDX-aware editor, Stage 2 ships textarea; rich editor is post-launch), tags input, status (draft/scheduled/published), scheduled_for picker. AI Draft button calls `/api/admin/articles/draft` which uses `buildClaudeSystemPrompt('guide')` from `lib/brand-voice.ts`.
- Image upload: write to Supabase Storage `images` bucket (public). Return signed URL pattern not needed because public. Create the bucket if missing (idempotent server-side check at first call).
- Landing pages: store raw HTML + assets in Supabase Storage `landing-pages` bucket (private, signed URL for serve). `/app/lp/[slug]/route.ts` proxies HTML through with regex-based asset path rewrite + GTM injection (copy logic from guidekin, document the dynamic-URL limitation).
- Site settings: simple key/value editor; public read is allowed via RLS, writes require service-role (route handler uses `createSupabaseAdmin`).
- Cron: replace the Stage 1 stub. Query `articles` where `status='scheduled'` and `scheduled_for <= now()`, update to `published` with `published_at=now()`.

### Database

- One new migration: `supabase/migrations/0002_storage_buckets.sql` — create `images` (public) and `landing-pages` (private) buckets via Supabase Storage SQL. Apply via `supabase db push` after writing.
- An `editors` row must be inserted manually for whoever wants admin access; the W2 finish-line should print the exact SQL to the user.

### Done when

- `pnpm build` green, `pnpm lint` green
- Browser: `/` renders full landing with the 5 pillars; `/admin/signin` works; signing in as an `editors`-table member reaches `/admin` and all four sub-modules render; non-editors get redirected
- Subscribe popup appears on landing after 5s, hides on subsequent loads within session
- Submitting the popup creates a `subscribers` row and triggers a welcome email via Resend
- Cron: hitting `/api/cron/publish-scheduled` with `Authorization: Bearer $CRON_SECRET` actually publishes scheduled articles
- No exclamation marks, no banned vocab
- One clean commit (or a couple) on `feature/public-admin`, pushed

---

## WORKTREE 3 — Features & seed content

**Branch:** `feature/features`
**Worktree path:** `c:\AFF\lumzen\w3-features`

### Scope

Build the five content pillars (tarot, natal, affirmations, audiobooks, sound, guides) + seed migrations for each + daily practice tracking.

### Pre-work

W3 depends on W1's `lib/audio/solfeggio.ts` (chakra affirmation activity plays the matching frequency). If W1 hasn't merged to `main` yet, branch W3 from W1's tip, or stub the import.

### New files (selected — the full list per pillar is in BUILD-PLAN.md)

```
lib/tarot/client.ts                                tarotapi.dev wrapper
lib/astrology/{ephemeris,houses,aspects,geocoding}.ts
lib/audio/freesound.ts
lib/audiobooks/librivox.ts
lib/practices/tracker.ts                           mark daily_practices complete

app/(dashboard)/tarot/page.tsx                     daily pull, spread chooser, history
app/(dashboard)/tarot/reading/[id]/page.tsx
app/(dashboard)/natal/page.tsx
app/(dashboard)/affirmations/page.tsx
app/(dashboard)/audiobooks/page.tsx
app/(dashboard)/audiobooks/[id]/page.tsx
app/(dashboard)/sound/page.tsx
app/(dashboard)/guides/page.tsx
app/(dashboard)/guides/[slug]/page.tsx

app/api/tarot/{daily,spread,interpret}/route.ts
app/api/natal/{generate,interpret}/route.ts
app/api/affirmations/generate/route.ts
app/api/audiobooks/[id]/chapters/route.ts
app/api/practices/complete/route.ts

components/tarot-card.tsx
components/natal-wheel.tsx
components/{mirror-work,21-day-challenge,morning-abundance-flow,chakra-sequence,breathe-affirm}.tsx
```

### Database — new migrations

```
supabase/migrations/0003_seed_tarot.sql          78 Rider-Waite cards from tarotapi.dev
supabase/migrations/0004_seed_affirmations.sql   200+ affirmations across 15 categories
supabase/migrations/0005_seed_audiobooks.sql     10 curated LibriVox titles
supabase/migrations/0006_seed_audio.sql          ~40 pre-curated CC tracks across 8 categories
supabase/migrations/0007_seed_guides.sql         10 spiritual guides, full markdown content
```

(Numbering picks up after W2's 0002. If W2 hasn't shipped, drop W3's seeds at 0002+ and renumber on merge.)

### Ephemeris

`PLATFORM-RESEARCH.md` recommends `swisseph-wasm`. Try it first. If it doesn't build on Vercel's Linux build, fall back to `moshier-ephemeris-js`. Stage 1 punted on these libs intentionally because `moshier-ephemeris-js` is not on npm — verify the package name with `pnpm view` before adding to package.json.

### Claude API

Test that `ANTHROPIC_API_KEY` works before relying on it. The guidekin notes flagged it as possibly suspended. A quick `node -e "const a = new (require('@anthropic-ai/sdk').default)({apiKey: process.env.ANTHROPIC_API_KEY}); a.messages.create({model:'claude-sonnet-4-6', max_tokens:50, messages:[{role:'user', content:'ping'}]}).then(r => console.log(r.content))"` in the worktree dir will confirm.

Use `buildClaudeSystemPrompt(role)` from `lib/brand-voice.ts` as the system prompt for each interpretation route.

### Done when

- All seed migrations applied to live project (`pnpm db:push`)
- `pnpm build` green, `pnpm lint` green
- Browser: dashboard content rows fetch real data (tarot card of the day, affirmation, sound track, audiobook, guide); each pillar page renders and at least one user-facing action works end-to-end (draw a card, generate a chart, finish a mirror-work session, play a track)
- `daily_practices` row gets updated when any activity completes
- No exclamation marks, no banned vocab
- One coherent commit history on `feature/features`, pushed
