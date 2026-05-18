# LUMZEN — Brand & Design System
## The single source of truth for the LumZen identity

> **Purpose of this file.** This is the authoritative brand book and design system reference for LumZen. Every color, font, icon, animation, copy line, and component pattern that defines the brand lives here. Generated from the v0 design (May 18, 2026) plus the strategic brand foundation.
>
> **Source of truth precedence.** If the code drifts from this document, the code wins — and this document should be updated to match. If brand strategy needs to evolve, update this document *first*, then update the code.
>
> **For Claude Code / new contributors.** Read this file in full before writing any UI code, marketing copy, or content. The brand voice, palette, and typography are tightly defined — they should not be loosened, mixed, or improvised.

---

## TABLE OF CONTENTS

1. [Brand Identity](#1-brand-identity)
2. [Voice & Tone](#2-voice--tone)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Iconography](#5-iconography)
6. [Spatial System](#6-spatial-system)
7. [Animation & Motion](#7-animation--motion)
8. [Component Patterns](#8-component-patterns)
9. [Background System](#9-background-system)
10. [Copy Library](#10-copy-library)
11. [Asset Specifications](#11-asset-specifications)
12. [Implementation Checklist](#12-implementation-checklist)

---

## 1. BRAND IDENTITY

### Name
**LumZen** (one word, camelCase: `L` + `umZ` + `en`)
- Capitalization: Always *LumZen*, never *Lumzen*, *LUMZEN*, *lumzen*, or *lum-zen*.
- In logos and UI displays the prefix `✦` glyph precedes the name with a single space: `✦ LumZen`.
- In all caps (rare — only for `<Cinzel>` section labels): `LUMZEN`.

### Tagline
**Where Light Meets Stillness.**
- Always written with sentence case and the final period.
- Used as the meta description anchor, footer line, and hero subhead.
- Never abbreviated, never reordered, never softened.

### Etymology & Meaning
- **Lum** — from *lumen* (Latin: unit of light) and *luminary* (a celestial body that emits light; a guiding figure).
- **Zen** — from Japanese Buddhism: presence, stillness, awakened awareness without effort.
- Together: *The light that comes from stillness. The clarity found in peace.*

### Brand Promise
LumZen is your personal sanctuary for spiritual growth — combining ancient wisdom, celestial intelligence, and daily practice in one luminous space.

### Domain & URLs
- **Primary:** `lumzen.co`
- **Brand secondaries (held but not primary):** `lumzen.io`, `lumzen.ai`, `lumzen.app`, `lumzen.life`
- **Email pattern:** `hello@lumzen.co` (or local-part by function: `support@`, `noreply@`)

### Audience
Adults pursuing spiritual practice, manifestation work, and self-discovery — beginners through deepening practitioners. Not narrowly gendered, not narrowly aged. Anti-fluffy, anti-toxic-positivity, anti-gatekeeping. Seekers who want depth without dogma.

### Five Product Pillars
The platform organizes around five "pillars." Each is a navigation destination and an identity marker. Each has its own accent color (see §3.3).

| Pillar | Display Name | Internal slug | Accent Color | Glyph |
|---|---|---|---|---|
| 1 | Spiritual Guides | `guides` | gold `#c4a35a` | 📖 |
| 2 | Sacred Audiobooks | `audiobooks` | rose `#d4758a` | 🎧 |
| 3 | Affirmation Practice | `affirmations` | mint `#6bcc9e` | ✨ |
| 4 | Meditation & Sound | `sound` | mist `#4db8a8` | 🔮 |
| 5 | Celestial Tools | `celestial` | glow `#8b6fc9` | 🌌 |

### Subscriber Term
Members are referred to as **"the community"**, **"seekers"**, or addressed by name. Never *"users"*, *"customers"*, or *"clients"*.

### Brand Glyph
The 8-pointed star `✦` (Unicode U+2726, "BLACK FOUR POINTED STAR") is the brand mark. It appears:
- Before the brand name in headers and logos
- As a section-label prefix in Cinzel-cased headings
- As a quiet decorative accent in greetings and CTAs
Always rendered in gold `#c4a35a` against dark surfaces.

---

## 2. VOICE & TONE

### Voice Pillars (always all four)

| Pillar | Description |
|---|---|
| **Calm authority** | Confident without performing expertise. Speaks like someone who has actually done the work. |
| **Mystical but grounded** | Comfortable with the language of the cosmos, but never woo-woo. Cites mechanisms over miracles. |
| **Editorial, not promotional** | Magazine prose, not landing-page hype. Earned trust over manufactured urgency. |
| **Quiet warmth** | Welcoming without being effusive. The voice of a friend who has been there. |

### Voice Rules (absolute, never violated)

| Rule | Reason |
|---|---|
| No exclamation marks, ever. | The brand has nothing to shout about. |
| No ALL CAPS for emphasis. | Cinzel display caps are typographic, not emphatic. |
| No emoji in body copy. | Reserved only for product icons and pillar markers (📖🎧✨🔮🌌🌙☀️↑). |
| No toxic positivity. | "You've got this," "manifest your dream life," "raise your vibes" — banned. |
| No spiritual jargon without grounding. | Use "chakra" with a clear description. Don't presume initiation. |
| No claims of guaranteed outcomes. | Avoid: *"will heal,"* *"will manifest,"* *"will attract."* Use: *"may support,"* *"is associated with,"* *"practices that have helped many."* |
| No gendered or aged framing. | Avoid *"ladies,"* *"queens,"* *"divine feminine"* as default. Avoid *"young soul"* / *"old soul"* presumption. |

### Banned Words & Phrases

| Banned | Replacement |
|---|---|
| "users," "customers" | "community," "seekers," "you" |
| "raise your vibration" | "tune your attention," "shift your frequency" |
| "manifest your dream" | "align with what you want," "move toward what calls you" |
| "divine feminine" / "divine masculine" | (drop the framing or be specific: "Venus energy," "Mars energy") |
| "high-vibe" | (drop) |
| "abundance mindset" (used as ubiquitous filler) | "receivership," "openness," or be concrete |
| "love & light" / "namaste" (as default closer) | (drop, use specific intentions) |
| "good vibes only" | (drop — denies the shadow work the platform values) |

### Preferred Vocabulary

| Concept | Use this |
|---|---|
| The act of practice | "ritual," "practice," "session," "journey" |
| Inner state | "stillness," "presence," "clarity," "alignment" |
| Growth | "deepening," "expansion," "awakening" (sparingly) |
| Energy | "frequency," "current," "resonance" |
| Time element | "the morning," "the threshold," "the season" |
| Direct address | "you," "your kin," "the community" |

### Voice in Headlines
- Cormorant Garamond (serif, italic friendly) is the voice of the brand at its most intimate.
- Headlines often pose a paradox or invitation, not a claim:
  - ✅ *"The light is already within you."*
  - ✅ *"The cosmos has always been speaking."*
  - ✅ *"Where light meets stillness."*
  - ❌ *"Manifest your dreams today!"*
  - ❌ *"The #1 spiritual app for 2026"*

### Voice in CTAs
CTAs are invitations, not demands. They often end with the gold ✦ glyph.
- ✅ *"Begin Your Journey ✦"*
- ✅ *"Reveal Today's Card ✦"*
- ✅ *"Generate My Chart ✦"*
- ❌ *"Sign Up Now!"*
- ❌ *"Get Started Free!"*

### Time-Sensitive Greetings (verified in code)
```
05:00–11:59 → "Good morning, [Name] ✦"  / "The light is already within you."
12:00–16:59 → "Good afternoon, [Name] ✦"  / "Stillness is available right now."
17:00–20:59 → "Good evening, [Name] ✦"  / "The stars are beginning to listen."
21:00–04:59 → "Rest well, [Name] ✦"  / "Your practice continues in your dreams."
```

---

## 3. COLOR SYSTEM

### 3.1 Base Surfaces (the cosmic void)

| Token | Hex | Role |
|---|---|---|
| `--background` | `#06060f` | Page background — near-black with a deep blue undertone |
| `--surface-1` | `#0c0c1e` | Card layer 1 — slightly elevated from background |
| `--surface-2` | `#12122a` | Card layer 2 — popovers, inputs, muted areas |
| `--surface-3` | `#1a1a35` | Surface layer 3 — elevated cards, content blocks |

Never use pure black `#000000` — the deep blue undertone in `#06060f` is part of the brand.

### 3.2 Brand Accent Colors

| Token | Hex | Name | Use |
|---|---|---|---|
| `--lum-gold` | `#c4a35a` | **LumZen Gold** | Primary brand color, logo, CTAs, focus rings, active states. The "Lum" in LumZen. |
| `--lum-glow` | `#8b6fc9` | **LumZen Glow (violet)** | Secondary accent for celestial/spiritual elements, tarot, natal chart |
| `--lum-blue` | `#6b9fd4` | **LumZen Blue** | Tertiary accent for cosmic/moon elements, intuition tone |
| `--lum-mist` | `#4db8a8` | **LumZen Mist (teal)** | Sound, frequency, water/breath elements |
| `--lum-rose` | `#d4758a` | **LumZen Rose** | Audiobook/literary content, heart/love themes |
| `--lum-mint` | `#6bcc9e` | **LumZen Mint** | Affirmations, growth, mint-fresh inner state |

> **Critical:** No color outside this palette should appear in the UI. No bright neons, no pure white text, no #FF0000 errors. Errors use `--destructive: #ef4444` only.

### 3.3 Pillar Accent Mapping
Each of the five product pillars has a dedicated accent. This mapping is **mandatory** — UI elements within a pillar must use only that pillar's accent for highlights, badges, hovers, and category labels.

| Pillar | Token | Hex | Hover/Glow `+22` opacity | Border `+33` |
|---|---|---|---|---|
| Spiritual Guides | `--lum-gold` | `#c4a35a` | `#c4a35a22` | `#c4a35a33` |
| Sacred Audiobooks | `--lum-rose` | `#d4758a` | `#d4758a22` | `#d4758a33` |
| Affirmation Practice | `--lum-mint` | `#6bcc9e` | `#6bcc9e22` | `#6bcc9e33` |
| Meditation & Sound | `--lum-mist` | `#4db8a8` | `#4db8a822` | `#4db8a833` |
| Celestial Tools | `--lum-glow` | `#8b6fc9` | `#8b6fc922` | `#8b6fc933` |

### 3.4 Text Colors

| Token | Hex | Role | WCAG vs `#06060f` |
|---|---|---|---|
| `--text-primary` | `#f0eff8` | Body text, headings | 17.4:1 (AAA) |
| `--text-secondary` | `#8f8daa` | Subtitles, muted body | 6.0:1 (AA Large) |
| `--text-muted` | `#4a4866` | Captions, timestamps, fine print | 2.4:1 (decorative only) |

Never use pure white `#ffffff` for text — the slight lavender undertone in `#f0eff8` is intentional.

### 3.5 Border & Input Colors

| Token | Value | Use |
|---|---|---|
| `--border` | `rgba(196, 163, 90, 0.15)` | Subtle border for cards, separators |
| `--border-active` | `rgba(196, 163, 90, 0.50)` | Hover/focus border |
| `--input` | `rgba(255, 255, 255, 0.04)` | Input background |
| `--ring` | `#c4a35a` | Focus ring (1px solid) |

### 3.6 Solfeggio Frequency Colors
Each of the nine frequency cards uses a unique accent. **Do not mix or substitute.**

| Hz | Name | Color | Symbolism |
|---|---|---|---|
| 174 | Foundation | `#8b4513` (saddle brown) | Earth, grounding, base chakra |
| 285 | Restoration | `#4a7c59` (deep green) | Cellular regrowth, sacral renewal |
| 396 | Liberation | `#8b6fc9` (violet) | Release, transmutation |
| 417 | Transformation | `#d4758a` (rose) | Heart change, pattern break |
| 528 | Love | `#c4a35a` (gold) | The love frequency, heart center |
| 639 | Connection | `#6bcc9e` (mint) | Relationship, harmony |
| 741 | Intuition | `#6b9fd4` (blue) | Throat, expression, truth |
| 852 | Return | `#4db8a8` (mist) | Third eye, returning to spiritual order |
| 963 | Oneness | `#9b8ec4` (lavender) | Crown, divine union |

### 3.7 Status Colors

| State | Token | Hex |
|---|---|---|
| Destructive / Error | `--destructive` | `#ef4444` |
| Success | (use `--lum-mint`) | `#6bcc9e` |
| Warning | (use `--lum-gold`) | `#c4a35a` |
| Info | (use `--lum-blue`) | `#6b9fd4` |

---

## 4. TYPOGRAPHY

### 4.1 Font Stack (load via `next/font/google` in `app/layout.tsx`)

```typescript
import { Cormorant_Garamond, Cinzel, Jost, JetBrains_Mono } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});
```

### 4.2 Font Role Assignment

| Role | Family | Tailwind class | CSS variable | Used for |
|---|---|---|---|---|
| **Editorial display** | Cormorant Garamond (serif, italic friendly) | `font-serif` | `--font-cormorant` | H1, H2, H3, hero headlines, pull quotes, "voice" copy |
| **Section labels & caps** | Cinzel (classical Roman caps) | `font-display` | `--font-cinzel` | Section labels (uppercase, letter-spacing 0.2em), brand name in logo |
| **UI body & buttons** | Jost (geometric sans) | `font-sans` | `--font-jost` | Paragraph text, buttons, navigation, form labels, all interactive UI |
| **Numeric & technical** | JetBrains Mono | `font-mono` | `--font-jetbrains` | Hz values, time codes, dates, degree readings, IDs |

### 4.3 Type Scale

| Use case | Family | Size | Line height | Weight | Style |
|---|---|---|---|---|---|
| Hero headline | Cormorant | 36–48px | 1.1 | 400 | italic optional |
| H2 (section title) | Cormorant | 24–28px | 1.2 | 400 | regular |
| H3 (card title) | Cormorant | 18px | 1.3 | 400 | regular |
| H4 | Cormorant | 16px | 1.4 | 500 | regular |
| Section label | Cinzel | 11px | 1.4 | 400 | UPPERCASE, letter-spacing 0.20em |
| Brand name (header) | Cinzel | 15px | 1.0 | 400 | sentence-case, letter-spacing 0.10em |
| Body | Jost | 14px | 1.5 | 400 | regular |
| Body small | Jost | 12px | 1.5 | 400 | regular |
| Button | Jost | 14px | 1.0 | 500 | regular |
| Caption / fine print | Jost | 11–12px | 1.4 | 400 | regular |
| Hz / metric | JetBrains Mono | 20–22px | 1.0 | 400 | regular |
| Time code / data | JetBrains Mono | 11px | 1.0 | 400 | regular |

### 4.4 Typographic Rules

- **Italic Cormorant** is reserved for *intimate voice* moments: greetings ("Good evening, Sarah ✦"), hero subtitles, pull quotes, and CTAs that read like invitations.
- **Cinzel** is always uppercase. Never sentence-case Cinzel.
- **Letter-spacing** on Cinzel section labels: `letter-spacing: 0.20em` minimum.
- **Letter-spacing** on Cinzel brand name: `letter-spacing: 0.10em`.
- **Jost** is the default for everything not explicitly above. Never use Cormorant for buttons or small UI text.
- **JetBrains Mono** is used *only* for technical/numeric data. Never for headings or body.

### 4.5 Common Combinations (verified in code)

```jsx
{/* Section header pattern */}
<div>
  <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-1"
     style={{ color: accentColor }}>
    ✦ SPIRITUAL GUIDES
  </p>
  <h2 className="font-serif text-2xl text-[#f0eff8]">Deepen Your Understanding</h2>
  <p className="font-sans text-sm text-[#8f8daa]">Wisdom you can actually use</p>
</div>

{/* Greeting pattern */}
<h1 className="font-serif text-xl italic text-[#f0eff8]">
  Good evening, {name} <span className="text-[#c4a35a]">✦</span>
</h1>

{/* Frequency card pattern */}
<span className="font-mono text-xl text-[#f0eff8]">528</span>
<span className="font-mono text-[10px] text-[#8f8daa]">Hz</span>
<span className="font-display text-[9px] text-[#c4a35a] uppercase tracking-wider">LOVE</span>
<span className="font-sans text-[10px] text-[#4a4866]">Open the heart. Heal.</span>
```

---

## 5. ICONOGRAPHY

### 5.1 Two Icon Systems

LumZen uses **two distinct icon systems** in parallel:

1. **Lucide React** — for UI affordances (navigation, controls, actions)
2. **Mystical Icons** (custom SVG, `components/mystical-icons.tsx`) — for content cards (one per content item)

### 5.2 Lucide React (UI Icons)

Used for navigation, controls, and standard UI affordances. Default stroke width: 2px. Default size: 16–24px depending on context.

| Element | Icon | Size |
|---|---|---|
| Sidebar — Home | `LayoutDashboard` | 20px |
| Sidebar — Spiritual Guides | `BookOpen` | 20px |
| Sidebar — Audiobooks | `Headphones` | 20px |
| Sidebar — Affirmations | `Sparkles` | 20px |
| Sidebar — Sound Temple | `Music2` | 20px |
| Sidebar — Celestial Tools | `Stars` | 20px |
| Sidebar — Profile | `User` | 20px |
| Sidebar — Settings | `Settings` | 20px |
| Header — Search | `Search` | 16px |
| Header — Notifications | `Bell` | 20px |
| Player — Play | `Play` | 14–20px |
| Player — Pause | `Pause` | 14–20px |
| Player — Next | `SkipForward` | 18px |
| Player — Previous | `SkipBack` | 18px |
| Player — Volume | `Volume2` | 18px |
| Player — Sleep timer | `Timer` | 18px |
| Player — Expand | `Maximize2` | 18px |
| Card — Bookmark | `Bookmark` | 14px |
| Mobile menu | `Menu` / `X` | 24px |

### 5.3 Mystical Icons (Content Icons)

25 custom SVG icons live in `components/mystical-icons.tsx`, organized into five groups of five. Used as the visual representation for individual content items inside cards.

```typescript
import {
  // Spiritual Guides
  IconSacredBook, IconChakraSpiral, IconMoonPhases, IconFlowerOfLife, IconAkashicRecords,
  // Audiobooks
  IconProphet, IconAncientScroll, IconHermetic, IconYinYang, IconInfiniteWisdom,
  // Affirmations
  IconMorningRise, IconTransformation, IconMirrorSelf, IconLotusChakra, IconBreathWaves,
  // Sound/Meditation
  IconFrequencyWaves, IconSingingBowl, IconThetaWave, IconLunarSleep, IconOmSymbol,
  // Celestial Tools
  IconTarotCard, IconOracleCrystal, IconCelticKnot, IconZodiacWheel, IconNatalChart,
} from "@/components/mystical-icons";
```

**Icon component contract:**
```typescript
type IconProps = {
  className?: string;
  color?: string;     // hex; defaults to "currentColor"
  size?: number;      // pixels; defaults to 48
};
```

**Default usage on content cards:**
- Size: 64px
- Color: the pillar accent color
- Opacity: 0.9
- Background: gradient `${accentColor}33` to `${accentColor}11`

### 5.4 The Brand Glyph
`✦` (U+2726) is used as the LumZen mark. Always:
- Rendered in `#c4a35a` (LumZen Gold)
- Followed by a non-breaking space before brand name or label
- Used to prefix section labels in Cinzel: `✦ SPIRITUAL GUIDES`
- Used in CTAs as a trailing accent: `Begin Your Journey ✦`

---

## 6. SPATIAL SYSTEM

### 6.1 Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `calc(0.625rem - 4px)` = ~6px | Inputs, small buttons |
| `--radius-md` | `calc(0.625rem - 2px)` = ~8px | Nav items, badges |
| `--radius-lg` | `0.625rem` = 10px | Cards (default) |
| `--radius-xl` | `calc(0.625rem + 4px)` = ~14px | Content cards (`rounded-2xl`) |
| `--radius-2xl` | `1.25rem` = 20px | Hero "Today's Practice" card |
| `rounded-full` | `9999px` | Pills, buttons, avatars |

### 6.2 Standard Sizes

| Element | Size |
|---|---|
| Sidebar (collapsed) | 68px |
| Sidebar (expanded) | 220px |
| Content card | 240px wide × ~280px tall |
| Card image area | 140px tall |
| Solfeggio frequency card | 120px × 160px |
| Tarot card display | 160px × 256px (5:8 ratio) |
| Avatar | 40px × 40px |
| Audio player bar | full-width × 72px |
| Quick-start pill | auto width × 44px tall |

### 6.3 Spacing Rhythm

Tailwind's default 4px grid is used. Common section gaps:
- Between major sections: `mb-12` (48px)
- Between section header and content: `mb-4` (16px)
- Card padding: `p-4` (16px) for content, `p-6 md:p-8` (24/32px) for feature cards
- Page padding: `px-6 py-6` (24px) on main content

### 6.4 Card Patterns

```css
/* Content card (any pillar) */
background: rgba(26, 26, 53, 0.85);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 16px;

/* On hover */
border: 1px solid ${accentColor}66;     /* 40% opacity of accent */
transform: translateY(-6px);
box-shadow: 0 20px 60px ${accentColor}14;  /* 8% opacity glow */

/* Sibling dimming when another card in row is hovered */
opacity: 0.6;
filter: brightness(0.8);
```

---

## 7. ANIMATION & MOTION

### 7.1 Animation Tokens

All animations use these keyframes (defined in `app/globals.css`):

```css
/* Star twinkling — per-star, randomized 2–7s */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%      { opacity: 0.9; transform: scale(1.2); }
}

/* Nebula drift — 25s alternate */
@keyframes nebulaDrift {
  0%   { transform: translate(-15px, -20px); }
  100% { transform: translate( 15px,  20px); }
}

/* Lum-Glow orbit — 30s linear infinite */
@keyframes lumOrbit {
  0%   { transform: translate(-50%, -50%) rotate(0deg)   translateX(100px) rotate(   0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg) translateX(100px) rotate(-360deg); }
}

/* Gold shimmer sweep — button hover, 1.5s ease-in-out infinite */
@keyframes shimmerSweep {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX( 100%); }
}

/* Soft pulse — avatar ring when audio playing, 2s infinite */
@keyframes pulse-soft {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.8; transform: scale(1.05); }
}

/* Tarot card flip — single use on click, 700ms */
@keyframes cardFlip {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

/* Fade up — page load section reveals, 600ms with stagger */
@keyframes fadeUp {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### 7.2 Staggered Page Load

Each major section fades up with an 80ms cascade:
```jsx
<div style={{ animation: "fadeUp 0.6s ease-out 0.00s forwards" }}>...</div>
<div style={{ animation: "fadeUp 0.6s ease-out 0.08s forwards", opacity: 0 }}>...</div>
<div style={{ animation: "fadeUp 0.6s ease-out 0.16s forwards", opacity: 0 }}>...</div>
<div style={{ animation: "fadeUp 0.6s ease-out 0.24s forwards", opacity: 0 }}>...</div>
```

### 7.3 Motion Principles

- **Slow over fast.** Default animation duration is 200ms for interactions, 600ms for reveals, 25s+ for ambient.
- **Easing.** `ease-in-out` or `ease-out` only. No `linear` for UI interactions (only for orbit/drift).
- **Cosmic ambient never stops.** Stars twinkle, nebulae drift, the orb orbits — always.
- **Reduce motion respect.** Wrap motion-heavy elements in `@media (prefers-reduced-motion: reduce)` overrides to disable star animation, nebula drift, and shimmer sweep. (To be implemented.)

---

## 8. COMPONENT PATTERNS

### 8.1 Section Header

```jsx
<div className="flex items-center justify-between mb-4">
  <div>
    <p
      className="font-display text-[11px] tracking-[0.2em] uppercase mb-1"
      style={{ color: accentColor }}
    >
      ✦ {labelInCaps}
    </p>
    <h2 className="font-serif text-2xl text-[#f0eff8]">{title}</h2>
    <p className="font-sans text-sm text-[#8f8daa]">{subtitle}</p>
  </div>
  <button className="font-sans text-sm text-[#c4a35a] hover:underline hidden md:block">
    See all →
  </button>
</div>
```

### 8.2 Content Card (Horizontal Scroll Row)

```jsx
<div
  className="flex-shrink-0 w-[240px] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group"
  style={{
    background: "rgba(26,26,53,0.85)",
    backdropFilter: "blur(10px)",
    border: hovered ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.06)",
    transform: hovered ? "translateY(-6px)" : "none",
    boxShadow: hovered ? `0 20px 60px ${accentColor}14` : "none",
    opacity: isOtherHovered && !hovered ? 0.6 : 1,
    filter: isOtherHovered && !hovered ? "brightness(0.8)" : "none",
  }}
>
  <div
    className="h-[140px] flex items-center justify-center"
    style={{ background: `linear-gradient(135deg, ${accentColor}33 0%, ${accentColor}11 100%)` }}
  >
    <Icon color={accentColor} size={64} className="opacity-90" />
  </div>
  <div className="p-4">
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[9px] font-display uppercase tracking-[0.1em] mb-2"
      style={{ background: `${accentColor}22`, color: accentColor }}
    >
      {category}
    </span>
    <h3 className="font-serif text-base text-[#f0eff8] mb-1 line-clamp-1">{title}</h3>
    <p className="font-mono text-[11px] text-[#4a4866]">{duration}</p>
    <div className="flex items-center justify-end mt-3">
      <span className="font-sans text-xs text-[#c4a35a] group-hover:underline">Begin →</span>
    </div>
  </div>
</div>
```

### 8.3 Primary Gold CTA Button

```jsx
<button className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all relative overflow-hidden group">
  <span className="relative z-10">{label} ✦</span>
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        animation: "shimmerSweep 1.5s ease-in-out infinite",
      }}
    />
  </div>
</button>
```

### 8.4 Outline (Secondary) Button

```jsx
<button className="w-full py-3 rounded-full border border-[#c4a35a] text-[#c4a35a] font-sans text-sm hover:bg-[rgba(196,163,90,0.1)] transition-all">
  {label} →
</button>
```

### 8.5 Quick-Start Pill

```jsx
<button className="flex items-center gap-3 px-5 py-3 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(196,163,90,0.2)] transition-all duration-200">
  <span>{symbol}</span>
  <span className="font-sans text-sm text-[#f0eff8]">{label}</span>
</button>
```

### 8.6 Input Field

```jsx
<input
  type="text"
  placeholder={placeholder}
  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
/>
```

### 8.7 Placement Pill (Sun/Moon/Rising)

```jsx
<span className="px-3 py-1 rounded-full bg-[rgba(196,163,90,0.2)] text-[#c4a35a] font-sans text-sm">
  ☀️ Sun in {sunSign}
</span>
```

### 8.8 Header Greeting

```jsx
<header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between gap-4"
  style={{
    background: "rgba(6,6,15,0.80)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(196,163,90,0.10)",
  }}>
  <div>
    <h1 className="font-serif text-xl italic text-[#f0eff8]">
      {greeting}, {name} <span className="text-[#c4a35a]">✦</span>
    </h1>
    <p className="font-sans text-xs text-[#8f8daa] mt-0.5">
      {date} · 🌙 {moonPhase} · Day {dayStreak} of your practice
    </p>
  </div>
</header>
```

---

## 9. BACKGROUND SYSTEM

The cosmic ambient backdrop is composed of three layered systems, all `fixed inset-0 pointer-events-none z-0`.

### 9.1 Star Field

150 stars, three tiers, randomized positions and animation delays.

```jsx
function StarField() {
  const stars = useMemo(() => Array.from({ length: 150 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: i < 100 ? 1 : i < 130 ? 1.5 : Math.random() * 1 + 2,
    opacity: i < 100 ? 0.3 : i < 130 ? 0.5 : 0.7,
    duration: Math.random() * 5 + 2,    // 2–7s twinkle
    delay: Math.random() * 5,
  })), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            boxShadow: s.size > 2 ? "0 0 4px rgba(255,255,255,0.5)" : "none",
          }} />
      ))}
    </div>
  );
}
```

### 9.2 Nebula Gradients

Two large radial blurs that drift slowly behind everything.

```jsx
{/* Top-left: violet nebula */}
<div className="absolute" style={{
  top: "-10%", left: "-20%",
  width: "70vw", height: "70vw",
  background: "radial-gradient(circle, rgba(107,79,160,0.18) 0%, transparent 70%)",
  animation: "nebulaDrift 25s ease-in-out infinite alternate",
}} />

