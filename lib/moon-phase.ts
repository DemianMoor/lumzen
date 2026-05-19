/**
 * Synodic moon phase helper.
 *
 * Returns the current lunar phase name and a glyph, computed from a
 * known new-moon epoch and the average synodic month. Accuracy is
 * within ~half a day — good enough for the dashboard header subtitle.
 */

const SYNODIC_DAYS = 29.530588853;
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0); // 2000-01-06 18:14 UTC

export type MoonPhase = {
  name: string;
  glyph: string;
  fraction: number;
};

export function moonPhaseFor(date: Date = new Date()): MoonPhase {
  const elapsedDays = (date.getTime() - NEW_MOON_EPOCH) / 86_400_000;
  const f = ((elapsedDays / SYNODIC_DAYS) % 1 + 1) % 1;

  if (f < 0.0625) return { name: "New Moon", glyph: "🌑", fraction: f };
  if (f < 0.1875) return { name: "Waxing Crescent", glyph: "🌒", fraction: f };
  if (f < 0.3125) return { name: "First Quarter", glyph: "🌓", fraction: f };
  if (f < 0.4375) return { name: "Waxing Gibbous", glyph: "🌔", fraction: f };
  if (f < 0.5625) return { name: "Full Moon", glyph: "🌕", fraction: f };
  if (f < 0.6875) return { name: "Waning Gibbous", glyph: "🌖", fraction: f };
  if (f < 0.8125) return { name: "Last Quarter", glyph: "🌗", fraction: f };
  if (f < 0.9375) return { name: "Waning Crescent", glyph: "🌘", fraction: f };
  return { name: "New Moon", glyph: "🌑", fraction: f };
}
