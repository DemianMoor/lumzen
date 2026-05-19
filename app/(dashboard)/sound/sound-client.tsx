"use client";

import { useEffect, useRef, useState } from "react";
import { playFrequency, stopAll } from "@/lib/audio/solfeggio";

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

const CATEGORY_LABELS: Record<string, string> = {
  solfeggio: "Healing frequencies",
  tibetan_bowls: "Tibetan bowls",
  nature: "Nature and earth",
  deep_space: "Deep space",
  breathwork: "Breath",
  sleep_delta: "Sleep and delta",
  chanting: "Chanting and mantra",
};

export function SoundClient({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [active, setActive] = useState<Track | null>(null);

  useEffect(() => () => stopAll(), []);

  function play(track: Track) {
    if (active?.id === track.id) {
      stop();
      return;
    }
    stop();
    if (track.stream_url.startsWith("lumzen://solfeggio/")) {
      const hz = parseInt(track.stream_url.replace("lumzen://solfeggio/", ""), 10);
      if (Number.isFinite(hz)) {
        void playFrequency(hz, (track.duration_seconds ?? 600) * 1000);
        setActive(track);
        markPracticeMeditation();
      }
    } else if (track.stream_url.startsWith("lumzen://")) {
      // Other sentinel kinds (binaural, breath) — not synthesized in this stub.
      setActive(track);
    } else {
      const el = new Audio(track.stream_url);
      el.crossOrigin = "anonymous";
      void el.play().catch(() => undefined);
      audioRef.current = el;
      setActive(track);
      markPracticeMeditation();
    }
  }

  function stop() {
    stopAll();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setActive(null);
  }

  async function markPracticeMeditation() {
    await fetch("/api/practices/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "meditation" }),
    });
  }

  const grouped = tracks.reduce<Record<string, Track[]>>((acc, t) => {
    (acc[t.category] = acc[t.category] ?? []).push(t);
    return acc;
  }, {});

  if (tracks.length === 0) {
    return (
      <p className="text-center font-serif italic text-[#8f8daa]">
        The wisdom is waiting. Begin with what calls to you.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {active && (
        <div
          className="sticky top-[68px] z-20 rounded-2xl p-4 border flex items-center justify-between gap-4"
          style={{
            background: "rgba(6,6,15,0.92)",
            borderColor: "rgba(77,184,168,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#4db8a8] mb-1">
              Now playing
            </p>
            <p className="font-serif italic text-[#f0eff8]">{active.title}</p>
          </div>
          <button
            type="button"
            onClick={stop}
            className="rounded-full border px-4 py-2 font-sans text-xs text-[#f0eff8] hover:bg-[rgba(255,255,255,0.05)]"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            Stop
          </button>
        </div>
      )}

      {Object.entries(grouped).map(([category, list]) => (
        <section key={category}>
          <h2 className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((track) => {
              const isActive = active?.id === track.id;
              return (
                <li key={track.id}>
                  <button
                    type="button"
                    onClick={() => play(track)}
                    className="w-full text-left rounded-xl border p-4 transition-all hover:-translate-y-0.5"
                    style={{
                      background: isActive
                        ? "rgba(77,184,168,0.08)"
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
                        ? ` · ${Math.round(track.duration_seconds / 60)} min`
                        : ""}
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
