"use client";

import { useEffect, useState } from "react";
import { TarotCard } from "@/components/tarot-card";
import { useT } from "@/lib/i18n/client";
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

const SPREAD_OPTIONS: { value: SpreadKind; labelKey: string; descriptionKey: string }[] = [
  { value: "three", labelKey: "tarot.spread.three.label", descriptionKey: "tarot.spread.three.description" },
  { value: "yes_no", labelKey: "tarot.spread.yes_no.label", descriptionKey: "tarot.spread.yes_no.description" },
  { value: "love", labelKey: "tarot.spread.love.label", descriptionKey: "tarot.spread.love.description" },
  { value: "career", labelKey: "tarot.spread.career.label", descriptionKey: "tarot.spread.career.description" },
  { value: "celtic_cross", labelKey: "tarot.spread.celtic_cross.label", descriptionKey: "tarot.spread.celtic_cross.description" },
];

export function TarotClient() {
  const t = useT();
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [interpretingDaily, setInterpretingDaily] = useState(false);
  const [dailyInterpretation, setDailyInterpretation] = useState<string | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);

  const [spread, setSpread] = useState<SpreadKind>("three");
  const [question, setQuestion] = useState("");
  const [spreadResult, setSpreadResult] = useState<SpreadResponse | null>(null);
  const [drawingSpread, setDrawingSpread] = useState(false);
  const [interpretingSpread, setInterpretingSpread] = useState(false);
  const [spreadInterpretation, setSpreadInterpretation] = useState<string | null>(null);
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
        setDailyInterpretation(data.aiInterpretation);
      } catch (err) {
        if (cancelled) return;
        setDailyError(err instanceof Error ? err.message : t("tarot.daily.default_error"));
      } finally {
        if (!cancelled) setLoadingDaily(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  async function readInterpretation() {
    if (!daily) return;
    setInterpretingDaily(true);
    try {
      const res = await fetch("/api/tarot/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: daily.readingId }),
      });
      const data = (await res.json()) as { interpretation?: string; error?: string };
      if (data.interpretation) {
        setDailyInterpretation(data.interpretation);
        await fetch("/api/practices/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "tarot" }),
        });
      } else {
        setDailyInterpretation(data.error ?? t("tarot.daily.interpretation_unavailable"));
      }
    } finally {
      setInterpretingDaily(false);
    }
  }

  async function drawSpread() {
    setDrawingSpread(true);
    setSpreadError(null);
    setSpreadResult(null);
    setSpreadInterpretation(null);
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
      setSpreadError(err instanceof Error ? err.message : t("tarot.spread.draw_failed"));
    } finally {
      setDrawingSpread(false);
    }
  }

  async function interpretSpread() {
    if (!spreadResult) return;
    setInterpretingSpread(true);
    try {
      const res = await fetch("/api/tarot/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: spreadResult.readingId }),
      });
      const data = (await res.json()) as { interpretation?: string; error?: string };
      setSpreadInterpretation(data.interpretation ?? data.error ?? "");
      if (data.interpretation) {
        await fetch("/api/practices/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "tarot" }),
        });
      }
    } finally {
      setInterpretingSpread(false);
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
            {t("tarot.daily.eyebrow")}
          </p>
          <p className="font-serif italic text-[#8f8daa]">
            {revealed ? t("tarot.daily.revealed_subtitle") : t("tarot.daily.tap_to_reveal")}
          </p>
        </header>

        <div className="flex justify-center mb-6">
          {loadingDaily ? (
            <div className="w-[160px] h-[260px] rounded-lg flex items-center justify-center font-serif italic text-[#8f8daa]">
              {t("tarot.daily.drawing")}
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
              {dailyError ?? t("tarot.daily.deck_not_seeded")}
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
            {dailyInterpretation ? (
              <div className="mt-6 text-left">
                <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-2">
                  {t("tarot.daily.full_reading_label")}
                </p>
                <div className="font-serif text-[#f0eff8] leading-relaxed whitespace-pre-wrap">
                  {dailyInterpretation}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={readInterpretation}
                disabled={interpretingDaily}
                className="mt-4 px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
              >
                {interpretingDaily ? t("tarot.daily.composing") : t("tarot.daily.read_full_interpretation_cta")}
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
            {t("tarot.spread.section_eyebrow")}
          </p>
          <p className="font-serif italic text-[#8f8daa]">
            {t("tarot.spread.section_intro")}
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
              <p className="font-serif italic text-[#f0eff8]">{t(opt.labelKey)}</p>
              <p className="font-sans text-xs text-[#8f8daa] mt-1">{t(opt.descriptionKey)}</p>
            </button>
          ))}
        </div>

        <label htmlFor="tarot-question" className="block font-sans text-xs text-[#8f8daa] mb-2">
          {t("tarot.spread.question_label")}
        </label>
        <input
          id="tarot-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("tarot.spread.question_placeholder")}
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] transition-all mb-4"
        />

        <button
          type="button"
          onClick={drawSpread}
          disabled={drawingSpread}
          className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
        >
          {drawingSpread ? t("tarot.spread.drawing") : t("tarot.spread.draw_cta")}
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
            {spreadInterpretation ? (
              <div className="text-left max-w-2xl mx-auto">
                <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-2">
                  {t("tarot.spread.reading_label")}
                </p>
                <div className="font-serif text-[#f0eff8] leading-relaxed whitespace-pre-wrap">
                  {spreadInterpretation}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  type="button"
                  onClick={interpretSpread}
                  disabled={interpretingSpread}
                  className="px-6 py-3 rounded-full border font-sans text-sm text-[#f0eff8] hover:bg-[rgba(196,163,90,0.08)] transition-all disabled:opacity-60"
                  style={{ borderColor: "rgba(196,163,90,0.4)" }}
                >
                  {interpretingSpread ? t("tarot.spread.composing") : t("tarot.spread.read_spread_cta")}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
