"use client";

import { useMemo, useState } from "react";
import { ChakraSequence } from "@/components/chakra-sequence";
import { MirrorWork } from "@/components/mirror-work";
import { BreatheAffirm } from "@/components/breathe-affirm";
import { useT } from "@/lib/i18n/client";

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
  const t = useT();
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
      setGenError(err instanceof Error ? err.message : t("affirmations.generator.generation_failed"));
    } finally {
      setGenerating(false);
    }
  }

  if (activity === "chakra_sequence") {
    return (
      <ActivityShell
        title={t("affirmations.activity.chakra_sequence.title")}
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
        title={t("affirmations.activity.mirror_work.title")}
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
        title={t("affirmations.activity.breathing.title")}
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
          title={t("affirmations.activity.chakra_sequence.title")}
          description={t("affirmations.activity.chakra_sequence.description")}
          accent="#8b6fc9"
          onClick={() => setActivity("chakra_sequence")}
          eyebrow={t("affirmations.activity.eyebrow")}
        />
        <ActivityCard
          title={t("affirmations.activity.mirror_work.title")}
          description={t("affirmations.activity.mirror_work.description")}
          accent="#d4758a"
          onClick={() => setActivity("mirror_work")}
          eyebrow={t("affirmations.activity.eyebrow")}
        />
        <ActivityCard
          title={t("affirmations.activity.breathing.title")}
          description={t("affirmations.activity.breathing.description")}
          accent="#6bcc9e"
          onClick={() => setActivity("breathing")}
          eyebrow={t("affirmations.activity.eyebrow")}
        />
      </section>

      {/* Browse by category ------------------------------------------- */}
      <section>
        <h2 className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
          {t("affirmations.browse.heading")}
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
              {t("affirmations.browse.empty_state")}
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
          {t("affirmations.generator.eyebrow")}
        </p>
        <p className="font-serif italic text-[#8f8daa] mb-5">
          {t("affirmations.generator.intro")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder={t("affirmations.generator.placeholder")}
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#6bcc9e]"
          />
          <button
            type="button"
            onClick={generate}
            disabled={generating || !intention.trim()}
            className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
          >
            {generating ? t("affirmations.generator.composing") : t("affirmations.generator.submit_cta")}
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
  eyebrow,
}: {
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
  eyebrow: string;
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
        {eyebrow}
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
  const t = useT();
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
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(196,163,90,0.25)] bg-[rgba(196,163,90,0.06)] px-4 py-2 font-sans text-xs text-[#f0eff8] hover:bg-[rgba(196,163,90,0.14)] hover:border-[rgba(196,163,90,0.45)] hover:text-[#c4a35a] transition-all"
        >
          {t("affirmations.activity.back")}
        </button>
      </div>
      {children}
      {completed && (
        <p className="mt-6 text-center font-serif italic text-[#6bcc9e]">
          {t("affirmations.activity.complete_message")}
        </p>
      )}
    </section>
  );
}
