"use client";

import { useAudioPlayer, type AudioSource } from "@/lib/audio-player-context";
import { useT } from "@/lib/i18n/client";

type Track = {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  duration_seconds: number | null;
  stream_url: string;
  frequency_hz: number | null;
  license: string | null;
  tags: string[];
};

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  solfeggio: "sound.category.solfeggio",
  tibetan_bowls: "sound.category.tibetan_bowls",
  nature: "sound.category.nature",
  deep_space: "sound.category.deep_space",
  breathwork: "sound.category.breathwork",
  sleep_delta: "sound.category.sleep_delta",
  chanting: "sound.category.chanting",
};

function trackSource(track: Track): AudioSource | null {
  if (track.stream_url.startsWith("lumzen://solfeggio/")) {
    const hz = parseInt(track.stream_url.replace("lumzen://solfeggio/", ""), 10);
    return Number.isFinite(hz) ? { kind: "frequency", hz } : null;
  }
  if (track.stream_url.startsWith("lumzen://")) {
    return null;
  }
  return { kind: "url", url: track.stream_url };
}

export function SoundClient({ tracks }: { tracks: Track[] }) {
  const t = useT();
  const { track: active, play, stop } = useAudioPlayer();

  function categoryLabel(category: string): string {
    const key = CATEGORY_LABEL_KEYS[category];
    return key ? t(key) : category;
  }

  function handleSelect(track: Track) {
    if (active?.id === track.id) {
      stop();
      return;
    }
    const source = trackSource(track);
    if (!source) return;
    play({
      id: track.id,
      title: track.title,
      subtitle: track.frequency_hz
        ? `${track.frequency_hz} Hz · ${categoryLabel(track.category)}`
        : categoryLabel(track.category),
      durationSeconds: track.duration_seconds ?? 600,
      source,
      onFirstPlay: () => {
        void fetch("/api/practices/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "meditation" }),
        });
      },
    });
  }

  const grouped = tracks.reduce<Record<string, Track[]>>((acc, t) => {
    (acc[t.category] = acc[t.category] ?? []).push(t);
    return acc;
  }, {});

  if (tracks.length === 0) {
    return (
      <p className="text-center font-serif italic text-[#8f8daa]">
        {t("sound.page.empty_state")}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([category, list]) => (
        <section key={category}>
          <h2 className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
            {categoryLabel(category)}
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((track) => {
              const isActive = active?.id === track.id;
              const unsupported = trackSource(track) === null;
              return (
                <li key={track.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(track)}
                    disabled={unsupported}
                    className="w-full text-left rounded-xl border p-4 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{
                      background: isActive
                        ? "rgba(77,184,168,0.10)"
                        : "rgba(26,26,53,0.5)",
                      borderColor: isActive
                        ? "rgba(77,184,168,0.5)"
                        : "rgba(196,163,90,0.12)",
                    }}
                  >
                    <p className="font-serif italic text-[#f0eff8] mb-1">
                      {track.title}
                    </p>
                    <p className="font-sans text-[10px] text-[#8f8daa] uppercase tracking-[0.15em]">
                      {track.frequency_hz
                        ? `${track.frequency_hz} Hz`
                        : track.subcategory ?? ""}
                      {track.duration_seconds
                        ? ` · ${Math.round(track.duration_seconds / 60)} ${t("sound.track.minutes_suffix")}`
                        : ""}
                      {unsupported ? ` · ${t("sound.track.coming_soon_suffix")}` : ""}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
