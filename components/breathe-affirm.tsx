"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";

type Affirmation = { id: string; text: string };

const PHASES = [
  { labelKey: "affirmations.activity.breathing.phase.inhale", duration: 4000 },
  { labelKey: "affirmations.activity.breathing.phase.hold", duration: 4000 },
  { labelKey: "affirmations.activity.breathing.phase.exhale", duration: 6000 },
];

const TOTAL_CYCLES = 6;

export function BreatheAffirm({
  affirmations,
  onComplete,
}: {
  affirmations: Affirmation[];
  onComplete: () => void;
}) {
  const t = useT();
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const cycleRef = useRef(0);
  const phaseRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function tick() {
    const nextPhase = (phaseRef.current + 1) % PHASES.length;
    phaseRef.current = nextPhase;
    setPhaseIdx(nextPhase);

    if (nextPhase === 0) {
      const nextCycle = cycleRef.current + 1;
      cycleRef.current = nextCycle;
      setCycle(nextCycle);
      if (nextCycle >= TOTAL_CYCLES) {
        setRunning(false);
        onComplete();
        return;
      }
    }
    timerRef.current = window.setTimeout(tick, PHASES[nextPhase].duration);
  }

  function start() {
    cycleRef.current = 0;
    phaseRef.current = 0;
    setCycle(0);
    setPhaseIdx(0);
    setRunning(true);
    timerRef.current = window.setTimeout(tick, PHASES[0].duration);
  }

  function stop() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setRunning(false);
  }

  if (!running) {
    return (
      <div className="text-center space-y-6">
        <p className="font-serif italic text-[#8f8daa] max-w-xl mx-auto">
          {t("affirmations.activity.breathing.intro")}
        </p>
        <button
          type="button"
          onClick={start}
          className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
        >
          {t("affirmations.activity.breathing.begin_cta")}
        </button>
      </div>
    );
  }

  const phase = PHASES[phaseIdx];
  const affirmation = affirmations[cycle % Math.max(affirmations.length, 1)];
  const scale = phaseIdx === 0 ? 1.3 : phaseIdx === 1 ? 1.3 : 0.85;

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 220, height: 220 }}
      >
        <div
          className="absolute inset-0 rounded-full transition-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(196,163,90,0.35), rgba(196,163,90,0.05) 70%, transparent)",
            transform: `scale(${scale})`,
            transitionDuration: `${phase.duration}ms`,
            transitionTimingFunction: "ease-in-out",
          }}
        />
        <p className="font-display text-[12px] tracking-[0.3em] uppercase text-[#c4a35a]">
          {t(phase.labelKey)}
        </p>
      </div>

      <p className="font-serif italic text-xl md:text-2xl text-[#f0eff8] text-center max-w-xl leading-relaxed">
        {affirmation?.text ?? t("affirmations.activity.breathing.default_phrase")}
      </p>

      <p className="font-mono text-xs text-[#8f8daa]">
        {t("affirmations.activity.breathing.cycle_progress", { current: cycle + 1, total: TOTAL_CYCLES })}
      </p>

      <button
        type="button"
        onClick={stop}
        className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(196,163,90,0.25)] bg-[rgba(196,163,90,0.06)] px-4 py-2 font-sans text-xs text-[#f0eff8] hover:bg-[rgba(196,163,90,0.14)] hover:border-[rgba(196,163,90,0.45)] hover:text-[#c4a35a] transition-all"
      >
        {t("affirmations.activity.breathing.end_early")}
      </button>
    </div>
  );
}
