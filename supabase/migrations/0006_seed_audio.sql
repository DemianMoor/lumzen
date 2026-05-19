-- LumZen — Stage 2 / W3 — meditation & sound seed.
-- Solfeggio frequencies are synthesized client-side via Web Audio API; their
-- stream_url uses the lumzen://solfeggio/{hz} sentinel that the player
-- recognizes. Other categories reference public-domain or CC-licensed
-- streams. Verify URLs after applying.

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'audio_tracks_source_unique'
  ) then
    alter table public.audio_tracks
      add constraint audio_tracks_source_unique unique (source, source_id);
  end if;
end $$;

-- Solfeggio (synthesized) -------------------------------------------------
insert into public.audio_tracks (title, category, subcategory, duration_seconds, source, source_id, stream_url, license, frequency_hz, tags, is_active) values
('174 Hz · Foundation', 'solfeggio', 'healing', 600, 'generated', '174', 'lumzen://solfeggio/174', 'public domain', 174, '{grounding,relief}', true),
('285 Hz · Tissue', 'solfeggio', 'healing', 600, 'generated', '285', 'lumzen://solfeggio/285', 'public domain', 285, '{healing,regeneration}', true),
('396 Hz · Root', 'solfeggio', 'chakra', 600, 'generated', '396', 'lumzen://solfeggio/396', 'public domain', 396, '{root,grounding}', true),
('417 Hz · Sacral', 'solfeggio', 'chakra', 600, 'generated', '417', 'lumzen://solfeggio/417', 'public domain', 417, '{sacral,change}', true),
('528 Hz · Heart', 'solfeggio', 'chakra', 600, 'generated', '528', 'lumzen://solfeggio/528', 'public domain', 528, '{solar_plexus,heart}', true),
('639 Hz · Connection', 'solfeggio', 'chakra', 600, 'generated', '639', 'lumzen://solfeggio/639', 'public domain', 639, '{heart,relationship}', true),
('741 Hz · Expression', 'solfeggio', 'chakra', 600, 'generated', '741', 'lumzen://solfeggio/741', 'public domain', 741, '{throat,clarity}', true),
('852 Hz · Insight', 'solfeggio', 'chakra', 600, 'generated', '852', 'lumzen://solfeggio/852', 'public domain', 852, '{third_eye,intuition}', true),
('963 Hz · Stillness', 'solfeggio', 'chakra', 600, 'generated', '963', 'lumzen://solfeggio/963', 'public domain', 963, '{crown,oneness}', true)
on conflict (source, source_id) do nothing;

-- Tibetan singing bowls ---------------------------------------------------
insert into public.audio_tracks (title, category, subcategory, duration_seconds, source, source_id, stream_url, license, tags, is_active) values
('Bowls at dawn', 'tibetan_bowls', null, 540, 'pixabay', 'bowls-dawn', 'https://cdn.pixabay.com/audio/2022/03/15/audio_d52e0eed3f.mp3', 'pixabay license', '{bowls,morning}', true),
('Resonance circle', 'tibetan_bowls', null, 720, 'pixabay', 'resonance-circle', 'https://cdn.pixabay.com/audio/2023/09/10/audio_b9d39b3318.mp3', 'pixabay license', '{bowls,resonance}', true),
('Long bowl meditation', 'tibetan_bowls', null, 1200, 'pixabay', 'long-bowl', 'https://cdn.pixabay.com/audio/2024/02/19/audio_61f7e6e0aa.mp3', 'pixabay license', '{bowls,long}', true)
on conflict (source, source_id) do nothing;

-- Nature & Earth -----------------------------------------------------------
insert into public.audio_tracks (title, category, subcategory, duration_seconds, source, source_id, stream_url, license, tags, is_active) values
('Forest at first light', 'nature', 'forest', 600, 'pixabay', 'forest-dawn', 'https://cdn.pixabay.com/audio/2022/10/30/audio_36f60bb13e.mp3', 'pixabay license', '{birds,morning}', true),
('Slow rainfall', 'nature', 'rain', 900, 'pixabay', 'slow-rain', 'https://cdn.pixabay.com/audio/2022/03/15/audio_2cf08d97ce.mp3', 'pixabay license', '{rain,sleep}', true),
('River over stone', 'nature', 'water', 600, 'pixabay', 'river-stone', 'https://cdn.pixabay.com/audio/2023/05/13/audio_8fd75a05b4.mp3', 'pixabay license', '{river,focus}', true),
('Wind on the plain', 'nature', 'wind', 540, 'pixabay', 'plains-wind', 'https://cdn.pixabay.com/audio/2022/11/22/audio_e4f6e21099.mp3', 'pixabay license', '{wind,solitude}', true),
('Ocean at night', 'nature', 'ocean', 1200, 'pixabay', 'ocean-night', 'https://cdn.pixabay.com/audio/2022/03/24/audio_d0c6ff1bdd.mp3', 'pixabay license', '{ocean,sleep}', true)
on conflict (source, source_id) do nothing;

