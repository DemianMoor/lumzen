-- LumZen — initial schema (Stage 1)
-- Idempotent: safe to re-apply via `supabase db push`.

-- ----- shared updated_at trigger -----
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- user_profiles: extends auth.users
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  sun_sign text,
  moon_sign text,
  rising_sign text,
  day_streak integer not null default 0,
  last_practice_date date,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- editors: admin gating (lookup by email; user_id auto-filled on first sign-in)
create table if not exists public.editors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  content text,
  excerpt text,
  hero_image_url text,
  pillar text not null check (pillar in ('guides', 'audiobooks', 'affirmations', 'sound', 'celestial')),
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  scheduled_for timestamptz,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- subscribers (TCPA-compliant)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text,
  email_consent_at timestamptz,
  sms_consent_at timestamptz,
  ip_address text,
  user_agent text,
  source text,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- landing_pages
create table if not exists public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  is_active boolean not null default true,
  gtm_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- tarot_cards (reference data, text id like "ar00")
create table if not exists public.tarot_cards (
  id text primary key,
  name text not null,
  type text not null check (type in ('major', 'minor')),
  suit text,
  value integer,
  meaning_upright text,
  meaning_reversed text,
  description text,
  image_url text
);

-- tarot_readings
create table if not exists public.tarot_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spread_type text not null,
  cards jsonb not null,
  question text,
  ai_interpretation text,
  created_at timestamptz not null default now()
);

-- natal_charts (one per user)
create table if not exists public.natal_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  birth_date date not null,
  birth_time time,
  birth_city text,
  birth_lat double precision,
  birth_lng double precision,
  birth_timezone text,
  chart_data jsonb,
  chart_svg text,
  sun_sign text,
  moon_sign text,
  rising_sign text,
  ai_interpretation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- affirmations (reference content)
create table if not exists public.affirmations (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null,
  subcategory text,
  tags text[] not null default '{}',
  chakra text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- user_affirmation_sessions
create table if not exists public.user_affirmation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  affirmation_id uuid not null references public.affirmations(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'mirror_work', 'journaling', 'breathing', 'repeat_aloud', 'sequence', 'challenge'
  )),
  session_date date not null default current_date,
  completed boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

-- audio_tracks (reference content)
create table if not exists public.audio_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  subcategory text,
  duration_seconds integer,
  source text not null check (source in ('freesound', 'pixabay', 'generated', 'uploaded')),
  source_id text,
  stream_url text not null,
  license text,
  frequency_hz integer,
  tags text[] not null default '{}',
  cover_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- user_audio_history
create table if not exists public.user_audio_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id uuid not null references public.audio_tracks(id) on delete cascade,
  played_at timestamptz not null default now(),
  duration_played integer
);

-- audiobooks (reference content)
create table if not exists public.audiobooks (
  id uuid primary key default gen_random_uuid(),
  librivox_id text unique,
  title text not null,
  author text,
  description text,
  cover_image_url text,
  duration_total integer,
  language text not null default 'English',
  genre text[] not null default '{}',
  rss_url text,
  zip_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- audiobook_chapters
create table if not exists public.audiobook_chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.audiobooks(id) on delete cascade,
  chapter_number integer not null,
  title text,
  stream_url text not null,
  duration_seconds integer
);

-- user_audiobook_progress
create table if not exists public.user_audiobook_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.audiobooks(id) on delete cascade,
  chapter_id uuid references public.audiobook_chapters(id) on delete set null,
  position_seconds integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, book_id)
);

-- spiritual_guides
create table if not exists public.spiritual_guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text,
  content text,
  cover_image_url text,
  author text,
  read_time_minutes integer,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  tags text[] not null default '{}',
  related_chakra text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- daily_practices (one row per user per day)
create table if not exists public.daily_practices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_date date not null default current_date,
  affirmation_done boolean not null default false,
  meditation_done boolean not null default false,
  journaling_done boolean not null default false,
  tarot_done boolean not null default false,
  gratitude_done boolean not null default false,
  unique (user_id, practice_date)
);

-- site_settings (key/value)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

-- ============================================================================
-- TRIGGERS (set_updated_at)
-- ============================================================================

