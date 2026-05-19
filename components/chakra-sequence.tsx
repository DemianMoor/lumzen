"use client";

import { useEffect, useRef, useState } from "react";
import { CHAKRA_FREQUENCIES, playFrequency, stopAll } from "@/lib/audio/solfeggio";

type Affirmation = {
  id: string;
  text: string;
  category: string;
  chakra: string | null;
};

const CHAKRA_ORDER = [
  { key: "root", label: "Root", color: "#d4758a", category: "chakra_root" },
  { key: "sacral", label: "Sacral", color: "#c4a35a", category: "chakra_sacral" },
  { key: "solar_plexus", label: "Solar plexus", color: "#6bcc9e", category: "chakra_solar" },
  { key: "heart", label: "Heart", color: "#4db8a8", category: "chakra_heart" },
  { key: "throat", label: "Throat", color: "#6b9fd4", category: "chakra_throat" },
  { key: "third_eye", label: "Third eye", color: "#8b6fc9", category: "chakra_third_eye" },
  { key: "crown", label: "Crown", color: "#f0eff8", category: "chakra_crown" },
];

const STEP_DURATION_MS = 18000;

export function ChakraSequence({
  affirmations,
  onComplete,
}: {
  affirmations: Affirmation[];
  onComplete: () => void;
}) {
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
          Seven chakras, seven affirmations, seven Solfeggio tones. About two
          and a half minutes. Sit comfortably. Stop whenever you want to.
        </p>
        <button
          type="button"
          onClick={start}
          className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
        >
          Begin the sequence ✦
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
          {current?.label}
        </p>
        <p className="font-serif italic text-2xl md:text-3xl text-[#f0eff8] max-w-2xl mx-auto leading-relaxed">
          {affirmation?.text ?? "Breathe."}
        </p>
        <p className="mt-4 font-mono text-xs text-[#8f8daa]">
          {CHAKRA_FREQUENCIES[current?.key ?? "root"]} Hz
        </p>
      </div>

      <button
        type="button"
        onClick={stop}
        className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a]"
      >
        End early
      </button>
    </div>
  );
}
