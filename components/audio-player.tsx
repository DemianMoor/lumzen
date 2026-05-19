"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Timer,
  Volume2,
  Maximize2,
} from "lucide-react";

type AudioPlayerProps = {
  title?: string;
  subtitle?: string;
  durationSeconds?: number;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Sticky bottom audio player. Stage 2 W1: state is local — no real
 * audio source yet. The component exposes the full UI so W3 can wire
 * track data and playback in without restyling.
 */
export function AudioPlayer({
  title = "Sound Temple",
  subtitle = "Choose a track to begin",
  durationSeconds = 0,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing || durationSeconds <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setPosition((p) => {
        if (p >= durationSeconds) {
          setPlaying(false);
          return durationSeconds;
        }
        return p + 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, durationSeconds]);

  const progressPercent =
    durationSeconds > 0 ? (position / durationSeconds) * 100 : 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 md:pl-[68px]"
      style={{
        background: "rgba(6, 6, 15, 0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(196, 163, 90, 0.12)",
      }}
      aria-label="Audio player"
    >
      <div className="h-[72px] px-4 md:px-6 flex items-center gap-4">
        <div className="flex items-center gap-3 min-w-0 md:w-64">
          <div
            className="size-10 rounded-md flex items-center justify-center font-display text-sm shrink-0"
            style={{
              background: "rgba(196, 163, 90, 0.10)",
              border: "1px solid rgba(196, 163, 90, 0.20)",
              color: "#c4a35a",
            }}
            aria-hidden="true"
          >
            ✦
          </div>
          <div className="min-w-0">
            <p className="font-serif text-sm text-[#f0eff8] truncate">
              {title}
            </p>
            <p className="font-sans text-[11px] text-[#8f8daa] truncate">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((p) => !p)}
              className="size-10 rounded-full flex items-center justify-center text-[#06060f] transition-transform hover:scale-105"
              style={{ background: "#c4a35a" }}
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              type="button"
              aria-label="Next"
              className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
            >
              <SkipForward size={18} />
            </button>
          </div>
          <div className="hidden md:flex w-full max-w-md items-center gap-3 mt-1.5">
            <span className="font-mono text-[10px] text-[#4a4866] tabular-nums">
              {formatTime(position)}
            </span>
            <div
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={durationSeconds}
              aria-valuenow={position}
            >
              <div
                className="h-full"
                style={{
                  width: `${progressPercent}%`,
                  background: "#c4a35a",
                  transition: "width 200ms linear",
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#4a4866] tabular-nums">
              {formatTime(durationSeconds)}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <button
            type="button"
            aria-label="Sleep timer"
            className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
          >
            <Timer size={18} />
          </button>
          <button
            type="button"
            aria-label="Volume"
            className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
          >
            <Volume2 size={18} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume level"
            className="w-20 accent-[#c4a35a]"
          />
          <button
            type="button"
            aria-label="Expand player"
            className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