{/* Bottom-right: mist nebula */}
<div className="absolute" style={{
  bottom: "-10%", right: "-10%",
  width: "60vw", height: "60vw",
  background: "radial-gradient(circle, rgba(77,184,168,0.10) 0%, transparent 70%)",
  animation: "nebulaDrift 25s ease-in-out infinite alternate-reverse",
}} />
```

### 9.3 Lum-Glow Orb

A blurred golden orb that orbits slowly behind the hero area.

```jsx
<div className="absolute top-1/4 left-1/2" style={{
  width: "400px", height: "400px",
  background: "radial-gradient(circle, rgba(196,163,90,0.08) 0%, transparent 70%)",
  filter: "blur(60px)",
  animation: "lumOrbit 30s linear infinite",
}} />
```

---

## 10. COPY LIBRARY

### 10.1 Hero & Brand
```
Tagline:        Where Light Meets Stillness.
Description:    LumZen is your daily spiritual practice platform — tarot, natal charts,
                affirmations, meditation, sound healing and sacred audiobooks in one place.
Hero H1:        Where Light Meets Stillness.
Hero H2:        Ancient wisdom. Celestial guidance. Daily practice.
Primary CTA:    Begin Your Journey — It's Free
Secondary CTA:  See What's Inside →
```

### 10.2 Pillar Section Headers (verified in code)

| Pillar | Label (Cinzel) | Title (Cormorant) | Subtitle (Jost) |
|---|---|---|---|
| Spiritual Guides | `✦ SPIRITUAL GUIDES` | *Deepen Your Understanding* | Wisdom you can actually use |
| Sacred Audiobooks | `✦ SACRED AUDIOBOOKS` | *Voices Across Time* | The texts that shaped seekers before you |
| Affirmation Practice | `✦ AFFIRMATION PRACTICE` | *Rewire Your Inner World* | Daily activities for lasting change |
| Meditation & Sound | `✦ MEDITATION & SOUND` | *The Sound Temple* | Frequencies that restore. Silence that speaks. |
| Celestial Tools | `✦ CELESTIAL TOOLS` | *The Cosmos Awaits* | Ancient intelligence for your modern life |
| Solfeggio Studio | `✦ THE FREQUENCY STUDIO` | *Nine Tones. Nine Doors.* | Each Solfeggio frequency unlocks something different. Choose your key. |

### 10.3 Today's Practice
```
Eyebrow:    ✦ YOUR PRACTICE TODAY
H2:         "The light is already within you."
Body:       Day {n} of your journey. You're building something real.
Pills:      Draw Today's Card ✦  /  Morning Affirmation ✨  /  Enter Sound Temple 🔮
```

### 10.4 Daily Tarot
```
Label:      ✦ DAILY TAROT PULL
H3:         The Veil Is Thin at Dawn
Body:       Reveal your card for today. Let the image speak before the words do.
Button A:   Reveal Today's Card ✦
Button B:   Read Full Interpretation →
Caption:    Yesterday · {previousCard}
```

### 10.5 Natal Chart
```
Label:      ✦ YOUR NATAL CHART
H3:         Your Celestial Blueprint
Body:       Every planet was exactly where it needed to be the moment you arrived.
            This is what it means.