do $$ begin
  perform 1 from pg_trigger where tgname = 'set_user_profiles_updated_at';
  if not found then
    create trigger set_user_profiles_updated_at before update on public.user_profiles
      for each row execute function public.set_updated_at();
  end if;

  perform 1 from pg_trigger where tgname = 'set_articles_updated_at';
  if not found then
    create trigger set_articles_updated_at before update on public.articles
      for each row execute function public.set_updated_at();
  end if;

  perform 1 from pg_trigger where tgname = 'set_landing_pages_updated_at';
  if not found then
    create trigger set_landing_pages_updated_at before update on public.landing_pages
      for each row execute function public.set_updated_at();
  end if;

  perform 1 from pg_trigger where tgname = 'set_natal_charts_updated_at';
  if not found then
    create trigger set_natal_charts_updated_at before update on public.natal_charts
      for each row execute function public.set_updated_at();
  end if;

  perform 1 from pg_trigger where tgname = 'set_user_audiobook_progress_updated_at';
  if not found then
    create trigger set_user_audiobook_progress_updated_at before update on public.user_audiobook_progress
      for each row execute function public.set_updated_at();
  end if;

  perform 1 from pg_trigger where tgname = 'set_spiritual_guides_updated_at';
  if not found then
    create trigger set_spiritual_guides_updated_at before update on public.spiritual_guides
      for each row execute function public.set_updated_at();
  end if;

  perform 1 from pg_trigger where tgname = 'set_site_settings_updated_at';
  if not found then
    create trigger set_site_settings_updated_at before update on public.site_settings
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ============================================================================
-- auto-create user_profiles on auth.users INSERT
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

do $$ begin
  perform 1 from pg_trigger where tgname = 'on_auth_user_created';
  if not found then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end $$;

-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists articles_slug_idx on public.articles (slug);
create index if not exists articles_pillar_idx on public.articles (pillar);
create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_scheduled_for_idx on public.articles (scheduled_for);

create index if not exists tarot_readings_user_id_idx on public.tarot_readings (user_id);
create index if not exists natal_charts_user_id_idx on public.natal_charts (user_id);
create index if not exists daily_practices_user_id_idx on public.daily_practices (user_id);
create index if not exists daily_practices_practice_date_idx on public.daily_practices (practice_date);
create index if not exists spiritual_guides_slug_idx on public.spiritual_guides (slug);
create index if not exists audio_tracks_category_idx on public.audio_tracks (category);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.user_profiles               enable row level security;
alter table public.editors                     enable row level security;
alter table public.articles                    enable row level security;
alter table public.subscribers                 enable row level security;
alter table public.landing_pages               enable row level security;
alter table public.tarot_cards                 enable row level security;
alter table public.tarot_readings              enable row level security;
alter table public.natal_charts                enable row level security;
alter table public.affirmations                enable row level security;
alter table public.user_affirmation_sessions   enable row level security;
alter table public.audio_tracks                enable row level security;
alter table public.user_audio_history          enable row level security;
alter table public.audiobooks                  enable row level security;
alter table public.audiobook_chapters          enable row level security;
alter table public.user_audiobook_progress     enable row level security;
alter table public.spiritual_guides            enable row level security;
alter table public.daily_practices             enable row level security;
alter table public.site_settings               enable row level security;

-- helper: drop and re-create policy by name
-- (Postgres has no IF NOT EXISTS for CREATE POLICY before 16.4; we wrap in DO blocks)

