# LumZen — Stage 2 Merge Plan (Single Commit)

> Supersedes BUILD-PLAN.md §Stage 3 when the goal is to land all three
> Stage 2 worktrees on `main` as **one** commit (mirroring the Stage 1
> single-commit shape, easy rollback, clean history).
>
> Author: feature/dashboard worktree. This file ships with W1's merge so
> it lives on `main` after integration.

---

## 1. Goal

Land `feature/dashboard`, `feature/public-admin`, and `feature/features`
on `main` as a single commit:

```
stage 2: dashboard + public site + admin + features + seed content
```

One commit means: one revert if anything melts down in production, one
PR for the human to review, and a `git log` that reads the same shape as
Stage 1 (`stage 1: foundation — …`).

## 2. Preconditions (do not start the merge until all are true)

For **each** worktree branch, before you bring it into integration:

- [ ] `pnpm build` green on the branch tip
- [ ] `pnpm lint` green on the branch tip
- [ ] Branch-specific "Done when" checklist from
      `docs/STAGE2-WORKTREES.md` is all ✓
- [ ] No exclamation marks in user-facing copy on the branch:
      ```powershell
      git diff main...HEAD -- '*.tsx' '*.ts' |
        Select-String -Pattern '^\+.*[a-zA-Z ]!' |
        Where-Object { $_ -notmatch '^[+]{3}|!=|!== |!\w|^\+\s*//' }
      ```
      (Empty result = clean. TS negations and code comments are filtered.)
- [ ] No banned vocabulary in additions (grep §2.3 of BRAND.md against
      the same diff)
- [ ] Branch pushed to `origin/feature/<name>`

For **main**:

- [ ] `git fetch --all --prune` is current
- [ ] No uncommitted changes anywhere
- [ ] `lumzen.co` (and the preview URL for `main`) is healthy on Vercel —
      we don't want to ship Stage 2 on top of a broken Stage 1

## 3. Predicted conflict map

Run a dry-run merge per branch into a throwaway scratch branch to
confirm the conflict set. The list below is what the integrator should
*expect*; treat anything else as a surprise that needs investigation
before resolution.

| File / area | W1 | W2 | W3 | Resolution |
|---|---|---|---|---|
| `app/dashboard/page.tsx` | replaces stub with shell + placeholder rows | — | wires real content fetches into rows | **W3 wins for row data**; keep W1's chrome (greeting helper, layout wiring, ad slots). Re-port any W3 fetch calls into W1's component structure if shapes diverge. |
| `app/dashboard/layout.tsx` | created | — | possibly modified | Keep W1 base; merge any W3 additions (e.g. context providers for audio playback). |
| `app/page.tsx` | unchanged stub | replaces with full landing | — | W2 wins. |
| `app/api/cron/publish-scheduled/route.ts` | unchanged stub | replaces stub | — | W2 wins. |
| `supabase/migrations/0002_*.sql` | — | `0002_storage_buckets.sql` | `0002_seed_tarot.sql` (if shipped pre-merge) | **Renumber W3 → 0003+**. See §4. |
| `package.json` deps | adds nothing new | adds `papaparse`, image libs, etc. | adds ephemeris, freesound, librivox libs | Union the `dependencies` and `devDependencies` blocks. Run `pnpm install` once after. |
| `lib/supabase.ts` | unchanged | unchanged | unchanged | Should not conflict. If it does, prefer Stage 1 version + any additive helpers. |
| `lib/audio/solfeggio.ts` | created on W1 | — | imports from W1 | If W3 stubbed it locally before W1 merged, drop W3's stub. |
| `lib/database.types.ts` | unchanged | regenerated after 0002 | regenerated after 0003-0007 | Regenerate **once** post-merge from the live schema (`pnpm db:types`). Do not hand-merge. |
| `proxy.ts` | unchanged | possibly tweaks matcher (admin paths) | — | W2 wins if changed. |
| `components/cosmic-background.tsx`, `components/mystical-icons.tsx`, `components/ui/*` | unchanged | unchanged | unchanged | Should not conflict. |

If a file appears in conflict and is **not** in the table above, stop
and investigate — the worktree spec drift needs to be understood before
choosing a side.

## 4. Migration renumbering

Stage 1 ended at `0001_initial_schema.sql`. Stage 2 adds:

- W2 → `0002_storage_buckets.sql` (images + landing-pages buckets)
- W3 → seed migrations (tarot, affirmations, audiobooks, audio, guides)

