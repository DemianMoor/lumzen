# LUMINA Platform — Developer Research Document
## Public APIs, Libraries & Free Content Sources for Claude Code

> **Purpose:** This document is a complete reference for building the LUMINA spiritual manifestation platform. It covers every product category with free/public APIs, open-source libraries, data sources, implementation notes, and code snippets ready to use with Next.js + Supabase.

---

## TABLE OF CONTENTS

1. [Tarot Cards](#1-tarot-cards)
2. [Natal Charts & Astrology](#2-natal-charts--astrology)
3. [Meditation Sounds & Frequencies](#3-meditation-sounds--frequencies)
4. [Audiobooks](#4-audiobooks)
5. [Affirmations](#5-affirmations)
6. [Spiritual Guides Content](#6-spiritual-guides-content)
7. [AI-Powered Interpretation Layer](#7-ai-powered-interpretation-layer)
8. [Supabase Data Architecture](#8-supabase-data-architecture)
9. [Legal & Licensing Summary](#9-legal--licensing-summary)

---

## 1. TAROT CARDS

### 1a. Primary API — tarotapi.dev (Rider-Waite, Free, No Auth Required)

**Source:** https://tarotapi.dev  
**GitHub:** https://github.com/ekelen/tarot-api  
**Auth:** None required  
**Format:** JSON  
**License:** Open source, free to use

#### Endpoints

```
GET https://tarotapi.dev/api/v1/cards
→ Returns all 78 cards

GET https://tarotapi.dev/api/v1/cards/random?n=3
→ Returns n random cards (use for spreads)

GET https://tarotapi.dev/api/v1/cards/:name_short
→ Single card by short name (e.g. "ar01" = The Magician)
```

#### Sample Response Structure

```json
{
  "cards": [
    {
      "name": "The Fool",
      "name_short": "ar00",
      "value": "0",
      "value_int": 0,
      "meaning_up": "Beginnings, innocence, spontaneity, a free spirit",
      "meaning_rev": "Holding back, recklessness, risk-taking",
      "desc": "With light step, as if earth were not under his feet, the youth in his colorful coat...",
      "type": "major",
      "suit": "major"
    }
  ]
}
```

#### Card Images — Public Domain (Rider-Waite 1909 Deck)

```
Base URL: https://www.sacred-texts.com/tarot/xr/
Image files: ar00.jpg through ar21.jpg (Major Arcana)
             wacu01.jpg (Wands), wape01.jpg (Pentacles), etc.

Alternative CDN: https://raw.githubusercontent.com/ekelen/tarot-api/master/public/images/
```

> **Note:** The Rider-Waite-Smith deck published in 1909 is public domain in the United States. Images can be freely used in commercial projects without attribution.

---

### 1b. Spread Types to Build

| Spread | Cards | Use Case |
|--------|-------|----------|
| Daily Card | 1 | Home screen widget |
| Three-Card | 3 | Past / Present / Future |
| Celtic Cross | 10 | Deep personal reading |
| Yes/No | 1 | Quick guidance |
| Love Spread | 5 | Relationship reading |
| Career Path | 4 | Professional clarity |

#### Implementation Pattern (Next.js)

```typescript
// lib/tarot/client.ts
const TAROT_API_BASE = 'https://tarotapi.dev/api/v1';

export async function getDailyCard() {
  const res = await fetch(`${TAROT_API_BASE}/cards/random?n=1`);
  const data = await res.json();
  return data.cards[0];
}

export async function getSpread(cardCount: number) {
  const res = await fetch(`${TAROT_API_BASE}/cards/random?n=${cardCount}`);
  const data = await res.json();
  return data.cards;
}

export async function getAllCards() {
  const res = await fetch(`${TAROT_API_BASE}/cards`);
  const data = await res.json();
  return data.cards;
}
```

---

### 1c. Supplemental — RoxyAPI (Paid, Production-Grade)

**URL:** https://roxyapi.com/products/tarot-api  
**Cost:** Paid tiers (free trial available)  
**Notable extras:** Celtic Cross, Love Spread, Career Spread, Yes/No Oracle, seeded daily readings, upright + reversed meanings per domain (love/career/health/spiritual), card images included  
**Use when:** You want AI-interpreted readings returned directly from the API without building your own AI layer

---

### 1d. Seed Data to Store in Supabase

Store card data locally in Supabase on first load to avoid repeated API calls and enable:
- User reading history
- Daily card "seeding" (same card per user per day)
- Favorite card saves
- Reading journal entries

```sql
-- Supabase migration
CREATE TABLE tarot_cards (
  id TEXT PRIMARY KEY,           -- e.g. "ar00"
  name TEXT NOT NULL,
  type TEXT NOT NULL,            -- "major" | "minor"
  suit TEXT,                     -- "wands" | "cups" | "swords" | "pentacles" | null
  value TEXT,
  meaning_upright TEXT,
  meaning_reversed TEXT,
  description TEXT,
  image_url TEXT
);

CREATE TABLE tarot_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_type TEXT NOT NULL,
  cards JSONB NOT NULL,          -- array of {card_id, position, reversed}
  question TEXT,
  ai_interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. NATAL CHARTS & ASTROLOGY

### 2a. Primary API — Astrologer API (RapidAPI, Free Tier Available)

**GitHub:** https://github.com/g-battaglia/Astrologer-API  
**Base URL:** `https://astrologer.p.rapidapi.com`  
**Auth:** RapidAPI key (free tier: 100 requests/month)  
**Engine:** Kerykeion (Python) — Swiss Ephemeris precision  
**Returns:** SVG chart + full JSON data  
**Free tier suitable for:** Development + low-volume production

#### Key Endpoints

```
POST /api/v5/chart/birth-chart
→ Returns rendered SVG + natal data

POST /api/v5/chart-data/birth-chart
→ Returns JSON data only (no SVG), faster

POST /api/v5/moon-phase
→ Current or given-date moon phase

POST /api/v5/context/birth-chart
→ AI-optimized XML context string for LLM interpretation
```

#### Birth Chart Request

```typescript
// lib/astrology/client.ts
interface BirthChartRequest {
  subject: {
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    longitude: number;   // decimal degrees, e.g. -74.006 for NYC
    latitude: number;    // decimal degrees, e.g. 40.7128 for NYC
    timezone: string;    // IANA, e.g. "America/New_York"
  };
  theme?: 'dark' | 'light';  // dark returns dark-themed SVG
}

export async function getBirthChart(data: BirthChartRequest) {
  const response = await fetch(
    'https://astrologer.p.rapidapi.com/api/v5/chart/birth-chart',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'astrologer.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
  // Returns: { status, chart: "<svg>...</svg>", chart_data: { planets, houses, aspects } }
}
```

#### Sample Response (chart_data structure)

```json
{
  "status": "OK",
  "chart": "<svg>...</svg>",
  "chart_data": {
    "subject": {
      "sun": { "sign": "Scorpio", "position": 15.4, "house": 5 },
      "moon": { "sign": "Pisces", "position": 22.1, "house": 9 },
      "rising": { "sign": "Leo", "position": 3.7 },
      "mercury": { "sign": "Scorpio", "position": 8.2, "retrograde": false },
      "venus": { "sign": "Libra", "position": 29.0 },
      "mars": { "sign": "Capricorn", "position": 11.5 }
    },
    "houses": [
      { "number": 1, "sign": "Leo", "degree": 3.7 }
    ],
    "aspects": [
      { "p1": "Sun", "p2": "Moon", "aspect": "trine", "orb": 6.7 }
    ]
  }
}
```

---

### 2b. Alternative — AstroChart.js (Pure Frontend SVG, No API Key)

**GitHub:** https://github.com/Kibo/AstroChart  
**URL:** https://astrodraw.github.io  
**License:** Open source  
**Use case:** If you want to render the wheel chart entirely client-side with pre-calculated planet data

```html
<!-- CDN include -->
<script src="https://cdn.jsdelivr.net/npm/astrochart@latest/dist/astrochart.min.js"></script>
```

```javascript
// Render a natal chart SVG client-side
const chart = new astrology.Chart('paper', 800, 800);
chart.radix({
  planets: {
    Sun: [285.0],      // degree position in zodiac
    Moon: [52.0],
    Mercury: [248.0],
    Venus: [270.0],
    Mars: [201.0],
    Jupiter: [45.0],
    Saturn: [318.0],
    Uranus: [200.0],
    Neptune: [300.0],
    Pluto: [218.0],
    Chiron: [50.0],
    Lilith: [8.0],
    NNode: [120.0]
  },
  cusps: [296, 328, 0, 32, 64, 96, 116, 148, 180, 212, 244, 276]
});
```

> **Note:** AstroChart only renders the SVG wheel. You must supply planet degree positions calculated separately (use Astrologer API `/chart-data` endpoint to get positions, then pass to AstroChart for rendering).

---

### 2c. Alternative — Free Astrology API (freeastrologyapi.com)

**URL:** https://freeastrologyapi.com  
**Free tier:** Yes — limited monthly requests  
**Supports:** Western + Vedic natal charts, SVG wheel, house cusps, aspects, synastry  
**Format:** JSON + SVG

---

### 2d. Geocoding for Birth Location Input

Users enter a city name — you need lat/long + timezone. Use:

```typescript
// OpenStreetMap Nominatim — completely free, no API key
async function geocodeCity(cityName: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LUMINA-Platform/1.0' } // required by Nominatim ToS
  });
  const data = await res.json();
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name
  };
}

// Timezone from lat/lng — use timezonefinder (Python) or TimeZoneDB API
// Free tier: https://timezonedb.com/api
async function getTimezone(lat: number, lng: number) {
  const res = await fetch(
    `http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONEDB_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`
  );
  const data = await res.json();
  return data.zoneName; // e.g. "America/New_York"
}
```

---

### 2e. Supabase Schema for Natal Charts

```sql
CREATE TABLE natal_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_city TEXT NOT NULL,
  birth_lat DECIMAL(9,6),
  birth_lng DECIMAL(9,6),
  birth_timezone TEXT,
  chart_svg TEXT,              -- cached SVG string
  chart_data JSONB,            -- full planet/house/aspect data
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. MEDITATION SOUNDS & FREQUENCIES

### 3a. Freesound API (Free, Creative Commons)

**URL:** https://freesound.org  
**Auth:** Free API key (register at freesound.org/apiv2/apply)  
**License:** Creative Commons (CC0, CC-BY, CC-BY-NC per track — check per sound)  
**Content:** 500,000+ sounds including extensive meditation, ambient, nature, bowls, binaural

#### Setup

```bash
# Register at freesound.org to get a free API key
# Store as: FREESOUND_API_KEY in .env.local
```

#### API Usage

```typescript
// lib/audio/freesound.ts
const FREESOUND_BASE = 'https://freesound.org/apiv2';
const API_KEY = process.env.FREESOUND_API_KEY;

// Search for meditation sounds
export async function searchMeditationSounds(query: string, page = 1) {
  const url = `${FREESOUND_BASE}/search/text/?query=${encodeURIComponent(query)}&token=${API_KEY}&filter=license:("Creative Commons 0")&fields=id,name,duration,previews,tags,license&page_size=20&page=${page}`;
  const res = await fetch(url);
  return res.json();
  // previews.preview-hq-mp3 → streamable URL
}

// Good query strings:
// "tibetan singing bowl"
// "432hz meditation"
// "om chanting"
// "nature ambient rain forest"
// "theta binaural"
// "solfeggio 528"
// "chakra meditation"
// "cosmic space ambient"
```

#### Stream a Sound (no download required)

```typescript
// Each sound object contains:
{
  "previews": {
    "preview-hq-mp3": "https://freesound.org/data/previews/123/123456_abc.mp3",
    "preview-lq-mp3": "https://freesound.org/data/previews/123/123456_abc_m.mp3"
  }
}
// Use preview-hq-mp3 as the <audio> src — streams directly, no download needed
```

---

### 3b. Generate Solfeggio Frequencies In-Browser (Web Audio API)

Build a client-side tone generator — zero external dependencies, zero cost, plays directly in browser:

```typescript
// lib/audio/toneGenerator.ts
export const SOLFEGGIO_FREQUENCIES = {
  '174hz': { hz: 174, label: 'Pain Relief', description: 'Foundation & grounding, ease discomfort' },
  '285hz': { hz: 285, label: 'Energy Healing', description: 'Cellular regeneration, recharge energy' },
  '396hz': { hz: 396, label: 'Release Fear', description: 'Dissolve guilt, subconscious blocks' },
  '417hz': { hz: 417, label: 'Facilitate Change', description: 'Break destructive patterns, invite growth' },
  '528hz': { hz: 528, label: 'Love Frequency', description: 'DNA repair, heart-centered healing' },
  '639hz': { hz: 639, label: 'Connection', description: 'Relationships, communication, harmony' },
  '741hz': { hz: 741, label: 'Awaken Intuition', description: 'Throat chakra, truth, creative expression' },
  '852hz': { hz: 852, label: 'Spiritual Order', description: 'Return to spiritual clarity, higher self' },
  '963hz': { hz: 963, label: 'Divine Union', description: 'Pineal activation, oneness, enlightenment' },
  '432hz': { hz: 432, label: 'Miracle Tone', description: 'Universal harmony, nature-aligned tuning' },
};

export class SolfeggioPlayer {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  start(frequency: number, volume = 0.3) {
    this.stop();
    this.context = new AudioContext();
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + 0.5); // fade in

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.oscillator.start();
  }

  stop() {
    if (this.gainNode && this.context) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.5); // fade out
      setTimeout(() => {
        this.oscillator?.stop();
        this.context?.close();
        this.oscillator = null;
        this.gainNode = null;
        this.context = null;
      }, 600);
    }
  }

  // Layer two frequencies for binaural beat effect
  startBinaural(baseHz: number, beatHz: number = 6, volume = 0.25) {
    // Left ear: baseHz, Right ear: baseHz + beatHz
    // Theta waves = 4–8 Hz beat (deep meditation)
    // Alpha waves = 8–14 Hz beat (relaxed awareness)
    // Use stereo panner to split channels
    this.context = new AudioContext();

    const createTone = (freq: number, pan: number) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();
      const panner = this.context!.createStereoPanner();

      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = volume;
      panner.pan.value = pan; // -1 = left, 1 = right

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.context!.destination);
      osc.start();
      return osc;
    };

    createTone(baseHz, -1);       // left ear
    createTone(baseHz + beatHz, 1); // right ear
  }
}
```

---

### 3c. Pixabay Audio API (Free, No Attribution Required)

**URL:** https://pixabay.com/api/docs/  
**Auth:** Free API key (register at pixabay.com)  
**License:** Pixabay License — free for commercial use, no attribution required  
**Content:** Meditation, spiritual, ambient, nature sounds in MP3

```typescript
// Search Pixabay for meditation audio
async function searchPixabayAudio(query: string) {
  const res = await fetch(
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&media_type=music&per_page=20`
  );
  return res.json();
  // Returns: hits[].audio_url → streamable MP3
}
// Useful queries: "meditation", "528hz", "ambient space", "tibetan bowl", "nature relax"
```

---

### 3d. Sound Library Content Plan

Pre-curate the following category playlists using Freesound + Pixabay sources:

| Category | Query Tags | Examples |
|----------|-----------|---------|
| Healing Frequencies | solfeggio, 432hz, 528hz | Tone generators |
| Tibetan Bowls | singing-bowl, tibetan, healing | Bowls, gongs |
| Nature & Earth | rain, forest, ocean, birds | Field recordings |
| Deep Space | cosmic, drone, ambient, space | Synthesized pads |
| Breathwork | breath, rhythm, guided | Rhythmic audio |
| Sleep & Delta | delta, binaural, deep-sleep | Long-form loops |
| Chakra | chakra, energy, root-crown | Frequency stacks |
| Chanting & Mantra | om, mantra, chant, monks | Human voice |

---

### 3e. Supabase Schema for Audio

```sql
CREATE TABLE audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,          -- 'healing_frequencies' | 'tibetan_bowls' | etc.
  subcategory TEXT,
  duration_seconds INTEGER,
  source TEXT NOT NULL,            -- 'freesound' | 'pixabay' | 'generated' | 'uploaded'
  source_id TEXT,                  -- external ID for attribution
  stream_url TEXT,                 -- direct MP3 URL
  license TEXT,
  frequency_hz INTEGER,            -- for solfeggio tones
  tags TEXT[],
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_audio_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES audio_tracks(id),
  played_at TIMESTAMPTZ DEFAULT NOW(),
  duration_played INTEGER          -- seconds actually listened
);
```

---

## 4. AUDIOBOOKS

### 4a. LibriVox API (Free, Public Domain, No Auth)

**URL:** https://librivox.org/api/info  
**Auth:** None required  
**License:** Public Domain — all books free for any use  
**Content:** 20,000+ audiobooks in multiple languages  
**Relevant genres:** Self-improvement, philosophy, religion/spirituality, psychology

#### Endpoints

```
GET https://librivox.org/api/feed/audiobooks/genre/spirituality?format=json&limit=50
GET https://librivox.org/api/feed/audiobooks/genre/self_improvement?format=json
GET https://librivox.org/api/feed/audiobooks/title/^the%20power?format=json
GET https://librivox.org/api/feed/audiobooks/?id=1000&extended=1&format=json
```

#### Sample Response

```json
{
  "books": [
    {
      "id": "1000",
      "title": "The Prophet",
      "description": "The Prophet is a book of 26 prose poetry fables...",
      "language": "English",
      "copyright_year": "1923",
      "num_sections": "26",
      "url_text_source": "https://gutenberg.org/...",
      "url_zip_file": "https://download.librivox.org/prophet_0810_librivox.zip",
      "url_rss": "https://librivox.org/rss/1000",
      "totaltime": "1:02:38",
      "totaltimesecs": "3758",
      "authors": [{ "first_name": "Kahlil", "last_name": "Gibran" }]
    }
  ]
}
```

#### Get Streamable Chapter Files via RSS

```typescript
// lib/audiobooks/librivox.ts
export async function getBookChapters(rssUrl: string) {
  const res = await fetch(rssUrl);
  const text = await res.text();
  // Parse RSS XML to extract individual chapter MP3 URLs
  // Each <enclosure> tag has url= pointing to a streamable chapter MP3
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');
  const items = xml.querySelectorAll('item');
  return Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent,
    url: item.querySelector('enclosure')?.getAttribute('url'),
    duration: item.querySelector('duration')?.textContent,
  }));
}

// Search for spiritual books
export async function searchBooks(query: string) {
  const res = await fetch(
    `https://librivox.org/api/feed/audiobooks/title/${encodeURIComponent(query)}?format=json&limit=20&offset=0`
  );
  return res.json();
}
```

#### Curated Spiritual Books Available on LibriVox

| Title | Author | LibriVox ID |
|-------|--------|-------------|
| The Prophet | Kahlil Gibran | Search by title |
| As a Man Thinketh | James Allen | Search by title |
| The Science of Getting Rich | Wallace D. Wattles | Search by title |
| Think and Grow Rich | Napoleon Hill | Search by title |
| The Kybalion | Three Initiates | Search by title |
| The Secret Doctrine (Vol. 1) | H.P. Blavatsky | Search by title |
| Light on the Path | Mabel Collins | Search by title |
| The Tao Te Ching | Lao Tzu | Search by title |
| The Bhagavad-Gita | Various translations | Search by title |
| In Tune with the Infinite | Ralph Waldo Trine | Search by title |

---

### 4b. Open Library API (Metadata + Cover Images)

**URL:** https://openlibrary.org/developers/api  
**Auth:** None required  
**Use:** Get book covers, descriptions, subjects for display in LUMINA UI

```typescript
// Get book cover image
// https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
// https://covers.openlibrary.org/b/title/{title}-M.jpg

async function getBookCover(isbn: string, size: 'S' | 'M' | 'L' = 'L') {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

// Search for book data
async function searchOpenLibrary(title: string) {
  const res = await fetch(
    `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=5`
  );
  return res.json();
}
```

---

### 4e. Supabase Schema for Audiobooks

```sql
CREATE TABLE audiobooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  librivox_id TEXT UNIQUE,
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  cover_image_url TEXT,
  duration_total TEXT,
  language TEXT DEFAULT 'English',
  genre TEXT[],
  rss_url TEXT,
  zip_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audiobook_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES audiobooks(id) ON DELETE CASCADE,
  chapter_number INTEGER,
  title TEXT,
  stream_url TEXT NOT NULL,
  duration_seconds INTEGER
);

CREATE TABLE user_audiobook_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES audiobooks(id),
  chapter_id UUID REFERENCES audiobook_chapters(id),
  position_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);
```

---

## 5. AFFIRMATIONS

### 5a. Static JSON Dataset (Self-Contained, No API)

Store a curated set of 500+ affirmations in Supabase and serve them yourself. No external API dependency or rate limits. Seed from multiple public domain sources.

**GitHub dataset sources:**
- https://github.com/misselliev/affirmations-api (Ruby API with affirmation data — extract the JSON)
- Affirmation Pod (public podcast transcripts — public content)
- Manually authored (Claude Code can generate 200 seed affirmations per category)

#### Affirmation Categories

```typescript
export const AFFIRMATION_CATEGORIES = [
  'abundance',         // wealth, prosperity, receiving
  'love',              // relationships, self-love, connection
  'health',            // body, vitality, healing
  'identity',          // self-worth, confidence, authenticity
  'manifestation',     // goals, desires, alignment
  'morning',           // energy, gratitude, intention
  'sleep',             // calm, release, rest
  'shadow_work',       // inner child, healing, acceptance
  'chakra_root',       // safety, grounding, security
  'chakra_sacral',     // creativity, pleasure, flow
  'chakra_solar',      // power, will, purpose
  'chakra_heart',      // love, compassion, forgiveness
  'chakra_throat',     // expression, truth, voice
  'chakra_third_eye',  // intuition, vision, clarity
  'chakra_crown',      // spirituality, oneness, surrender
];
```

#### Supabase Schema

```sql
CREATE TABLE affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[],
  chakra TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily affirmation tracking
CREATE TABLE user_affirmation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  affirmation_id UUID REFERENCES affirmations(id),
  activity_type TEXT,     -- 'mirror_work' | 'journaling' | 'breathing' | 'repeat_aloud'
  session_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT
);
```

---

### 5b. Affirmation Activity Types to Build

Build these as interactive UI flows (no external API needed):

| Activity | Description | Tech |
|----------|-------------|------|
| **Mirror Work** | Full-screen card with affirmation, timer, breathing guide | React state + CSS animation |
| **21-Day Challenge** | Daily affirmation streak with category focus | Supabase + date logic |
| **Repeat Aloud** | Text-to-speech + record-yourself playback | Web Speech API + MediaRecorder |
| **Breathing + Affirm** | Animated breath circle + timed affirmation reveal | CSS keyframes |
| **Affirmation Journal** | Write response to each affirmation prompt | Supabase text storage |
| **Chakra Sequence** | Root → Crown 7-affirmation guided flow | Sequential React state |
| **I AM Generator** | AI-powered personal affirmation creator | Claude API (see Section 7) |

---

## 6. SPIRITUAL GUIDES CONTENT

### 6a. Approach: Curated Static Content + AI Layer

There is no single "spiritual guides API." The correct approach is:

1. **Seed a static content library** (articles, guides, exercises) authored or curated into Supabase
2. **Pull public domain texts** from Project Gutenberg and Open Library
3. **Generate summaries/explanations via Claude API** (see Section 7)

---

### 6b. Project Gutenberg API (Free, Public Domain Texts)

**URL:** https://gutenberg.org  
**API:** https://gutendex.com (unofficial RESTful Gutenberg API)  
**Auth:** None  
**License:** Public Domain

```typescript
// Search for spiritual texts
async function searchGutenberg(query: string) {
  const res = await fetch(
    `https://gutendex.com/books/?search=${encodeURIComponent(query)}&topic=spirituality`
  );
  return res.json();
}

// Get a specific book's full text
async function getBookText(gutenbergId: number) {
  const res = await fetch(
    `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`
  );
  return res.text();
}
```

#### Key Spiritual Texts Available (Public Domain)

| Text | Author | Gutenberg ID |
|------|--------|-------------|
| The Kybalion | Three Initiates | 14209 |
| The Secret Doctrine | H.P. Blavatsky | 37847 |
| Thought-Forms | Besant & Leadbeater | 16269 |
| The Astral Plane | C.W. Leadbeater | 21082 |
| In Tune with the Infinite | R.W. Trine | 2458 |
| The Science of Getting Rich | W.D. Wattles | 1732 |
| As a Man Thinketh | James Allen | 4507 |
| The Art of War | Sun Tzu | 132 |
| The Tao Te Ching | Lao Tzu | 216 |
| Meditations | Marcus Aurelius | 2680 |
| Collected Poems | Kahlil Gibran | Search |

---

### 6c. Spiritual Guide Content Categories to Build in Supabase

```sql
CREATE TABLE spiritual_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  content TEXT,              -- full markdown content
  cover_image_url TEXT,
  author TEXT,
  read_time_minutes INTEGER,
  difficulty TEXT,           -- 'beginner' | 'intermediate' | 'advanced'
  tags TEXT[],
  related_chakra TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Categories to Seed

| Category | Topics |
|----------|--------|
| **Foundations** | Law of Attraction, Manifestation basics, Energy 101 |
| **Chakras** | Each of the 7 chakras: meaning, blockages, activation |
| **Sacred Geometry** | Flower of Life, Merkaba, Golden Ratio |
| **Moon Phases** | New Moon rituals, Full Moon release, lunar cycles |
| **Shadow Work** | Inner child healing, integration practices |
| **Akashic Records** | What they are, how to access them |
| **Numerology** | Life path numbers, angel numbers 111/222/333/444/555 |
| **Crystal Healing** | Common crystals, properties, usage |
| **Astrology Basics** | Sun/Moon/Rising, houses, transits explained |
| **Breathwork** | Box breathing, 4-7-8, Wim Hof, holotropic |
| **Dream Work** | Lucid dreaming, dream journaling, symbols |
| **Energy Hygiene** | Grounding, shielding, cord-cutting |

---

## 7. AI-POWERED INTERPRETATION LAYER

Use Claude API (`claude-sonnet-4-20250514`) as the intelligence layer across all five products.

### 7a. Environment Setup

```bash
# .env.local
ANTHROPIC_API_KEY=your_key_here
```

```typescript
// lib/ai/claude.ts
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

async function askClaude(systemPrompt: string, userMessage: string) {
  const res = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}
```

---

### 7b. AI Feature: Tarot Reading Interpretation

```typescript
export async function interpretTarotReading(
  cards: { name: string; position: string; reversed: boolean; meaning: string }[],
  question?: string
) {
  const system = `You are a wise, compassionate tarot reader with deep knowledge of symbolism, Jungian psychology, and spiritual growth. Your interpretations are grounded yet mystical — you connect the cards to practical life guidance while honoring their archetypal depth. Never be fatalistic. Always empower the querent.`;

  const cardDescriptions = cards
    .map(c => `${c.position}: ${c.name} (${c.reversed ? 'Reversed' : 'Upright'}) — ${c.meaning}`)
    .join('\n');

  const userMessage = question
    ? `I drew these cards for the question: "${question}"\n\n${cardDescriptions}\n\nPlease give me a connected, insightful reading.`
    : `I drew these cards:\n\n${cardDescriptions}\n\nPlease interpret this spread.`;

  return askClaude(system, userMessage);
}
```

---

### 7c. AI Feature: Natal Chart Interpretation

```typescript
export async function interpretNatalChart(chartData: {
  sun: string; moon: string; rising: string;
  mercury: string; venus: string; mars: string;
  dominantElement?: string; aspects?: string[];
}) {
  const system = `You are an expert Western astrologer with 20+ years of experience. You interpret birth charts with warmth, nuance and psychological depth. You reference Jungian archetypes, evolutionary astrology, and practical life guidance. You never make deterministic predictions — instead you reveal patterns, potentials, and growth edges.`;

  const userMessage = `Interpret this natal chart:
- Sun in ${chartData.sun}
- Moon in ${chartData.moon}  
- Rising (Ascendant): ${chartData.rising}
- Mercury in ${chartData.mercury}
- Venus in ${chartData.venus}
- Mars in ${chartData.mars}
${chartData.aspects?.length ? `- Key aspects: ${chartData.aspects.join(', ')}` : ''}

Give a 300-word interpretation focusing on core personality, soul purpose, and manifestation strengths.`;

  return askClaude(system, userMessage);
}
```

---

### 7d. AI Feature: Personalized Affirmation Generator

```typescript
export async function generatePersonalAffirmations(input: {
  name: string;
  goal: string;
  category: string;
  sunSign?: string;
  lifePathNumber?: number;
}) {
  const system = `You create powerful, personal affirmations that feel true and achievable. You avoid generic platitudes. Each affirmation starts with "I am", "I have", or "I choose". They are specific, present-tense, emotionally resonant, and grounded in the person's stated goals. Return exactly 5 affirmations as a JSON array.`;

  const userMessage = `Create 5 personal affirmations for:
Name: ${input.name}
Goal: ${input.goal}
Focus area: ${input.category}
${input.sunSign ? `Sun sign: ${input.sunSign}` : ''}
${input.lifePathNumber ? `Life path number: ${input.lifePathNumber}` : ''}

Return as JSON: { "affirmations": ["...", "...", "...", "...", "..."] }`;

  const response = await askClaude(system, userMessage);
  return JSON.parse(response);
}
```

---

### 7e. AI Feature: Spiritual Guide Article Generation

```typescript
export async function generateSpiritualGuide(topic: string, level: 'beginner' | 'intermediate' | 'advanced') {
  const system = `You are a knowledgeable spiritual teacher writing educational guides for a manifestation platform. Your tone is warm, clear, and empowering. You blend ancient wisdom with modern psychology. Content is structured with markdown (## headings, bullet points, practical exercises). Never make medical claims.`;

  const userMessage = `Write a ${level} guide on: "${topic}"

Structure:
## What Is [Topic]
## Why It Matters for Manifestation  
## Core Concepts (3-5 key ideas)
## Step-by-Step Practice
## Integration Tips

Target length: 600-800 words.`;

  return askClaude(system, userMessage);
}
```

---

## 8. SUPABASE DATA ARCHITECTURE

### 8a. Complete Schema Overview

```sql
-- Core user profile
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'active',   -- 'active' | 'expired' | 'trial'
  subscription_started_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT false,
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  manifestation_day_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily practice tracking
CREATE TABLE daily_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  affirmation_done BOOLEAN DEFAULT false,
  meditation_done BOOLEAN DEFAULT false,
  journaling_done BOOLEAN DEFAULT false,
  tarot_done BOOLEAN DEFAULT false,
  gratitude_done BOOLEAN DEFAULT false,
  UNIQUE(user_id, practice_date)
);
```

### 8b. Row-Level Security (RLS) Policies

```sql
-- Enable RLS on all user tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE natal_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_audiobook_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_affirmation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_practices ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own data
CREATE POLICY "users_own_data" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "users_own_readings" ON tarot_readings
  FOR ALL USING (auth.uid() = user_id);