do $$ begin
  -- user_profiles
  drop policy if exists "user_profiles select own"  on public.user_profiles;
  drop policy if exists "user_profiles insert own"  on public.user_profiles;
  drop policy if exists "user_profiles update own"  on public.user_profiles;
  create policy "user_profiles select own" on public.user_profiles for select using (auth.uid() = id);
  create policy "user_profiles insert own" on public.user_profiles for insert with check (auth.uid() = id);
  create policy "user_profiles update own" on public.user_profiles for update using (auth.uid() = id);

  -- editors (read own row; writes service-role only)
  drop policy if exists "editors select own" on public.editors;
  create policy "editors select own" on public.editors for select using (auth.uid() = user_id);

  -- articles
  drop policy if exists "articles public select published" on public.articles;
  create policy "articles public select published" on public.articles for select using (status = 'published');

  -- subscribers: service-role only (no policy = no access; service role bypasses RLS)
  -- landing_pages
  drop policy if exists "landing_pages public select active" on public.landing_pages;
  create policy "landing_pages public select active" on public.landing_pages for select using (is_active = true);

  -- tarot_cards (reference)
  drop policy if exists "tarot_cards public select" on public.tarot_cards;
  create policy "tarot_cards public select" on public.tarot_cards for select using (true);

  -- tarot_readings
  drop policy if exists "tarot_readings select own" on public.tarot_readings;
  drop policy if exists "tarot_readings insert own" on public.tarot_readings;
  create policy "tarot_readings select own" on public.tarot_readings for select using (auth.uid() = user_id);
  create policy "tarot_readings insert own" on public.tarot_readings for insert with check (auth.uid() = user_id);

  -- natal_charts
  drop policy if exists "natal_charts select own" on public.natal_charts;
  drop policy if exists "natal_charts insert own" on public.natal_charts;
  drop policy if exists "natal_charts update own" on public.natal_charts;
  create policy "natal_charts select own" on public.natal_charts for select using (auth.uid() = user_id);
  create policy "natal_charts insert own" on public.natal_charts for insert with check (auth.uid() = user_id);
  create policy "natal_charts update own" on public.natal_charts for update using (auth.uid() = user_id);

  -- affirmations (reference)
  drop policy if exists "affirmations public select" on public.affirmations;
  create policy "affirmations public select" on public.affirmations for select using (is_active = true);

  -- user_affirmation_sessions
  drop policy if exists "uas select own" on public.user_affirmation_sessions;
  drop policy if exists "uas insert own" on public.user_affirmation_sessions;
  drop policy if exists "uas update own" on public.user_affirmation_sessions;
  create policy "uas select own" on public.user_affirmation_sessions for select using (auth.uid() = user_id);
  create policy "uas insert own" on public.user_affirmation_sessions for insert with check (auth.uid() = user_id);
  create policy "uas update own" on public.user_affirmation_sessions for update using (auth.uid() = user_id);

  -- audio_tracks (reference)
  drop policy if exists "audio_tracks public select" on public.audio_tracks;
  create policy "audio_tracks public select" on public.audio_tracks for select using (is_active = true);

  -- user_audio_history
  drop policy if exists "uah select own" on public.user_audio_history;
  drop policy if exists "uah insert own" on public.user_audio_history;
  create policy "uah select own" on public.user_audio_history for select using (auth.uid() = user_id);
  create policy "uah insert own" on public.user_audio_history for insert with check (auth.uid() = user_id);

  -- audiobooks (reference)
  drop policy if exists "audiobooks public select" on public.audiobooks;
  create policy "audiobooks public select" on public.audiobooks for select using (true);

  -- audiobook_chapters (reference)
  drop policy if exists "audiobook_chapters public select" on public.audiobook_chapters;
  create policy "audiobook_chapters public select" on public.audiobook_chapters for select using (true);

  -- user_audiobook_progress
  drop policy if exists "uap select own" on public.user_audiobook_progress;
  drop policy if exists "uap insert own" on public.user_audiobook_progress;
  drop policy if exists "uap update own" on public.user_audiobook_progress;
  create policy "uap select own" on public.user_audiobook_progress for select using (auth.uid() = user_id);
  create policy "uap insert own" on public.user_audiobook_progress for insert with check (auth.uid() = user_id);
  create policy "uap update own" on public.user_audiobook_progress for update using (auth.uid() = user_id);

  -- spiritual_guides
  drop policy if exists "spiritual_guides public select active" on public.spiritual_guides;
  create policy "spiritual_guides public select active" on public.spiritual_guides for select using (is_active = true);

  -- daily_practices
  drop policy if exists "daily_practices select own" on public.daily_practices;
  drop policy if exists "daily_practices insert own" on public.daily_practices;
  drop policy if exists "daily_practices update own" on public.daily_practices;
  create policy "daily_practices select own" on public.daily_practices for select using (auth.uid() = user_id);
  create policy "daily_practices insert own" on public.daily_practices for insert with check (auth.uid() = user_id);
  create policy "daily_practices update own" on public.daily_practices for update using (auth.uid() = user_id);

  -- site_settings (public read; service-role writes)
  drop policy if exists "site_settings public select" on public.site_settings;
  create policy "site_settings public select" on public.site_settings for select using (true);
end $$;
