"use client";

import { useState } from "react";
import { NatalWheel } from "@/components/natal-wheel";
import type { ComputedChart } from "@/lib/astrology/ephemeris";

type ExistingChart = {
  name: string | null;
  birthDate: string;
  birthTime: string | null;
  birthCity: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  chartData: ComputedChart | null;
  aiInterpretation: string | null;
};

export function NatalClient({ existing }: { existing: ExistingChart | null }) {
  const [chart, setChart] = useState<ComputedChart | null>(existing?.chartData ?? null);
  const [meta, setMeta] = useState({
    sunSign: existing?.sunSign ?? null,
    moonSign: existing?.moonSign ?? null,
    risingSign: existing?.risingSign ?? null,
    city: existing?.birthCity ?? null,
  });
  const [interpretation, setInterpretation] = useState<string | null>(
    existing?.aiInterpretation ?? null,
  );

  const [name, setName] = useState(existing?.name ?? "");
  const [birthDate, setBirthDate] = useState(existing?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(existing?.birthTime ?? "");
  const [birthCity, setBirthCity] = useState(existing?.birthCity ?? "");

  const [submitting, setSubmitting] = useState(false);
  const [interpreting, setInterpreting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(!existing);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/natal/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          birthDate,
          birthTime: birthTime || null,
          birthCity: birthCity.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "chart could not be generated");
      }
      const data = (await res.json()) as { chart: ComputedChart; city: string | null };
      setChart(data.chart);
      setMeta({
        sunSign: data.chart.sun.sign,
        moonSign: data.chart.moon.sign,
        risingSign: data.chart.ascendant.sign,
        city: data.city,
      });
      setInterpretation(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function interpret() {
    setInterpreting(true);
    try {
      const res = await fetch("/api/natal/interpret", { method: "POST" });
      const data = (await res.json()) as { interpretation?: string; error?: string };
      setInterpretation(data.interpretation ?? data.error ?? "");
    } finally {
      setInterpreting(false);
    }
  }

  return (
    <div className="space-y-10">
      {!showForm && chart && (
        <section className="grid lg:grid-cols-[1fr,auto] gap-8 items-start">
          <div className="flex items-center justify-center">
            <NatalWheel chart={chart} />
          </div>
          <aside className="space-y-4 lg:min-w-[260px]">
            <SignPill label="Sun" sign={meta.sunSign} color="#c4a35a" />
            <SignPill label="Moon" sign={meta.moonSign} color="#8b6fc9" />
            <SignPill label="Rising" sign={meta.risingSign} color="#d4758a" />
            {meta.city && (
              <p className="font-sans text-xs text-[#8f8daa] pt-2">
                Birth place: {meta.city}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 w-full rounded-full border py-3 px-4 font-sans text-sm text-[#f0eff8] hover:bg-[rgba(196,163,90,0.08)] transition-colors"
              style={{ borderColor: "rgba(196,163,90,0.4)" }}
            >
              Regenerate
            </button>
          </aside>
        </section>
      )}

      {showForm && (
        <section
          className="rounded-2xl p-8 border max-w-2xl mx-auto"
          style={{
            background: "rgba(26,26,53,0.5)",
            borderColor: "rgba(196,163,90,0.15)",
          }}
        >
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-2">
            Birth data
          </p>
          <p className="font-serif italic text-[#8f8daa] mb-6">
            Your time of birth gives the Rising. Without it the chart still draws, but
            the ascendant uses noon as a best-guess.
          </p>
          <form onSubmit={generate} className="space-y-4">
            <Field id="name" label="Name (optional)">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="birthDate" label="Birth date">
                <input
                  id="birthDate"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={INPUT}
                />
              </Field>
              <Field id="birthTime" label="Birth time (24h)">
                <input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className={INPUT}
                />
              </Field>
            </div>
            <Field id="birthCity" label="Birth city">
              <input
                id="birthCity"
                type="text"
                required
                placeholder="e.g. Kesswil, Switzerland"
                value={birthCity}
                onChange={(e) => setBirthCity(e.target.value)}
                className={INPUT}
              />
            </Field>

            {error && (
              <p className="font-sans text-sm text-[#ef4444]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
            >
              {submitting ? "Drawing the chart..." : "Generate my chart ✦"}
            </button>
            {existing && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="block mx-auto mt-2 font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a]"
              >
                Cancel
              </button>
            )}
          </form>
        </section>
      )}

      {chart && !showForm && (
        <section
          className="rounded-2xl p-8 border"
          style={{
            background: "rgba(26,26,53,0.5)",
            borderColor: "rgba(196,163,90,0.15)",
          }}
        >
          <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            What the chart asks
          </p>
          {interpretation ? (
            <div className="font-serif text-[#f0eff8] leading-relaxed whitespace-pre-wrap">
              {interpretation}
            </div>
          ) : (
            <div>
              <p className="font-serif italic text-[#8f8daa] mb-4">
                Read your chart with the LumZen guide — Sun, Moon, Rising, and the
                placements that stand out.
              </p>
              <button
                type="button"
                onClick={interpret}
                disabled={interpreting}
                className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60"
              >
                {interpreting ? "Composing..." : "Read my chart ✦"}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

const INPUT =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] transition-all";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-xs text-[#8f8daa] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function SignPill({
  label,
  sign,
  color,
}: {
  label: string;
  sign: string | null;
  color: string;
}) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        background: "rgba(26,26,53,0.5)",
        borderColor: `${color}33`,
      }}
    >
      <p
        className="font-display text-[10px] tracking-[0.2em] uppercase mb-1"
        style={{ color }}
      >
        {label}
      </p>
      <p className="font-serif italic text-xl text-[#f0eff8]">
        {sign ? sign.charAt(0).toUpperCase() + sign.slice(1) : "—"}
      </p>
    </div>
  );
}