-- Same pattern for all other user tables
```

### 8c. Supabase Edge Functions for Sensitive Logic

Use Edge Functions (Deno) for operations that require secret API keys:

```
/supabase/functions/
  ├── tarot-interpret/        # Calls Claude API for tarot reading
  ├── natal-chart-generate/   # Calls Astrologer API (RapidAPI key hidden)
  ├── affirmation-generate/   # Calls Claude API for personalized affirmations
  └── daily-card/             # Seeded daily tarot card per user
```

---

## 9. LEGAL & LICENSING SUMMARY

| Source | License | Commercial Use | Attribution Required |
|--------|---------|---------------|---------------------|
| tarotapi.dev | Open Source | ✅ Yes | No |
| Rider-Waite deck images (1909) | Public Domain | ✅ Yes | No |
| Astrologer API (RapidAPI) | API ToS | ✅ Yes (paid) | No |
| AstroChart.js | Open Source MIT | ✅ Yes | No |
| Freesound (CC0 sounds) | CC0 Public Domain | ✅ Yes | No |
| Freesound (CC-BY sounds) | Creative Commons | ✅ Yes | ✅ Must credit |
| Pixabay Audio | Pixabay License | ✅ Yes | No |
| LibriVox audiobooks | Public Domain | ✅ Yes | Recommended |
| Project Gutenberg texts | Public Domain | ✅ Yes | No |
| Open Library API | Open | ✅ Yes | No |
| Nominatim (OpenStreetMap) | ODbL | ✅ Yes | ✅ Must credit OSM |
| Web Audio API | Browser built-in | ✅ Yes | N/A |
| Claude API (Anthropic) | API ToS | ✅ Yes (paid) | No |

### Important Notes

1. **Freesound CC-BY sounds** require attribution in your platform (e.g., "Sound by [username] on freesound.org"). Build this into your audio player UI.

2. **LibriVox books** — authors' estates may still hold rights in some countries even if the original work is public domain in the US. Default to pre-1928 publication dates for maximum safety.

3. **Astrologer API free tier** is 100 requests/month — sufficient for development. Cache SVG charts in Supabase to avoid re-fetching. A user's natal chart almost never changes, so one API call per user.

4. **Claude API costs** are per-token. Tarot interpretations (~300 tokens each) and affirmation generation (~150 tokens) are economical. Implement client-side rate limiting (one interpretation per 10 minutes per user) to manage costs.

5. **Solfeggio frequency tone generation** via Web Audio API requires no license, costs nothing, and runs entirely in the browser. This is the recommended approach for the frequency tools section.

---

## QUICK START — RECOMMENDED INTEGRATION ORDER

1. **Week 1:** Set up Supabase schema, seed tarot card data from tarotapi.dev, build tarot UI
2. **Week 2:** Build natal chart form, integrate Astrologer API, cache SVG results, add AstroChart.js wheel
3. **Week 3:** Build Solfeggio tone generator (Web Audio API), add Freesound search for ambient tracks, build audio player
4. **Week 4:** Seed LibriVox audiobooks, build book browser and chapter player
5. **Week 5:** Seed affirmations database, build interactive affirmation activities
6. **Week 6:** Seed spiritual guides content, add Claude API interpretation across all features
7. **Week 7:** Daily practice tracking, streaks, personalization, user profile completion

---

*Document prepared for LUMINA Platform — Claude Code build reference*  
*Last updated: May 2026*
