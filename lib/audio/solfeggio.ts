/**
 * Solfeggio tone generator — pure Web Audio API.
 *
 * Generates the nine sacred Solfeggio frequencies (174–963 Hz) as
 * single sine tones. Used by the Sound Temple and by chakra-mapped
 * affirmation activities to play the matching frequency while the
 * seeker breathes through the practice.
 *
 * No samples, no fetches — every tone is synthesized in the browser.
 * Each tone fades in/out (50ms) to avoid clicks.
 */

export const SOLFEGGIO_FREQUENCIES = {
  174: { name: "Foundation", color: "#8b4513", tagline: "Ground your energy" },
  285: { name: "Restoration", color: "#4a7c59", tagline: "Recharge what's depleted" },
  396: { name: "Liberation", color: "#8b6fc9", tagline: "Release what no longer serves" },
  417: { name: "Transformation", color: "#d4758a", tagline: "Break old patterns" },
  528: { name: "Love", color: "#c4a35a", tagline: "Open the heart. Heal." },
  639: { name: "Connection", color: "#6bcc9e", tagline: "Harmonize relationships" },
  741: { name: "Intuition", color: "#6b9fd4", tagline: "Sharpen your inner voice" },
  852: { name: "Return", color: "#4db8a8", tagline: "Come back to spiritual order" },
  963: { name: "Oneness", color: "#9b8ec4", tagline: "Dissolve into the infinite" },
} as const;

export type SolfeggioHz = keyof typeof SOLFEGGIO_FREQUENCIES;

export const SOLFEGGIO_HZ_LIST: SolfeggioHz[] = [
  174, 285, 396, 417, 528, 639, 741, 852, 963,
];

/**
 * Chakra → Solfeggio frequency mapping. Used by chakra-sequence and
 * other chakra-tuned activities to pick the right tone for the moment.
 */
export const CHAKRA_FREQUENCIES: Record<string, number> = {
  root: 396,
  sacral: 417,
  solar_plexus: 528,
  heart: 639,
  throat: 741,
  third_eye: 852,
  crown: 963,
};

type ActiveTone = {
  oscillator: OscillatorNode;
  gain: GainNode;
  hz: number;
};

let audioContext: AudioContext | null = null;
const activeTones = new Map<number, ActiveTone>();

const FADE_SECONDS = 0.05;
const DEFAULT_VOLUME = 0.15;

function getContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("Solfeggio audio is only available in the browser.");
  }
  if (!audioContext || audioContext.state === "closed") {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioContext = new Ctor();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

/**
 * Play a single sine tone at `hz` for `durationMs`. If `durationMs` is
 * omitted the tone plays until `stopAll()` or `stopFrequency(hz)` is called.
 *
 * Calling `playFrequency` again with the same hz replaces the active tone.
 */
export function playFrequency(
  hz: number,
  durationMs?: number,
  volume = DEFAULT_VOLUME,
): void {
  if (hz <= 0) return;
  stopFrequency(hz);

  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(hz, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + FADE_SECONDS);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();

  activeTones.set(hz, { oscillator, gain, hz });

  if (durationMs && durationMs > 0) {
    const stopAt = ctx.currentTime + durationMs / 1000;
    gain.gain.setValueAtTime(volume, Math.max(ctx.currentTime, stopAt - FADE_SECONDS));
    gain.gain.linearRampToValueAtTime(0, stopAt);
    oscillator.stop(stopAt + 0.01);
    oscillator.onended = () => {
      activeTones.delete(hz);
    };
  }
}

/**
 * Stop a specific frequency if it's currently playing. Fades out smoothly.
 */
export function stopFrequency(hz: number): void {
  const tone = activeTones.get(hz);
  if (!tone) return;

  const ctx = getContext();
  const now = ctx.currentTime;
  tone.gain.gain.cancelScheduledValues(now);
  tone.gain.gain.setValueAtTime(tone.gain.gain.value, now);
  tone.gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
  tone.oscillator.stop(now + FADE_SECONDS + 0.01);
  activeTones.delete(hz);
}

/**
 * Stop every active tone immediately (with a short fade).
 */
export function stopAll(): void {
  for (const hz of Array.from(activeTones.keys())) {
    stopFrequency(hz);
  }
}

/**
 * True if a tone at `hz` is currently playing.
 */
export function isPlaying(hz: number): boolean {
  return activeTones.has(hz);
}

/**
 * List of currently active frequencies. Useful for UI state.
 */
export function activeFrequencies(): number[] {
  return Array.from(activeTones.keys());
}
