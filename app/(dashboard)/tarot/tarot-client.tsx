"use client";

import { useEffect, useState } from "react";
import { TarotCard } from "@/components/tarot-card";
import type { SpreadKind } from "@/lib/tarot/client";

type DailyResponse = {
  readingId: string;
  date: string;
  card: {
    id: string;
    name: string;
    image_url: string | null;
    reversed: boolean;
    meaning_upright: string;
    meaning_reversed: string;
    description: string | null;
  };
  aiInterpretation: string | null;
};

type SpreadCard = {
  position: string;
  card: {
    id: string;
    name: string;
    image_url: string | null;
    reversed: boolean;
    meaning_upright: string;
    meaning_reversed: string;
  };
};

type SpreadResponse = {
  readingId: string;
  spread: SpreadKind;
  cards: SpreadCard[];
};

const SPREAD_OPTIONS: { value: SpreadKind; label: string; description: string }[] = [
  { value: "three", label: "Three cards", description: "Past · Present · Future" },
  { value: "yes_no", label: "Yes or no", description: "A single card pulled to focus the question" },
  { value: "love", label: "Love", description: "You · The other · Between you" },
  { value: "career", label: "Career", description: "Where you stand · The opening · What it asks" },
  { value: "celtic_cross", label: "Celtic Cross", description: "Ten positions, the long mirror" },
];