**Rule:** before squashing to main, the migration sequence must be a
contiguous, conflict-free integer series.

If W2 ships first, W3's seeds occupy `0003`–`0007`. If W3 was developed
in isolation and used `0002`–`0006`, **renumber W3** by:

```powershell
# inside the integration branch, AFTER merging W2 and W3
git mv supabase/migrations/0002_seed_tarot.sql supabase/migrations/0003_seed_tarot.sql
git mv supabase/migrations/0003_seed_affirmations.sql supabase/migrations/0004_seed_affirmations.sql
# …continue for 0004→0005, 0005→0006, 0006→0007
```

Do **not** edit the SQL inside the files — only the filenames. `pnpm
db:push` is filename-ordered, so renaming is enough.

After renumbering, re-apply migrations from a clean baseline if any of
W3's seeds were already pushed under wrong numbers:

```powershell
# nuclear option — only on the live Supabase project if seeds are wrong:
# pnpm db:reset    # WARNING: drops the schema. Do not run if real users exist.
pnpm db:push      # applies the renamed series in order
```

If real users already exist on the project at merge time, **do not
db:reset**. Instead, drop W3's wrongly-numbered rows via SQL and
re-push the renamed migrations.

## 5. Integration sequence (the actual merge)

We use an integration branch so the merge is reversible at every step
without touching `main` until the squash.

```powershell
# 0. fresh main
git checkout main
git pull --ff-only
git fetch --all --prune

# 1. create the integration branch
git checkout -b integration/stage2

# 2. merge worktree 2 first (largest disjoint surface, lowest conflict risk)
git merge --no-ff origin/feature/public-admin
#    resolve any conflicts per §3, then:
pnpm install
pnpm lint
pnpm build
#    if anything fails, fix on integration/stage2, commit, retry. Don't proceed until green.

# 3. merge worktree 1 (dashboard shell — doesn't conflict with public site)
git merge --no-ff origin/feature/dashboard
#    resolve per §3, repeat install/lint/build gate

# 4. merge worktree 3 (features — the heaviest conflicts; dashboard page,
#    migration numbering, lib/audio import)
git merge --no-ff origin/feature/features
#    resolve per §3, renumber migrations per §4, repeat install/lint/build gate

# 5. regenerate database types from the live schema
pnpm db:push                # apply 0002…0007
pnpm db:types               # regenerate lib/database.types.ts from the live schema
git add supabase/migrations lib/database.types.ts
git commit -m "integration: db migrations + regenerated types"

# 6. integration smoke (see §6 before the squash)
```

Note on order: W2 → W1 → W3 minimizes `app/dashboard/page.tsx`
re-resolutions. The opposite order forces you to re-merge dashboard
rows when W3 lands.

## 6. Pre-squash verification

Before squashing, the integration branch must pass:

**Build / lint**

- [ ] `pnpm install` clean (no peer warnings escalated to errors)
- [ ] `pnpm lint` green
- [ ] `pnpm build` green, zero TS errors

**Voice / brand**

- [ ] No `!` in user-facing copy across the *integration branch* diff
      vs `main`:
      ```powershell
      git diff main...integration/stage2 -- '*.tsx' '*.ts' |
        Select-String '^\+.*[a-zA-Z ]!' |
        Where-Object { $_ -notmatch '^[+]{3}|!=|!==|!\w|^\+\s*//' }
      ```
- [ ] No banned vocabulary (run the §2.3 banned-words grep)
- [ ] No new pure-black `#000000` backgrounds or `#ffffff` text

**Database**

- [ ] `pnpm db:push` ran cleanly against the live Supabase project
- [ ] All Stage 2 tables/buckets visible in Supabase dashboard
- [ ] RLS still ON for every user-scoped table
- [ ] `lib/database.types.ts` regenerated and committed

**Runtime smoke (boot `pnpm dev` and walk through)**

- [ ] `/` — full landing renders, five pillar cards, no console errors
- [ ] Subscribe popup appears after 5s on `/`, suppressed on `/auth/*`,
      `/admin/*`, `/api/*`, `/dashboard`
- [ ] `/auth/signup` → create test account → lands on `/dashboard`
- [ ] `/dashboard` — header greeting, all five content rows, audio
      player visible
- [ ] Each pillar deep-link works (`/celestial`, `/affirmations`,
      `/sound`, `/audiobooks`, `/guides`)
