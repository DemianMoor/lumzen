"use client";

import { useMemo, useState } from "react";
import { ChakraSequence } from "@/components/chakra-sequence";
import { MirrorWork } from "@/components/mirror-work";
import { BreatheAffirm } from "@/components/breathe-affirm";

type Affirmation = {
  id: string;
  text: string;
  category: string;
  chakra: string | null;
};

type Category = {
  key: string;
  label: string;
  description: string;
};

type Activity = "chakra_sequence" | "mirror_work" | "breathing" | "browse";

export function AffirmationsClient({
  categories,
  chakras,
  affirmations,
}: {
  categories: Category[];
  chakras: Category[];
  affirmations: Affirmation[];
}) {
  const [activity, setActivity] = useState<Activity>("browse");
  const [selected, setSelected] = useState<string>("identity");
  const [completed, setCompleted] = useState(false);

  const [intention, setIntention] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string[] | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const browseList = useMemo(
    () => affirmations.filter((a) => a.category === selected).slice(0, 30),
    [affirmations, selected],
  );

  async function markComplete() {
    setCompleted(true);
    await fetch("/api/practices/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "affirmation" }),
    });
  }

  async function generate() {
    if (!intention.trim()) return;
    setGenerating(true);
    setGenError(null);
    setGenerated(null);
    try {
      const res = await fetch("/api/affirmations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intention: intention.trim() }),
      });
      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).error || "failed");
      }
      const data = (await res.json()) as { affirmations: string[] };
      setGenerated(data.affirmations);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  if (activity === "chakra_sequence") {
    return (
      <ActivityShell
        title="Chakra sequence"
        onBack={() => {
          setActivity("browse");
          setCompleted(false);
        }}
        completed={completed}
      >
        <ChakraSequence affirmations={affirmations} onComplete={markComplete} />
      </ActivityShell>
    );
  }

  if (activity === "mirror_work") {
    const list = browseList.length > 0 ? browseList : affirmations.slice(0, 5);
    return (
      <ActivityShell
        title="Mirror work"
        onBack={() => {
          setActivity("browse");
          setCompleted(false);
        }}
        completed={completed}
      >
        <MirrorWork affirmations={list.slice(0, 5)} onComplete={markComplete} />
      </ActivityShell>
    );
  }

  if (activity === "breathing") {
    const list = browseList.length > 0 ? browseList : affirmations.slice(0, 6);
    return (
      <ActivityShell
        title="Breathe and affirm"
        onBack={() => {
          setActivity("browse");
          setCompleted(false);
        }}
        completed={completed}
      >
        <BreatheAffirm affirmations={list.slice(0, 6)} onComplete={markComplete} />
      </ActivityShell>
    );
  }

  return (
    <div className="space-y-12">
      {/* Activities ---------------------------------------------------- */}
      <section className="grid sm:grid-cols-3 gap-4">
        <ActivityCard
          title="Chakra sequence"
          description="Seven affirmations, seven Solfeggio tones."
          accent="#8b6fc9"
          onClick={() => setActivity("chakra_sequence")}
        />
        <ActivityCard
          title="Mirror work"
          description="Five affirmations, eyes on your own eyes."
          accent="#d4758a"
          onClick={() => setActivity("mirror_work")}
        />
        <ActivityCard
          title="Breathe and affirm"
          description="Six breaths, six affirmations, paced together."
          accent="#6bcc9e"
          onClick={() => setActivity("breathing")}
        />
      </section>

      {/* Browse by category ------------------------------------------- */}
      <section>
        <h2 className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
          Browse by category
        </h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {[...categories, ...chakras].map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelected(c.key)}
              className="rounded-full border px-4 py-2 font-sans text-xs transition-colors"
              style={{
                background:
                  selected === c.key ? "rgba(196,163,90,0.12)" : "transparent",
                borderColor:
                  selected === c.key
                    ? "rgba(196,163,90,0.5)"
                    : "rgba(255,255,255,0.1)",
                color: selected === c.key ? "#f0eff8" : "#8f8daa",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {browseList.length === 0 && (
            <li className="font-serif italic text-[#8f8daa]">
              The wisdom is waiting. Begin with what calls to you.
            </li>
          )}
          {browseList.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border p-4 font-serif italic text-[#f0eff8]"
              style={{
                background: "rgba(26,26,53,0.4)",
                borderColor: "rgba(196,163,90,0.1)",
              }}
            >
              {a.text}
            </li>
          ))}
        </ul>
      </section>

      {/* AI generator ------------------------------------------------- */}
      <section
        className="rounded-2xl p-8 border"
        style={{
          background: "rgba(26,26,53,0.5)",
          borderColor: "rgba(107,204,158,0.25)",
        }}
      >
        <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#6bcc9e] mb-2">
          Personal affirmations
        </p>
        <p className="font-serif italic text-[#8f8daa] mb-5">
          Bring an intention. Receive five affirmations written for it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="e.g. trust myself in unfamiliar rooms"
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#6bcc9e]"
          />
          <button
            type="button"
            onClick={generate}
            disabled={generating || !intention.trim()}
            className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
          >
            {generating ? "Composing..." : "Generate ✦"}
          </button>
        </div>
        {genError && (
          <p className="mt-3 font-sans text-sm text-[#ef4444]" role="alert">
            {genError}
          </p>
        )}
        {generated && (
          <ul className="mt-6 space-y-2">
            {generated.map((a, i) => (
              <li
                key={i}
                className="rounded-lg border p-4 font-serif italic text-[#f0eff8]"
                style={{
                  background: "rgba(26,26,53,0.4)",
                  borderColor: "rgba(107,204,158,0.2)",
                }}
              >
                {a}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ActivityCard({
  title,
  description,
  accent,
  onClick,
}: {
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl border p-6 transition-all hover:-translate-y-1"
      style={{
        background: "rgba(26,26,53,0.6)",
        borderColor: `${accent}33`,
        boxShadow: `0 0 0 0 ${accent}00`,
      }}
    >
      <p
        className="font-display text-[10px] tracking-[0.2em] uppercase mb-3"
        style={{ color: accent }}
      >
        Activity
      </p>
      <p className="font-serif italic text-xl text-[#f0eff8] mb-2">{title}</p>
      <p className="font-sans text-sm text-[#8f8daa]">{description}</p>
    </button>
  );
}

function ActivityShell({
  title,
  onBack,
  children,
  completed,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  completed: boolean;
}) {
  return (
    <section
      className="rounded-2xl p-8 border"
      style={{
        background: "rgba(26,26,53,0.5)",
        borderColor: "rgba(196,163,90,0.15)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a]">
          {title}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a]"
        >
          ← Back
        </button>
      </div>
      {children}
      {completed && (
        <p className="mt-6 text-center font-serif italic text-[#6bcc9e]">
          Practice complete. Your day on the wheel keeps turning.
        </p>
      )}
    </section>
  );
}