-- Deep space ---------------------------------------------------------------
insert into public.audio_tracks (title, category, subcategory, duration_seconds, source, source_id, stream_url, license, tags, is_active) values
('Drift', 'deep_space', null, 720, 'pixabay', 'drift', 'https://cdn.pixabay.com/audio/2023/01/02/audio_3a5d63ce16.mp3', 'pixabay license', '{ambient,deep}', true),
('Distant signal', 'deep_space', null, 900, 'pixabay', 'distant-signal', 'https://cdn.pixabay.com/audio/2022/09/28/audio_2b6ab10ae5.mp3', 'pixabay license', '{ambient,space}', true),
('Slow orbit', 'deep_space', null, 1200, 'pixabay', 'slow-orbit', 'https://cdn.pixabay.com/audio/2023/10/14/audio_8f95df02f2.mp3', 'pixabay license', '{ambient,orbit}', true)
on conflict (source, source_id) do nothing;

-- Breathwork --------------------------------------------------------------
insert into public.audio_tracks (title, category, subcategory, duration_seconds, source, source_id, stream_url, license, tags, is_active) values
('Box breath · 4-4-4-4', 'breathwork', 'box', 600, 'generated', 'box-4-4-4-4', 'lumzen://breath/box', 'public domain', '{breath,focus}', true),
('Resonance · 5-5', 'breathwork', 'resonance', 600, 'generated', 'resonance-5-5', 'lumzen://breath/resonance', 'public domain', '{breath,calm}', true),
('Exhale longer · 4-6', 'breathwork', 'parasympathetic', 600, 'generated', 'exhale-4-6', 'lumzen://breath/exhale', 'public domain', '{breath,parasympathetic}', true)
on conflict (source, source_id) do nothing;

-- Sleep & Delta -----------------------------------------------------------
insert into public.audio_tracks (title, category, subcategory, duration_seconds, source, source_id, stream_url, license, frequency_hz, tags, is_active) values
('Delta drift · 2 Hz', 'sleep_delta', 'binaural', 1800, 'generated', 'delta-2', 'lumzen://binaural/2', 'public domain', 2, '{delta,sleep}', true),
('Theta float · 6 Hz', 'sleep_delta', 'binaural', 1800, 'generated', 'theta-6', 'lumzen://binaural/6', 'public domain', 6, '{theta,reverie}', true),
('Pink noise · soft', 'sleep_delta', 'noise', 3600, 'pixabay', 'pink-noise', 'https://cdn.pixabay.com/audio/2022/04/27/audio_ed30bc6ba1.mp3', 'pixabay license', null, '{noise,sleep}', true)
on conflict (source, source_id) do nothing;

-- Chanting & Mantra -------------------------------------------------------
insert into public.audio_tracks (title, category, subcategory, duration_seconds, source, source_id, stream_url, license, tags, is_active) values
('Om — long', 'chanting', 'om', 720, 'pixabay', 'om-long', 'https://cdn.pixabay.com/audio/2022/11/11/audio_8b07f9adac.mp3', 'pixabay license', '{om,mantra}', true),
('Gayatri — slow', 'chanting', 'mantra', 540, 'pixabay', 'gayatri-slow', 'https://cdn.pixabay.com/audio/2023/04/02/audio_1a3edabac9.mp3', 'pixabay license', '{gayatri,mantra}', true),
('So Hum — paced', 'chanting', 'mantra', 600, 'pixabay', 'so-hum', 'https://cdn.pixabay.com/audio/2023/06/19/audio_c1a3c5bf8b.mp3', 'pixabay license', '{so-hum,mantra}', true)
on conflict (source, source_id) do nothing;
