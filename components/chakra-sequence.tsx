"use client";

import { useEffect, useRef, useState } from "react";
import { CHAKRA_FREQUENCIES, playFrequency, stopAll } from "@/lib/audio/solfeggio";
import { useT } from "@/lib/i18n/client";

type Affirmation = {
  id: string;
  text: string;
  category: string;
  chakra: string | null;
};

const CHAKRA_ORDER = [
  { key: "root", labelKey: "affirmations.chakra.chakra_root.label", color: "#d4758a", category: "chakra_root" },
  { key: "sacral", labelKey: "affirmations.chakra.chakra_sacral.label", color: "#c4a35a", category: "chakra_sacral" },
  { key: "solar_plexus", labelKey: "affirmations.chakra.chakra_solar.label", color: "#6bcc9e", category: "chakra_solar" },
  { key: "heart", labelKey: "affirmations.chakra.chakra_heart.label", color: "#4db8a8", category: "chakra_heart" },
  { key: "throat", labelKey: "affirmations.chakra.chakra_throat.label", color: "#6b9fd4", category: "chakra_throat" },
  { key: "third_eye", labelKey: "affirmations.chakra.chakra_third_eye.label", color: "#8b6fc9", category: "chakra_third_eye" },
  { key: "crown", labelKey: "affirmations.chakra.chakra_crown.label", color: "#f0eff8", category: "chakra_crown" },
];

const STEP_DURATION_MS = 18000;

export function ChakraSequence({
  affirmations,
  onComplete,
}: {
  affirmations: Affirmation[];
  onComplete: () => void;
}) {
  const t = useT();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    return () => {
      stopAll();
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function pickAffirmation(category: string): Affirmation | null {
    const matches = affirmations.filter((a) => a.category === category);
    if (matches.length === 0) return null;
    return matches[Math.floor(Math.random() * matches.length)];
  }

  function scheduleStep(idx: number) {
    if (idx >= CHAKRA_ORDER.length) {
      setRunning(false);
      stopAll();
      onComplete();
      return;
    }
    const chakra = CHAKRA_ORDER[idx];
    const hz = CHAKRA_FREQUENCIES[chakra.key];
    void playFrequency(hz, STEP_DURATION_MS - 500);
    timerRef.current = window.setTimeout(() => {
      stepRef.current = idx + 1;
      setStep(idx + 1);
      scheduleStep(idx + 1);
    }, STEP_DURATION_MS);
  }

  function start() {
    setStep(0);
    stepRef.current = 0;
    setRunning(true);
    scheduleStep(0);
  }

  function stop() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    stopAll();
    setRunning(false);
  }

  const current = CHAKRA_ORDER[step];
  const affirmation = current ? pickAffirmation(current.category) : null;

  if (!running) {
    return (
      <div className="text-center space-y-6">
        <p className="font-serif italic text-[#8f8daa] max-w-xl mx-auto">
          {t("affirmations.activity.chakra_sequence.intro")}
        </p>
        <button
          type="button"
          onClick={start}
          className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
        >
          {t("affirmations.activity.chakra_sequence.begin_cta")}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center gap-2">
        {CHAKRA_ORDER.map((c, i) => (
          <span
            key={c.key}
            className="block h-2 rounded-full transition-all"
            style={{
              background: i <= step ? c.color : "rgba(255,255,255,0.08)",
              width: i === step ? 28 : 16,
            }}
          />
        ))}
      </div>

      <div>
        <p
          className="font-display text-[11px] tracking-[0.2em] uppercase mb-2"
          style={{ color: current?.color ?? "#c4a35a" }}
        >
          {current ? t(current.labelKey) : ""}
        </p>
        <p className="font-serif italic text-2xl md:text-3xl text-[#f0eff8] max-w-2xl mx-auto leading-relaxed">
          {affirmation?.text ?? t("affirmations.activity.chakra_sequence.default_phrase")}
        </p>
        <p className="mt-4 font-mono text-xs text-[#8f8daa]">
          {CHAKRA_FREQUENCIES[current?.key ?? "root"]} Hz
        </p>
      </div>

      <button
        type="button"
        onClick={stop}
        className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(196,163,90,0.25)] bg-[rgba(196,163,90,0.06)] px-4 py-2 font-sans text-xs text-[#f0eff8] hover:bg-[rgba(196,163,90,0.14)] hover:border-[rgba(196,163,90,0.45)] hover:text-[#c4a35a] transition-all"
      >
        {t("affirmations.activity.chakra_sequence.end_early")}
      </button>
    </div>
  );
}