- [ ] Draw daily tarot → real card from `tarot_cards` seed
- [ ] Generate natal chart with test birth data → SVG renders
- [ ] Click a solfeggio frequency → tone plays
- [ ] Mark a practice complete → `daily_practices` row updated
- [ ] `/admin/signin` → seed an editor row → admin dashboard loads
- [ ] Cron auth: `Authorization: Bearer $CRON_SECRET` against
      `/api/cron/publish-scheduled` publishes a scheduled article;
      missing/wrong bearer returns 401

**Vercel preview**

- [ ] Push `integration/stage2` to origin, confirm the Vercel preview
      build succeeds
- [ ] Hit the preview URL and re-run the runtime smoke against
      production-mode

Stop and fix before squashing if any item above fails. A failed
post-squash rollback is more annoying than a delayed merge.

## 7. The single commit

Once integration is green, collapse the merge history into one commit
on `main`:

```powershell
git checkout main
git pull --ff-only

# squash the entire integration branch into the working tree without
# committing — this preserves the integrated content but discards the
# merge graph.
git merge --squash integration/stage2

# review the staged diff one last time
git diff --cached --stat
git status

# commit with the canonical Stage 2 message
git commit -m @'
stage 2: dashboard + public site + admin + features + seed content

Merges three parallel worktrees (feature/dashboard, feature/public-admin,
feature/features) as a single commit.

- Dashboard shell: sidebar, header, today's practice, pillar-accented
  content rows, audio player, ad-slot placeholders, solfeggio tone
  generator.
- Public site: full landing with five pillar sections, about/privacy/
  terms/contact, subscribe popup + TCPA-compliant capture + Resend
  welcome email.
- Admin modules: articles (CRUD + AI draft + CSV import + image upload),
  subscribers (table + CSV export), landing pages (HTML asset serve with
  GTM injection), site settings.
- Features: tarot, natal chart, affirmations, audiobooks, sound temple,
  spiritual guides — all wired to real data.
- Seed content: 78 tarot cards, 200+ affirmations, 10 LibriVox titles,
  ~40 CC audio tracks, 10 spiritual guides.
- DB: 0002 storage buckets + 0003-0007 seed migrations. Regenerated
  database.types.ts.
- Cron: /api/cron/publish-scheduled now publishes scheduled articles.
'@

git push origin main
```

> The HEREDOC syntax above (`@'…'@`) is PowerShell. On bash, use the
> standard `git commit -m "$(cat <<'EOF' … EOF)"` form from the project
> root rules.

## 8. Post-merge cleanup

```powershell
# delete the integration branch locally and on origin
git branch -D integration/stage2
git push origin --delete integration/stage2

# delete each feature branch (worktree must be removed first)
git worktree remove c:\AFF\lumzen\w1-dashboard
git worktree remove c:\AFF\lumzen\w2-public-admin
git worktree remove c:\AFF\lumzen\w3-features
git branch -D feature/dashboard feature/public-admin feature/features
git push origin --delete feature/dashboard feature/public-admin feature/features
```

If Vercel had preview deployments tied to the deleted branches, those
disappear automatically once GitHub removes the refs.

## 9. Rollback

If production breaks after the single commit lands:

```powershell
# 1. revert the merge commit (creates a new commit that undoes Stage 2)
git revert --no-edit HEAD
git push origin main
# Vercel redeploys main — Stage 1 is back in production within minutes.

# 2. if the database is corrupt (rare — Stage 2 migrations are additive),
#    restore from a Supabase point-in-time backup taken just before §7.
#    Take that backup explicitly before running pnpm db:push in §5.
```

If the breakage is isolated to one worktree's surface (e.g. only
features pages 500), prefer a targeted hotfix on `main` over a full
revert.

## 10. Decision log

- **Why one commit, not three?** Stage 1 is one commit; Stage 2 matches
  the shape for symmetry and single-revert. The trade-off — losing the
  per-worktree commit history — is acceptable because every worktree
  branch is preserved on origin until §8 cleanup. If something needs
  forensic review, the branches are still there.
- **Why integration branch instead of merging directly to main?**
  Conflicts on `main` are public to Vercel previews and to any tooling
  that watches `main`. The integration branch keeps the messy work
  isolated; only the clean squash lands on `main`.
- **Why merge order W2 → W1 → W3?** W2 has the largest disjoint surface
  (landing, admin, subscribers — none of which W1 or W3 touch). W1's
  dashboard shell is the canvas W3's feature data paints onto, so W1
  must land before W3 to avoid resolving the dashboard merge twice.
