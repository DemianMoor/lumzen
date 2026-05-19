"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const MAX_TOTAL_EMAILS = 5;
const COOLDOWN_SECONDS = 60;
const SUPPORT_EMAIL = "hello@lumzen.co";

function storageKey(email: string) {
  return `lz_verify_${email.toLowerCase()}`;
}

type StoredState = {
  count: number;
  cooldownEnds: number;
};

function readState(email: string): StoredState {
  if (typeof window === "undefined") return { count: 0, cooldownEnds: 0 };
  try {
    const raw = window.localStorage.getItem(storageKey(email));
    if (!raw) return { count: 0, cooldownEnds: 0 };
    const parsed = JSON.parse(raw);
    return {
      count: Number(parsed.count) || 0,
      cooldownEnds: Number(parsed.cooldownEnds) || 0,
    };
  } catch {
    return { count: 0, cooldownEnds: 0 };
  }
}

function writeState(email: string, state: StoredState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(email), JSON.stringify(state));
}

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const initialEmail = (searchParams.get("email") ?? "").toLowerCase();
  const expired = searchParams.get("expired") === "1";
  const initialFromSignup = searchParams.get("sent") === "1";

  const [email, setEmail] = useState(initialEmail);
  const [count, setCount] = useState(0);
  const [cooldownEnds, setCooldownEnds] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Hydrate state from localStorage on first mount and whenever the email changes.
  useEffect(() => {
    if (!email) {
      setCount(0);
      setCooldownEnds(0);
      return;
    }
    const stored = readState(email);
    // If this load came directly from signup, count the initial signup email
    // as attempt #1 so the user has 4 resends left.
    if (initialFromSignup && stored.count === 0) {
      const seeded = { count: 1, cooldownEnds: 0 };
      writeState(email, seeded);
      setCount(seeded.count);
      setCooldownEnds(seeded.cooldownEnds);
    } else {
      setCount(stored.count);
      setCooldownEnds(stored.cooldownEnds);
    }
  }, [email, initialFromSignup]);

  // Tick once a second so the cooldown label counts down.
  useEffect(() => {
    if (cooldownEnds <= 0) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [cooldownEnds]);

  const cooldownLeft = Math.max(0, Math.ceil((cooldownEnds - now) / 1000));
  const exhausted = count >= MAX_TOTAL_EMAILS;
  const remaining = Math.max(0, MAX_TOTAL_EMAILS - count);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (exhausted || cooldownLeft > 0 || !email || sending) return;

    setError(null);
    setInfo(null);
    setSending(true);

    const supabase = createSupabaseBrowserClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setSending(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    const nextCount = count + 1;
    const nextCooldown = Date.now() + COOLDOWN_SECONDS * 1000;
    writeState(email, { count: nextCount, cooldownEnds: nextCooldown });
    setCount(nextCount);
    setCooldownEnds(nextCooldown);
    setInfo(`Sent. Check your inbox.`);
  }

  const heading = exhausted
    ? "Let us set you up directly"
    : expired
      ? "Your verification link expired"
      : "Check your inbox ✦";

  return (
    <div
      className="relative z-10 w-full max-w-md rounded-2xl p-8 border"
      style={{
        background: "rgba(26, 26, 53, 0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196, 163, 90, 0.20)",
      }}
    >
      <div className="text-center mb-6">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
          ✦ LUMZEN
        </p>
        <h1 className="font-serif italic text-3xl text-[#f0eff8] leading-tight">
          {heading}
        </h1>
      </div>

      {exhausted ? (
        <div className="space-y-4">
          <p className="font-sans text-sm text-[#f0eff8] leading-relaxed">
            We have sent you {MAX_TOTAL_EMAILS} verification emails. If none
            reached you, the path forward is a direct one.
          </p>
          <p className="font-sans text-sm text-[#8f8daa] leading-relaxed">
            Write to{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-[#c4a35a] hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            and we will set up your account by hand.
          </p>
          <Link
            href="/auth/signin"
            className="block w-full text-center py-3 rounded-full border border-[#c4a35a] text-[#c4a35a] font-sans text-sm hover:bg-[rgba(196,163,90,0.10)] transition-all"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <p className="font-sans text-sm text-[#8f8daa] leading-relaxed mb-6">
            {expired
              ? "Send yourself a fresh verification link below."
              : "We sent a verification link to your email. Click it to begin your practice. If it never arrived, you can resend below."}
          </p>

          <form onSubmit={handleResend} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-sans text-xs text-[#8f8daa] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
              />
            </div>

            {error && (
              <p className="font-sans text-sm text-[#ef4444]" role="alert">
                {error}
              </p>
            )}
            {info && (
              <p className="font-sans text-sm text-[#6bcc9e]" role="status">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={sending || cooldownLeft > 0 || !email || exhausted}
              className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending
                ? "Sending…"
                : cooldownLeft > 0
                  ? `Resend available in ${cooldownLeft}s`
                  : "Resend verification email ✦"}
            </button>

            <p className="font-sans text-xs text-[#8f8daa] text-center">
              {count === 0
                ? `Up to ${MAX_TOTAL_EMAILS} emails per address.`
                : `${count} of ${MAX_TOTAL_EMAILS} sent · ${remaining} remaining.`}
            </p>
          </form>

          <div className="mt-6 text-center font-sans text-xs text-[#8f8daa]">
            Already verified?{" "}
            <Link href="/auth/signin" className="text-[#c4a35a] hover:underline">
              Sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
