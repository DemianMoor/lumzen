-- LumZen — i18n schema additions
-- Adds locale columns to user-facing content tables, splits natal chart
-- interpretations into a child table (one interpretation per locale), and
-- updates uniqueness constraints so the same slug can exist per-locale.
--
-- Idempotent: safe to re-apply via `supabase db push`.

-- ============================================================================
-- COLUMNS
-- ============================================================================

alter table public.articles            add column if not exists locale text not null default 'en';
alter table public.tarot_cards         add column if not exists locale text not null default 'en';
alter table public.tarot_readings      add column if not exists locale text not null default 'en';
alter table public.affirmations        add column if not exists locale text not null default 'en';
alter table public.spiritual_guides    add column if not exists locale text not null default 'en';
alter table public.landing_pages       add column if not exists locale text not null default 'en';
alter table public.subscribers         add column if not exists locale text not null default 'en';

-- Constrain locale to the supported set.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'articles_locale_check') then
    alter table public.articles            add constraint articles_locale_check            check (locale in ('en', 'uk', 'ru'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'tarot_cards_locale_check') then
    alter table public.tarot_cards         add constraint tarot_cards_locale_check         check (locale in ('en', 'uk', 'ru'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'tarot_readings_locale_check') then
    alter table public.tarot_readings      add constraint tarot_readings_locale_check      check (locale in ('en', 'uk', 'ru'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'affirmations_locale_check') then
    alter table public.affirmations        add constraint affirmations_locale_check        check (locale in ('en', 'uk', 'ru'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'spiritual_guides_locale_check') then
    alter table public.spiritual_guides    add constraint spiritual_guides_locale_check    check (locale in ('en', 'uk', 'ru'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'landing_pages_locale_check') then
    alter table public.landing_pages       add constraint landing_pages_locale_check       check (locale in ('en', 'uk', 'ru'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'subscribers_locale_check') then
    alter table public.subscribers         add constraint subscribers_locale_check         check (locale in ('en', 'uk', 'ru'));
  end if;
end $$;

-- ============================================================================
-- UNIQUENESS: same slug allowed per locale
-- ============================================================================

-- articles: drop slug-unique, add (slug, locale) composite unique
do $$ begin
  if exists (select 1 from pg_constraint where conname = 'articles_slug_key') then
    alter table public.articles drop constraint articles_slug_key;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'articles_slug_locale_key') then
    alter table public.articles add constraint articles_slug_locale_key unique (slug, locale);
  end if;
end $$;

-- spiritual_guides: same
do $$ begin
  if exists (select 1 from pg_constraint where conname = 'spiritual_guides_slug_key') then
    alter table public.spiritual_guides drop constraint spiritual_guides_slug_key;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'spiritual_guides_slug_locale_key') then
    alter table public.spiritual_guides add constraint spiritual_guides_slug_locale_key unique (slug, locale);
  end if;
end $$;

-- landing_pages: same
do $$ begin
  if exists (select 1 from pg_constraint where conname = 'landing_pages_slug_key') then
    alter table public.landing_pages drop constraint landing_pages_slug_key;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'landing_pages_slug_locale_key') then
    alter table public.landing_pages add constraint landing_pages_slug_locale_key unique (slug, locale);
  end if;
end $$;

-- tarot_cards: PK becomes (id, locale) so the same card id can exist per locale
do $$ begin
  if exists (select 1 from pg_constraint where conname = 'tarot_cards_pkey') then
    alter table public.tarot_cards drop constraint tarot_cards_pkey;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'tarot_cards_pkey_locale') then
    alter table public.tarot_cards add constraint tarot_cards_pkey_locale primary key (id, locale);
  end if;
end $$;

-- ============================================================================
-- natal_chart_interpretations — one interpretation per (chart, locale)
-- birth data stays in natal_charts (locale-independent).
-- ============================================================================

create table if not exists public.natal_chart_interpretations (
  id uuid primary key default gen_random_uuid(),
  chart_id uuid not null references public.natal_charts(id) on delete cascade,
  locale text not null check (locale in ('en', 'uk', 'ru')),
  ai_interpretation text not null,
  generated_at timestamptz not null default now(),
  unique (chart_id, locale)
);

-- Backfill: move any existing natal_charts.ai_interpretation values into the
-- new table at locale='en'. Skip rows that are null or already migrated.
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'natal_charts'
      and column_name = 'ai_interpretation'
  ) then
    insert into public.natal_chart_interpretations (chart_id, locale, ai_interpretation, generated_at)
    select nc.id, 'en', nc.ai_interpretation, coalesce(nc.updated_at, nc.created_at)
    from public.natal_charts nc
    where nc.ai_interpretation is not null
      and not exists (
        select 1 from public.natal_chart_interpretations nci
        where nci.chart_id = nc.id and nci.locale = 'en'
      );
  end if;
end $$;

-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists articles_locale_idx              on public.articles (locale);
create index if not exists articles_locale_pillar_status_idx on public.articles (locale, pillar, status);
create index if not exists tarot_cards_locale_idx           on public.tarot_cards (locale);
create index if not exists tarot_readings_user_locale_idx   on public.tarot_readings (user_id, locale);
create index if not exists affirmations_locale_active_idx   on public.affirmations (locale, is_active);
create index if not exists spiritual_guides_locale_active_idx on public.spiritual_guides (locale, is_active);
create index if not exists landing_pages_locale_idx         on public.landing_pages (locale);
create index if not exists subscribers_locale_idx           on public.subscribers (locale);
create index if not exists nci_chart_locale_idx             on public.natal_chart_interpretations (chart_id, locale);

-- ============================================================================
-- ROW LEVEL SECURITY for natal_chart_interpretations
-- ============================================================================

alter table public.natal_chart_interpretations enable row level security;

do $$ begin
  drop policy if exists "nci select own"  on public.natal_chart_interpretations;
  drop policy if exists "nci insert own"  on public.natal_chart_interpretations;
  drop policy if exists "nci update own"  on public.natal_chart_interpretations;
  drop policy if exists "nci delete own"  on public.natal_chart_interpretations;
  create policy "nci select own" on public.natal_chart_interpretations
    for select using (
      exists (
        select 1 from public.natal_charts nc
        where nc.id = natal_chart_interpretations.chart_id and nc.user_id = auth.uid()
      )
    );
  create policy "nci insert own" on public.natal_chart_interpretations
    for insert with check (
      exists (
        select 1 from public.natal_charts nc
        where nc.id = natal_chart_interpretations.chart_id and nc.user_id = auth.uid()
      )
    );
  create policy "nci update own" on public.natal_chart_interpretations
    for update using (
      exists (
        select 1 from public.natal_charts nc
        where nc.id = natal_chart_interpretations.chart_id and nc.user_id = auth.uid()
      )
    );
  create policy "nci delete own" on public.natal_chart_interpretations
    for delete using (
      exists (
        select 1 from public.natal_charts nc
        where nc.id = natal_chart_interpretations.chart_id and nc.user_id = auth.uid()
      )
    );
end $$;
