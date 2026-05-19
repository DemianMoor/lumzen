-- LumZen — Stage 2 / W3 — audiobook seed (10 curated LibriVox titles).
-- Chapters are fetched at runtime via the LibriVox public JSON API.
-- librivox_id is the LibriVox project id (visible at /api/feed/audiobooks/?id=...).

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'audiobooks_librivox_id_unique'
  ) then
    alter table public.audiobooks
      add constraint audiobooks_librivox_id_unique unique (librivox_id);
  end if;
end $$;

insert into public.audiobooks (librivox_id, title, author, description, cover_image_url, language, genre, rss_url, is_featured) values
('132', 'As a Man Thinketh', 'James Allen', 'A short, decisive treatise on the inner life. Allen argues that our circumstances begin in the silent work of the mind.', 'https://archive.org/services/img/asaman_thinketh_pdc_librivox', 'English', '{philosophy,self-help}', 'https://librivox.org/rss/132', true),
('1052', 'The Book of Tea', 'Kakuzō Okakura', 'Tea as a window into Eastern aesthetics — wabi, sabi, the philosophy of small ceremony.', 'https://archive.org/services/img/book_of_tea_0809_librivox', 'English', '{philosophy,asian-thought}', 'https://librivox.org/rss/1052', true),
('196', 'The Imitation of Christ', 'Thomas à Kempis', 'A medieval devotional that has guided contemplatives for six centuries. Short chapters, slow reading.', 'https://archive.org/services/img/imitationofchrist_0712_librivox', 'English', '{contemplative,christian-mysticism}', 'https://librivox.org/rss/196', false),
('56', 'Walden', 'Henry David Thoreau', 'Two years and two months at Walden Pond. The book that made simplicity into a philosophy.', 'https://archive.org/services/img/walden_lc_0707_librivox', 'English', '{philosophy,nature}', 'https://librivox.org/rss/56', false),
('564', 'Meditations', 'Marcus Aurelius', 'Private journal of a Roman emperor turned to the Stoic tradition. Written for himself, kept for us.', 'https://archive.org/services/img/meditations_pgcc_librivox', 'English', '{stoic,philosophy}', 'https://librivox.org/rss/564', true),
('48', 'The Tao Teh King', 'Lao Tzu', 'The classic of the way — eighty-one chapters on yielding, paradox, and the patient power of water.', 'https://archive.org/services/img/tao_teh_king_pa_librivox', 'English', '{tao,philosophy}', 'https://librivox.org/rss/48', false),
('1019', 'The Power of Concentration', 'William Walker Atkinson', 'A New Thought primer on attention as a practice. Written in 1918, still useful.', 'https://archive.org/services/img/poc_1004_librivox', 'English', '{new-thought,self-help}', 'https://librivox.org/rss/1019', false),
('113', 'Bhagavad Gita', 'Translated by Edwin Arnold', 'The Song Celestial — Krishna and Arjuna on the battlefield of the inner life.', 'https://archive.org/services/img/bhagavadgita_arnold_librivox', 'English', '{hindu,philosophy}', 'https://librivox.org/rss/113', true),
('3104', 'The Conduct of Life', 'Ralph Waldo Emerson', 'Nine essays from the late Emerson. Fate, power, wealth, culture, behavior, worship, illusions.', 'https://archive.org/services/img/conductlife_pgcc_librivox', 'English', '{philosophy,transcendental}', 'https://librivox.org/rss/3104', false),
('9396', 'The Prophet', 'Kahlil Gibran', 'Twenty-six prose poems on love, marriage, work, joy and sorrow. (Note: PD in many jurisdictions; verify locally.)', 'https://archive.org/services/img/prophet_1102_librivox', 'English', '{poetry,mysticism}', 'https://librivox.org/rss/9396', true)
on conflict (librivox_id) do update set
  title = excluded.title,
  author = excluded.author,
  description = excluded.description,
  cover_image_url = excluded.cover_image_url,
  rss_url = excluded.rss_url,
  is_featured = excluded.is_featured;
