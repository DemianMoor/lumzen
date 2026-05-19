"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePopupContext } from "@/lib/popup-context";

const SESSION_SHOWN_KEY = "lz_popup_shown_this_session";
const SUBSCRIBED_KEY = "lz_subscribed";
const TIMER_DELAY_MS = 5000;

const EXCLUDED_PATH_PREFIXES = ["/admin", "/auth", "/api", "/dashboard"];
const EXCLUDED_EXACT_PATHS = ["/subscribe"];

function isExcludedPath(pathname: string): boolean {
  if (EXCLUDED_EXACT_PATHS.includes(pathname)) return true;
  return EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function SubscribePopup() {
  const pathname = usePathname();
  const { isSuppressed } = usePopupContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentSms, setConsentSms] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isExcludedPath(pathname)) return;
    if (isSuppressed) return;
    if (sessionStorage.getItem(SESSION_SHOWN_KEY) === "1") return;
    if (localStorage.getItem(SUBSCRIBED_KEY) === "1") return;

    function startTimer() {
      if (timerRef.current) return;
      startedAtRef.current = Date.now();
      const remaining = TIMER_DELAY_MS - elapsedRef.current;
      timerRef.current = setTimeout(() => {
        sessionStorage.setItem(SESSION_SHOWN_KEY, "1");
        setIsOpen(true);
      }, Math.max(0, remaining));
    }

    function pauseTimer() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        if (startedAtRef.current) {
          elapsedRef.current += Date.now() - startedAtRef.current;
          startedAtRef.current = null;
        }
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) pauseTimer();
      else startTimer();
    }

    if (!document.hidden) startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      pauseTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, isSuppressed]);

  useEffect(() => {
    if (!isOpen) return;
    firstInputRef.current?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) setIsOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!consentEmail && !consentSms) {
      setError("Please consent to email or SMS so we know how to reach you.");
      return;
    }
    const trimmedPhone = phone.trim();
    if (consentSms && !trimmedPhone) {
      setError("Please add your phone number to receive the SMS digest.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: trimmedPhone || undefined,
          consent_email: consentEmail,
          consent_sms: consentSms,
          source: "popup",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Subscribe failed (${res.status})`);
      }

      setSuccess(true);
      localStorage.setItem(SUBSCRIBED_KEY, "1");
      setTimeout(() => setIsOpen(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscribe-popup-title"
      style={{
        background: "rgba(6, 6, 15, 0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={handleBackdropClick}
        className="flex min-h-full items-center justify-center px-4 py-6 sm:py-10"
      >
        <div
          className="relative w-full max-w-xl rounded-2xl border p-6 sm:p-8 md:p-10"
          style={{
            background: "rgba(26, 26, 53, 0.95)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(196, 163, 90, 0.30)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 text-2xl leading-none text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
          >
            ×
          </button>

          {success ? (
            <div className="py-6 text-center">
              <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
                ✦ YOU ARE WITHIN
              </p>
              <h2
                id="subscribe-popup-title"
                className="font-serif italic text-3xl text-[#f0eff8]"
              >
                Welcome, traveler{" "}
                <span className="text-[#c4a35a]">✦</span>
              </h2>
              <p className="font-sans text-sm text-[#8f8daa] mt-4 leading-relaxed">
                A quiet email finds you each Sunday morning.
              </p>
            </div>
          ) : (
            <>
              <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
                ✦ THE WEEKLY
              </p>
              <h2
                id="subscribe-popup-title"
                className="font-serif italic text-2xl md:text-3xl text-[#f0eff8] leading-tight"
              >
                One quiet email a week, written for the community.
              </h2>
              <p className="font-sans text-sm text-[#8f8daa] mt-3 leading-relaxed">
                A short, useful read every Sunday morning. Free, always.
                Unsubscribe in one tap.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="popup-email"
                    className="block font-sans text-xs text-[#8f8daa] mb-2"
                  >
                    Email
                  </label>
                  <input
                    ref={firstInputRef}
                    id="popup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="popup-phone"
                    className="block font-sans text-xs text-[#8f8daa] mb-2"
                  >
                    Phone{" "}
                    <span className="text-[#4a4866] normal-case">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="popup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
                  />
                </div>

                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentEmail}
                      onChange={(e) => setConsentEmail(e.target.checked)}
                      className="mt-1 h-4 w-4 flex-shrink-0 accent-[#c4a35a]"
                    />
                    <span className="font-sans text-xs text-[#8f8daa] leading-relaxed">
                      I consent to receive editorial emails from LumZen.
                      Frequency varies, typically one email per week.
                      Unsubscribe any time.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentSms}
                      onChange={(e) => setConsentSms(e.target.checked)}
                      className="mt-1 h-4 w-4 flex-shrink-0 accent-[#c4a35a]"
                    />
                    <span className="font-sans text-xs text-[#8f8daa] leading-relaxed">
                      By providing my phone number and checking this box, I
                      consent to receive marketing text messages from LumZen.
                      Message frequency varies. Message and data rates may
                      apply. Text HELP for help. Text STOP to unsubscribe.
                    </span>
                  </label>
                </div>

                {error && (
                  <p className="font-sans text-sm text-[#ef4444]" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Joining…" : "Join the Community ✦"}
                </button>

                <p className="font-sans text-[11px] text-[#4a4866] text-center leading-relaxed">
                  By signing up you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-[#c4a35a] hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#c4a35a] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  . We will not sell your data.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
