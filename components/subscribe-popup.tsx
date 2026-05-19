"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePopupContext } from "@/lib/popup-context";

const SESSION_SHOWN_KEY = "lz_popup_shown_this_session";
const SUBSCRIBED_KEY = "lz_subscribed";
const TIMER_DELAY_MS = 5000;

// Authenticated surfaces never see the popup — members already joined.
// Legal/compliance pages don't either; users reading those should not be
// interrupted by a marketing modal.
const EXCLUDED_PATH_PREFIXES = [
  "/admin",
  "/auth",
  "/api",
  "/dashboard",
  "/tarot",
  "/natal",
  "/affirmations",
  "/audiobooks",
  "/sound",
  "/guides",
  "/celestial",
  "/profile",
  "/settings",
  "/lp",
];
const EXCLUDED_EXACT_PATHS = [
  "/subscribe",
  "/privacy",
  "/terms",
  "/sms-terms",
  "/do-not-sell",
];

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
      setError("We need a valid email address to send you the practice.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          // The popup is email-only by design — TCPA prohibits bundling
          // SMS consent with another opt-in, so we never collect a phone
          // here. The full /subscribe form is the only SMS surface.
          consent_email: true,
          consent_sms: false,
          source: "popup",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error(
            "This email is already on the list. You're already here ✦",
          );
        }
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
              <p className="text-[#c4a35a] text-3xl leading-none mb-4">✦</p>
              <h2
                id="subscribe-popup-title"
                className="font-serif italic text-3xl text-[#f0eff8]"
              >
                Welcome.
              </h2>
              <p className="font-sans text-sm text-[#8f8daa] mt-4 leading-relaxed">
                A welcome message has been sent to{" "}
                <span className="text-[#f0eff8]">{email}</span>. Check your
                inbox.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[#c4a35a] text-3xl leading-none mb-4">✦</p>
              <h2
                id="subscribe-popup-title"
                className="font-serif italic text-2xl md:text-3xl text-[#f0eff8] leading-tight"
              >
                Before you wander further…
              </h2>
              <p className="font-sans text-sm text-[#8f8daa] mt-3 leading-relaxed">
                Receive the daily card, weekly reflections, and quiet
                announcements from us.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4 text-left"
                noValidate
              >
                <div>
                  <label htmlFor="popup-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    ref={firstInputRef}
                    id="popup-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
                  />
                </div>

                <p className="font-sans text-[11px] text-[#8f8daa] leading-relaxed">
                  By subscribing, you agree to receive marketing emails from
                  LumZen. You can unsubscribe at any time using the link in
                  any email. See our{" "}
                  <Link
                    href="/privacy"
                    className="text-[#c4a35a] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                {error && (
                  <p
                    className="font-sans text-sm text-[#ef4444]"
                    role="alert"
                  >
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

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
                  >
                    No, thank you
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
