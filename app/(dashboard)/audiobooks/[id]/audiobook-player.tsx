"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";

type Chapter = {
  id: string;
  chapter_number: number;
  title: string | null;
  stream_url: string;
  duration_seconds: number | null;
};

export function AudiobookPlayer({
  bookId,
  initialChapterId,
  initialPosition,
}: {
  bookId: string;
  initialChapterId: string | null;
  initialPosition: number;
}) {
  const t = useT();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(initialChapterId);
  const audioRef = useRef<HTMLAudioElement>(null);
  const positionSaveRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/audiobooks/${bookId}/chapters`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { chapters: Chapter[]; error?: string };
        if (cancelled) return;
        setChapters(data.chapters ?? []);
        if (!activeId && data.chapters?.[0]) {
          setActiveId(data.chapters[0].id);
        }
        if (data.error) setError(data.error);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : t("audiobooks.player.chapters_load_error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [bookId, activeId, t]);

  const active = chapters.find((c) => c.id === activeId);

  useEffect(() => {
    if (!audioRef.current || !active) return;
    audioRef.current.src = active.stream_url;
    if (active.id === initialChapterId && initialPosition > 0) {
      audioRef.current.currentTime = initialPosition;
    }
  }, [active, initialChapterId, initialPosition]);

  function handleTimeUpdate() {
    if (!audioRef.current || !active) return;
    const now = Math.floor(audioRef.current.currentTime);
    if (now - positionSaveRef.current >= 10) {
      positionSaveRef.current = now;
      void saveProgress(bookId, active.id, now, false);
    }
  }

  function handleEnded() {
    if (!active) return;
    void saveProgress(bookId, active.id, 0, true);
    const idx = chapters.findIndex((c) => c.id === active.id);
    const next = chapters[idx + 1];
    if (next) {
      setActiveId(next.id);
    }
  }

  return (
    <section className="space-y-6">
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "rgba(26,26,53,0.5)",
          borderColor: "rgba(212,117,138,0.2)",
        }}
      >
        {active ? (
          <>
            <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#d4758a] mb-2">
              {t("audiobooks.player.now_playing")}
            </p>
            <p className="font-serif italic text-lg text-[#f0eff8] mb-3">
              {active.title || `${t("audiobooks.player.chapter_prefix")} ${active.chapter_number}`}
            </p>
            <audio
              ref={audioRef}
              controls
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              className="w-full"
            />
          </>
        ) : loading ? (
          <p className="font-serif italic text-[#8f8daa]">{t("audiobooks.player.loading_chapters")}</p>
        ) : (
          <p className="font-serif italic text-[#8f8daa]">
            {t("audiobooks.player.no_chapter_selected")}
          </p>
        )}
      </div>

      {error && (
        <p className="font-sans text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}

      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <button
              type="button"
              onClick={() => setActiveId(chapter.id)}
              className="w-full text-left rounded-lg border p-4 transition-colors hover:bg-[rgba(212,117,138,0.05)]"
              style={{
                background:
                  chapter.id === activeId ? "rgba(212,117,138,0.08)" : "transparent",
                borderColor:
                  chapter.id === activeId
                    ? "rgba(212,117,138,0.4)"
                    : "rgba(255,255,255,0.06)",
              }}
            >
              <p className="font-mono text-xs text-[#8f8daa] mb-1">
                {t("audiobooks.player.chapter_prefix")} {chapter.chapter_number}
                {chapter.duration_seconds
                  ? ` · ${formatDuration(chapter.duration_seconds)}`
                  : ""}
              </p>
              <p className="font-serif italic text-[#f0eff8]">
                {chapter.title || t("audiobooks.player.untitled_placeholder")}
              </p>
            </button>
          </li>
        ))}
        {!loading && chapters.length === 0 && (
          <li className="font-serif italic text-[#8f8daa]">
            {t("audiobooks.player.chapters_unavailable")}
          </li>
        )}
      </ul>
    </section>
  );
}

async function saveProgress(
  bookId: string,
  chapterId: string,
  position: number,
  completed: boolean,
): Promise<void> {
  await fetch("/api/audiobooks/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, chapterId, position, completed }),
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
