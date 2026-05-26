"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Preflight = { headerFound: boolean; footerFound: boolean };

type ChromeSettingsProps = {
  slug: string;
  initialUseSiteChrome: boolean;
  initialEffective: boolean;
  initialPendingRevertAtIso: string | null;
  initialPendingRevertTo: boolean | null;
};

const DEADLINE_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Permanent" },
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 3, label: "3 hours" },
  { value: 4, label: "4 hours" },
  { value: 5, label: "5 hours" },
  { value: 6, label: "6 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
  { value: 72, label: "72 hours" },
  { value: 168, label: "7 days" },
];

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0s";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function ChromeSettings({
  slug,
  initialUseSiteChrome,
  initialEffective,
  initialPendingRevertAtIso,
  initialPendingRevertTo,
}: ChromeSettingsProps) {
  const router = useRouter();

  const [useSiteChrome, setUseSiteChrome] = useState(initialUseSiteChrome);
  const [deadlineHours, setDeadlineHours] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [preflight, setPreflight] = useState<Preflight | null>(null);

  const [effective, setEffective] = useState(initialEffective);
  const [pendingRevertAtIso, setPendingRevertAtIso] = useState(
    initialPendingRevertAtIso,
  );
  const [pendingRevertTo, setPendingRevertTo] = useState(initialPendingRevertTo);

  const [now, setNow] = useState(() => Date.now());

  const pendingRevertAt = useMemo(
    () => (pendingRevertAtIso ? new Date(pendingRevertAtIso) : null),
    [pendingRevertAtIso],
  );

  useEffect(() => {
    if (!pendingRevertAt) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [pendingRevertAt]);

  const countdown = useMemo(() => {
    if (!pendingRevertAt) return null;
    return formatCountdown(pendingRevertAt.getTime() - now);
  }, [pendingRevertAt, now]);

  async function handleSave() {
    setBusy(true);
    setError(null);
    setMessage(null);
    setPreflight(null);
    try {
      let nextPreflight: Preflight | null = null;
      if (useSiteChrome) {
        const pre = await fetch(
          `/api/admin/landing-pages/${slug}/chrome-check`,
          { cache: "no-store" },
        );
        if (pre.ok) {
          nextPreflight = (await pre.json()) as Preflight;
          setPreflight(nextPreflight);
        }
      }

      const res = await fetch(`/api/admin/landing-pages/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_site_chrome: useSiteChrome,
          deadline_hours: deadlineHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save.");

      const updated = data.landingPage;
      if (updated) {
        setEffective(Boolean(updated.use_site_chrome));
        setPendingRevertAtIso(updated.chrome_revert_at ?? null);
        setPendingRevertTo(
          updated.chrome_revert_to === null || updated.chrome_revert_to === undefined
            ? null
            : Boolean(updated.chrome_revert_to),
        );
      }

      setMessage("Saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCancelRevert() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/landing-pages/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancel_revert: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not cancel.");

      const updated = data.landingPage;
      if (updated) {
        setUseSiteChrome(Boolean(updated.use_site_chrome));
        setEffective(Boolean(updated.use_site_chrome));
        setPendingRevertAtIso(null);
        setPendingRevertTo(null);
      }

      setMessage("Pending revert cancelled.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="rounded-2xl border p-6"
      style={{
        background: "rgba(26,26,53,0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196,163,90,0.15)",
      }}
    >
      <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-4 text-[#c4a35a]">
        ✦ SITE CHROME
      </p>

      <div
        className="rounded-lg border p-4 mb-4"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <p className="font-sans text-sm text-[#f0eff8]">
          Currently serving:{" "}
          <strong style={{ color: effective ? "#c4a35a" : "#f0eff8" }}>
            {effective ? "LumZen chrome" : "Partner chrome"}
          </strong>
        </p>
        {pendingRevertAt && countdown && (
          <p className="font-mono text-xs text-[#8f8daa] mt-2">
            Auto-revert in {countdown} to{" "}
            <strong style={{ color: "#f0eff8" }}>
              {pendingRevertTo ? "LumZen chrome" : "Partner chrome"}
            </strong>
            .
          </p>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={useSiteChrome}
          onChange={(e) => setUseSiteChrome(e.target.checked)}
          className="h-4 w-4 accent-[#c4a35a]"
          disabled={busy}
        />
        <span className="font-sans text-sm text-[#f0eff8]">
          Inject LumZen header and footer over the partner page
        </span>
      </label>

      <label className="block mb-4">
        <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
          Auto-revert after
        </span>
        <select
          value={deadlineHours === null ? "permanent" : String(deadlineHours)}
          onChange={(e) =>
            setDeadlineHours(
              e.target.value === "permanent" ? null : Number(e.target.value),
            )
          }
          disabled={busy}
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-sans text-sm text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
        >
          {DEADLINE_OPTIONS.map((opt) => (
            <option
              key={opt.value === null ? "permanent" : String(opt.value)}
              value={opt.value === null ? "permanent" : String(opt.value)}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <p className="mt-1 font-sans text-[11px] text-[#4a4866]">
          With a deadline, the toggle flips back to its previous value when it
          expires. Checked lazily on each request.
        </p>
      </label>

      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="w-full py-2.5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy ? "Saving…" : "Save chrome settings"}
      </button>

      {pendingRevertAt && (
        <button
          type="button"
          onClick={handleCancelRevert}
          disabled={busy}
          className="mt-3 w-full py-2 rounded-full border border-[rgba(255,255,255,0.10)] text-[#8f8daa] font-sans text-xs hover:text-[#f0eff8] hover:border-[#c4a35a] transition-all disabled:opacity-60"
        >
          Cancel pending revert
        </button>
      )}

      {preflight && useSiteChrome && (
        <div className="mt-4 space-y-1">
          <p
            className="font-mono text-xs"
            style={{ color: preflight.headerFound ? "#6bcc9e" : "#e6b86f" }}
          >
            {preflight.headerFound
              ? "✓ partner header detected"
              : "⚠ partner header not detected — LumZen header will sit on top of existing markup"}
          </p>
          <p
            className="font-mono text-xs"
            style={{ color: preflight.footerFound ? "#6bcc9e" : "#e6b86f" }}
          >
            {preflight.footerFound
              ? "✓ partner footer detected"
              : "⚠ partner footer not detected — LumZen footer will sit below existing markup"}
          </p>
        </div>
      )}

      {message && (
        <p className="mt-4 font-mono text-xs text-[#6bcc9e]" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 font-mono text-xs text-[#ef4444]" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