export function TarotClient() {
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [interpreting, setInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);

  const [spread, setSpread] = useState<SpreadKind>("three");
  const [question, setQuestion] = useState("");
  const [spreadResult, setSpreadResult] = useState<SpreadResponse | null>(null);
  const [drawingSpread, setDrawingSpread] = useState(false);
  const [spreadError, setSpreadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/tarot/daily", { cache: "no-store" });
        if (!res.ok) {
          throw new Error((await res.json().catch(() => ({}))).error || "failed");
        }
        const data = (await res.json()) as DailyResponse;
        if (cancelled) return;
        setDaily(data);
        setInterpretation(data.aiInterpretation);
      } catch (err) {
        if (cancelled) return;
        setDailyError(err instanceof Error ? err.message : "Unable to load today's card.");
      } finally {
        if (!cancelled) setLoadingDaily(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function readInterpretation() {
    if (!daily) return;
    setInterpreting(true);
    try {
      const res = await fetch("/api/tarot/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: daily.readingId }),
      });
      const data = (await res.json()) as { interpretation?: string; error?: string };
      if (data.interpretation) {
        setInterpretation(data.interpretation);
        await fetch("/api/practices/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "tarot" }),
        });
      } else {
        setInterpretation(data.error ?? "The interpretation could not be composed.");
      }
    } finally {
      setInterpreting(false);
    }
  }

  async function drawSpread() {
    setDrawingSpread(true);
    setSpreadError(null);
    setSpreadResult(null);
    try {
      const res = await fetch("/api/tarot/spread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spread, question: question.trim() || undefined }),
      });
      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).error || "draw failed");
      }
      const data = (await res.json()) as SpreadResponse;
      setSpreadResult(data);
    } catch (err) {
      setSpreadError(err instanceof Error ? err.message : "The draw could not be made.");
    } finally {
      setDrawingSpread(false);
    }
  }

  async function interpretSpread() {
    if (!spreadResult) return;
    setInterpreting(true);
    try {
      const res = await fetch("/api/tarot/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: spreadResult.readingId }),
      });
      const data = (await res.json()) as { interpretation?: string; error?: string };
      setInterpretation(data.interpretation ?? data.error ?? "");
      if (data.interpretation) {
        await fetch("/api/practices/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "tarot" }),
        });
      }
    } finally {
      setInterpreting(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* Daily pull ------------------------------------------------------ */}
      <section
        className="rounded-2xl p-8 border"
        style={{
          background: "rgba(26,26,53,0.5)",
          borderColor: "rgba(196,163,90,0.15)",
        }}
      >
        <header className="text-center mb-6">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-2">
            Today's card
          </p>
          <p className="font-serif italic text-[#8f8daa]">
            {revealed ? "What the day is asking of you" : "Tap to reveal"}
          </p>
        </header>

        <div className="flex justify-center mb-6">
          {loadingDaily ? (
            <div className="w-[160px] h-[260px] rounded-lg flex items-center justify-center font-serif italic text-[#8f8daa]">
              Drawing...
            </div>
          ) : daily ? (
            <TarotCard
              name={daily.card.name}
              imageUrl={revealed ? daily.card.image_url : null}
              reversed={revealed ? daily.card.reversed : false}
              faceDown={!revealed}
              onFlip={() => setRevealed(true)}
            />
          ) : (
            <p className="font-serif italic text-[#8f8daa]">
              {dailyError ?? "The deck is not yet seeded."}
            </p>
          )}
        </div>

        {revealed && daily && (
          <div className="max-w-xl mx-auto text-center space-y-4">
            <p className="font-serif italic text-[#f0eff8]">
              {daily.card.reversed ? daily.card.meaning_reversed : daily.card.meaning_upright}
            </p>
            {daily.card.description && (
              <p className="font-sans text-sm text-[#8f8daa]">
                {daily.card.description}
              </p>
            )}
            {interpretation ? (
              <div className="mt-6 text-left">
                <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-2">
                  Full reading
                </p>
                <div className="font-serif text-[#f0eff8] leading-relaxed whitespace-pre-wrap">
                  {interpretation}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={readInterpretation}
                disabled={interpreting}
                className="mt-4 px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
              >
                {interpreting ? "Composing..." : "Read full interpretation ✦"}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Spread chooser ------------------------------------------------- */}
      <section
        className="rounded-2xl p-8 border"
        style={{
          background: "rgba(26,26,53,0.5)",
          borderColor: "rgba(196,163,90,0.15)",
        }}
      >
        <header className="mb-6">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-2">
            A wider draw
          </p>
          <p className="font-serif italic text-[#8f8daa]">
            Bring a question, or none. The cards will meet you at the threshold.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {SPREAD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSpread(opt.value)}
              className="text-left rounded-lg border p-4 transition-colors"
              style={{
                background:
                  spread === opt.value ? "rgba(196,163,90,0.08)" : "rgba(255,255,255,0.02)",
                borderColor:
                  spread === opt.value
                    ? "rgba(196,163,90,0.5)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              <p className="font-serif italic text-[#f0eff8]">{opt.label}</p>
              <p className="font-sans text-xs text-[#8f8daa] mt-1">{opt.description}</p>
            </button>
          ))}
        </div>

        <label htmlFor="tarot-question" className="block font-sans text-xs text-[#8f8daa] mb-2">
          Your question (optional)
        </label>
        <input
          id="tarot-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is asking to be looked at?"
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] transition-all mb-4"
        />

        <button
          type="button"
          onClick={drawSpread}
          disabled={drawingSpread}
          className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
        >
          {drawingSpread ? "Drawing..." : "Draw the spread ✦"}
        </button>

        {spreadError && (
          <p className="mt-4 font-sans text-sm text-[#ef4444]" role="alert">
            {spreadError}
          </p>
        )}

        {spreadResult && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap justify-center gap-6">
              {spreadResult.cards.map((c, i) => (
                <TarotCard
                  key={i}
                  name={c.card.name}
                  imageUrl={c.card.image_url}
                  reversed={c.card.reversed}
                  position={c.position}
                />
              ))}
            </div>
            {interpretation ? (
              <div className="text-left max-w-2xl mx-auto">
                <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-2">
                  Reading
                </p>
                <div className="font-serif text-[#f0eff8] leading-relaxed whitespace-pre-wrap">
                  {interpretation}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  type="button"
                  onClick={interpretSpread}
                  disabled={interpreting}
                  className="px-6 py-3 rounded-full border font-sans text-sm text-[#f0eff8] hover:bg-[rgba(196,163,90,0.08)] transition-all disabled:opacity-60"
                  style={{ borderColor: "rgba(196,163,90,0.4)" }}
                >
                  {interpreting ? "Composing..." : "Read this spread ✦"}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
