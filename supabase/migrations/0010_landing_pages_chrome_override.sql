-- LumZen — site-chrome override for landing pages
-- Adds a per-page toggle that swaps the partner's <header>/<footer> for the
-- LumZen site chrome, with an optional auto-revert deadline.
--
-- Lazy enforcement: the public landing-page route checks chrome_revert_at on
-- each request and treats the row as if it had flipped back to chrome_revert_to
-- once the deadline has passed. No cron required.
--
-- Idempotent: safe to re-apply via `supabase db push`.

alter table public.landing_pages
  add column if not exists use_site_chrome boolean not null default false,
  add column if not exists chrome_revert_to boolean,
  add column if not exists chrome_revert_at timestamptz;
