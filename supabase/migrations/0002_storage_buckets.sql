-- LumZen — Stage 2 W2: storage buckets for article images and landing-page bundles.
-- Idempotent: safe to re-apply via `supabase db push`.

-- ============================================================================
-- BUCKETS
-- ============================================================================

-- images: public bucket for article hero images, OG images, future inline media.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  10 * 1024 * 1024,   -- 10 MB cap per asset
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- landing-pages: private bucket for raw HTML + asset bundles served via /lp/[slug].
-- Public reads happen through the storage object public URL (we keep it public so the
-- /lp route can fetch without a signed URL), but writes are service-role only via RLS.
insert into storage.buckets (id, name, public, file_size_limit)
values (
  'landing-pages',
  'landing-pages',
  true,
  25 * 1024 * 1024    -- 25 MB cap per file
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- ============================================================================
-- POLICIES — storage.objects
-- ============================================================================

-- images: anyone can read; only service role can write (no INSERT/UPDATE/DELETE
-- policy for the authenticated/anon roles means they cannot mutate — service
-- role bypasses RLS so admin uploads still work).
do $$ begin
  drop policy if exists "images public read" on storage.objects;
  create policy "images public read"
    on storage.objects for select
    using (bucket_id = 'images');
end $$;

-- landing-pages: anyone can read (the /lp route proxies through, so the URLs
-- are not publicly discoverable in normal use). Writes are service-role only.
do $$ begin
  drop policy if exists "landing_pages public read" on storage.objects;
  create policy "landing_pages public read"
    on storage.objects for select
    using (bucket_id = 'landing-pages');
end $$;

-- ============================================================================
-- landing_pages table — add entry_file for the /lp serve route.
-- ============================================================================

alter table public.landing_pages
  add column if not exists entry_file text not null default 'index.html';