Empty state:
  Inputs:   Date of birth · Time of birth · City of birth
  Button:   Generate My Chart ✦
  Note:     ✦ Your data is private and never shared.

Loaded state:
  Pills:    ☀️ Sun in {sign}  /  🌙 Moon in {sign}  /  ↑ Rising {sign}
  Reading:  Your chart reveals a soul built for transformation. The Scorpio Sun seeks depth;
            the Pisces Moon feels everything; Leo rising presents it all with impossible grace.
  Button:   Read Full Interpretation →
```

### 10.6 Solfeggio Frequencies

| Hz | Name | Tagline |
|---|---|---|
| 174 | Foundation | Ground your energy |
| 285 | Restoration | Recharge what's depleted |
| 396 | Liberation | Release what no longer serves |
| 417 | Transformation | Break old patterns |
| 528 | Love | Open the heart. Heal. |
| 639 | Connection | Harmonize relationships |
| 741 | Intuition | Sharpen your inner voice |
| 852 | Return | Come back to spiritual order |
| 963 | Oneness | Dissolve into the infinite |

### 10.7 Navigation Labels
```
Home  ·  Spiritual Guides  ·  Audiobooks  ·  Affirmations  ·  Sound Temple  ·  Celestial Tools
My Profile  ·  Settings
```

### 10.8 Member Badge
`✦ LUMZEN MEMBER` — Cinzel 10px, uppercase, letter-spacing 0.15em, gold.

### 10.9 Empty States
```
No tarot history:      Your readings will live here. Draw your first card to begin.
No audiobook progress: Your library awaits. Choose a title to start listening.
No affirmation streak: Day one begins the moment you decide. Start now.
No natal chart:        Your chart is written in the sky. Let's find it together.
No guides read:        The wisdom is waiting. Begin with what calls to you.
```

### 10.10 Sample Member Profile (default placeholder)
```javascript
{
  name: "Sarah",
  dayStreak: 14,
  totalDays: 30,
  sunSign: "Scorpio",
  moonSign: "Pisces",
  rising: "Leo",
}
```

---

## 11. ASSET SPECIFICATIONS

### 11.1 Favicon & App Icons

| File | Size | Use |
|---|---|---|
| `public/icon.svg` | vector | Primary favicon (modern browsers) |
| `public/icon-dark-32x32.png` | 32×32 | Dark-mode fallback favicon |
| `public/icon-light-32x32.png` | 32×32 | Light-mode fallback favicon |
| `public/apple-icon.png` | 180×180 | iOS home-screen icon |

Icon design: gold `✦` 8-pointed star on dark `#06060f` background, with a subtle outer glow.

