"use client";

import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useAudioPlayer } from "@/lib/audio-player-context";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer() {
  const {
    track,
    playing,
    position,
    volume,
    loading,
    toggle,
    stop,
    seek,
    setVolume,
  } = useAudioPlayer();

  if (!track) return null;

  const duration = track.durationSeconds || 0;
  const progressPercent =
    duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 md:pl-[68px]"
      style={{
        background: "rgba(6, 6, 15, 0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(196, 163, 90, 0.18)",
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
            <p className="font-serif italic text-sm text-[#f0eff8] truncate">
              {track.title}
            </p>
            <p className="font-sans text-[11px] text-[#8f8daa] truncate">
              {loading ? "Loading…" : track.subtitle ?? ""}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={toggle}
              disabled={loading}
              className="size-10 rounded-full flex items-center justify-center text-[#06060f] transition-transform hover:scale-105 disabled:opacity-60"
              style={{ background: "#c4a35a" }}
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              type="button"
              aria-label="Stop"
              onClick={stop}
              className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="hidden md:flex w-full max-w-md items-center gap-3 mt-1.5">
            <span className="font-mono text-[10px] text-[#4a4866] tabular-nums">
              {formatTime(position)}
            </span>
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 1}
              step={1}
              value={Math.min(position, duration)}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Seek"
              className="flex-1 accent-[#c4a35a]"
              style={{ background: "transparent" }}
            />
            <span className="font-mono text-[10px] text-[#4a4866] tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
          <div
            className="md:hidden w-full h-1 rounded-full overflow-hidden mt-1.5"
            style={{ background: "rgba(255,255,255,0.06)" }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={duration}
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
        </div>

        <div className="hidden md:flex items-center gap-1">
          <button
            type="button"
            aria-label={volume === 0 ? "Unmute" : "Mute"}
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
        </div>
      </div>
    </div>
  );
}
