-- LumZen — landing_pages: add internal description, raise bucket cap.
-- Idempotent: safe to re-apply via `supabase db push`.

alter table public.landing_pages
  add column if not exists description text;

-- Match the admin uploader (50 MB per file). Bucket previously capped at 25 MB.
update storage.buckets
   set file_size_limit = 50 * 1024 * 1024
 where id = 'landing-pages';
