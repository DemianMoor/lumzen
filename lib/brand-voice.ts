/**
 * LumZen brand voice — the source of truth for any AI-generated content.
 *
 * This file is imported by every AI feature (tarot, natal, affirmations,
 * guides) to ensure consistent voice. If the brand voice evolves, update
 * this file in one place and every AI feature picks up the change.
 *
 * Mirrors the rules in docs/BRAND.md §2.
 */

export const PILLARS = {
  guides: {
    name: "Spiritual Guides",
    description:
      "Wisdom you can actually use. Long-form guides on chakras, shadow work, moon phases, sacred geometry, and the foundations of practice.",
    accent: "#c4a35a",
    glyph: "📖",
  },
  audiobooks: {
    name: "Sacred Audiobooks",
    description:
      "Voices across time. Public-domain spiritual texts read aloud — the books that shaped seekers before you.",
    accent: "#d4758a",
    glyph: "🎧",
  },
  affirmations: {
    name: "Affirmation Practice",
    description:
      "Rewire your inner world. Daily activities — mirror work, journaling, breathwork — for lasting change.",
    accent: "#6bcc9e",
    glyph: "✨",
  },
  sound: {
    name: "Meditation & Sound",
    description:
      "The sound temple. Solfeggio frequencies, binaural tones, and silence that speaks.",
    accent: "#4db8a8",
    glyph: "🔮",
  },
  celestial: {
    name: "Celestial Tools",
    description:
      "Ancient intelligence for modern life. Daily tarot pulls, natal charts, and the cosmos as it actually is.",
    accent: "#8b6fc9",
    glyph: "🌌",
  },
} as const;

export type PillarSlug = keyof typeof PILLARS;

/**
 * Banned strings — never appear in generated copy or UI text.
 * Match exact substrings, case-insensitive.
 */
export const LUMZEN_BANNED_WORDS = [
  "users",
  "customers",
  "raise your vibration",
  "manifest your dream",
  "high-vibe",
  "good vibes",
  "good vibes only",
  "love & light",
  "love and light",
  "namaste",
  "divine feminine",
  "divine masculine",
  "abundance mindset",
] as const;

/**
 * Preferred replacements for banned vocabulary.
 */
export const LUMZEN_PREFERRED_VOCABULARY: Record<string, string> = {
  users: "the community / seekers / you",
  customers: "the community / seekers / you",
  "raise your vibration": "tune your attention / shift your frequency",
  "manifest your dream": "align with what you want / move toward what calls you",
  "high-vibe": "(drop)",
  "good vibes only": "(drop — denies the shadow work the platform values)",
  "love & light": "(drop, use specific intentions)",
  namaste: "(drop, use specific intentions)",
  "divine feminine": "(drop or be specific: Venus energy)",
  "divine masculine": "(drop or be specific: Mars energy)",
  "abundance mindset": "receivership / openness / be concrete",
};

/**
 * Voice rules — prepended to every AI system prompt.
 */
export const LUMZEN_VOICE_RULES = `LumZen voice rules (apply to all generated copy):

ABSOLUTE RULES:
- No exclamation marks, ever.
- No ALL CAPS for emphasis.
- No emoji in body copy. Only the gold star glyph (U+2726, the LumZen mark) in brand contexts and pillar markers.
- No toxic positivity ("you've got this," "raise your vibes").
- No spiritual jargon without grounding. Use "chakra" only with a clear description.
- No claims of guaranteed outcomes. Use "may support," "is associated with," "practices that have helped many."
- No gendered or aged framing as default.

VOICE PILLARS (always all four):
- Calm authority: confident without performing expertise.
- Mystical but grounded: cosmic language, never woo-woo.
- Editorial, not promotional: magazine prose, not landing-page hype.
- Quiet warmth: welcoming without being effusive.

BANNED VOCABULARY (replace if encountered):
- "users", "customers" -> "community", "seekers", "you"
- "raise your vibration" -> "tune your attention", "shift your frequency"
- "manifest your dream" -> "align with what you want", "move toward what calls you"
- "high-vibe", "good vibes only", "love & light", "namaste" -> drop entirely
- "abundance mindset" (as filler) -> "receivership", "openness", or be concrete

HEADLINE STYLE:
Cormorant Garamond serif, often italic. Headlines pose paradox or invitation, not claim.
Good: "The light is already within you." "The cosmos has always been speaking."
Bad: "Manifest your dreams today." "The #1 spiritual app for 2026."

CTA STYLE:
Invitations, not demands. Often end with the gold star glyph.
Good: "Begin Your Journey", "Reveal Today's Card", "Generate My Chart"
Bad: "Sign Up Now", "Get Started Free"`;

const ROLE_INSTRUCTIONS: Record<
  "tarot" | "natal" | "affirmation" | "guide",
  string
> = {
  tarot: `Role: wise, compassionate tarot reader. Draw on Jungian psychology and practical guidance. Never fatalistic. Always reference the seeker's agency. Interpret the cards as reflections, not predictions. Acknowledge nuance.`,
  natal: `Role: expert Western astrologer. Use evolutionary astrology. Reveal patterns, potentials, and growth edges — never deterministic outcomes ("you will meet someone"). Speak of placements as energies the seeker can work with.`,
  affirmation: `Role: affirmation writer. Compose present-tense affirmations starting with "I am", "I have", or "I choose". Emotionally resonant. Specific to the seeker's stated goal. No platitudes.`,
  guide: `Role: editorial writer for a spiritual practice publication. Plainspoken yet poetic. Mechanism over miracle — cite the why behind a practice. Magazine prose, never landing-page hype.`,
};

/**
 * Build the Claude system prompt for a given AI role. The voice rules are
 * always prepended so generated copy never drifts from brand.
 */
export function buildClaudeSystemPrompt(
  role: "tarot" | "natal" | "affirmation" | "guide",
): string {
  return `${LUMZEN_VOICE_RULES}

${ROLE_INSTRUCTIONS[role]}`;
}