### 11.2 Open Graph & Social

```
og:title         LumZen — Where Light Meets Stillness
og:description   Your daily spiritual practice platform — tarot, natal charts, affirmations,
                 meditation, sound healing and sacred audiobooks in one place.
og:image         /og-image.png  (1200×630)
og:type          website
twitter:card     summary_large_image
theme-color      #06060f
```

OG image design spec: dark cosmic background with `✦ LumZen` brand mark, tagline in Cormorant italic, subtle nebula gradient, gold accents.

### 11.3 Logo Variants

| Variant | Use |
|---|---|
| `✦ LumZen` horizontal (gold on dark) | Default, headers, dashboards |
| `✦ LumZen` horizontal (gold on cream) | Marketing emails, light-mode landing pages |
| `✦` glyph only (gold) | Favicon, social avatar |
| `✦ LumZen — Where Light Meets Stillness` stacked | Full lockup, hero sections, splash screens |

---

## 12. IMPLEMENTATION CHECKLIST

When implementing any new LumZen page or component, verify:

- [ ] Background is `#06060f`, never pure black
- [ ] Text uses `#f0eff8` (primary) / `#8f8daa` (secondary) / `#4a4866` (muted), never pure white
- [ ] Cormorant for headings, Jost for body, Cinzel for labels (uppercase only), JetBrains Mono for numbers only
- [ ] Section labels use the `✦ LABEL` pattern in Cinzel uppercase with `tracking-[0.2em]`
- [ ] Pillar accent colors are not mixed across pillars
- [ ] All gold CTAs end with the `✦` glyph
- [ ] Hover states use `translateY(-6px)` lift + accent-color glow shadow
- [ ] No exclamation marks anywhere in copy
- [ ] No banned vocabulary (see §2.3)
- [ ] Star field, nebula, and lum-orb are present on full pages
- [ ] Mobile breakpoint is `md:` (768px) — sidebar collapses to bottom nav
- [ ] All icons from `lucide-react` (UI) or `components/mystical-icons.tsx` (content)
- [ ] Time-based greeting copy matches §2.6
- [ ] Animation easings are `ease-in-out` or `ease-out`, never `linear` for UI
- [ ] Sticky header uses `backdrop-filter: blur(20px)` and gold border-bottom at 0.10 opacity
- [ ] Aria labels on all interactive elements
- [ ] Focus rings in `#c4a35a`

---

*LumZen Brand & Design System — Version 1.0 — May 18, 2026*
*Source files: lumzen.co · Color: #06060f · Light: #c4a35a · Always Cormorant + Cinzel + Jost + JetBrains Mono*
