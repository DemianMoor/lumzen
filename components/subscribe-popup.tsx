"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePopupContext } from "@/lib/popup-context";
import { SubscribeFormFields } from "@/components/subscribe-form-fields";
import { useT } from "@/lib/i18n/client";

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
  const t = useT();
  const pathname = usePathname();
  const { isSuppressed } = usePopupContext();
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState<{
    email: string;
    consentSms: boolean;
  } | null>(null);

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
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) setIsOpen(false);
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
        className="flex min-h-full items-start sm:items-center justify-center px-4 py-6 sm:py-10"
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
            aria-label={t("subscribe.popup.aria.close")}
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
                {t("subscribe.popup.success.title")}
              </h2>
              <p className="font-sans text-sm text-[#8f8daa] mt-4 leading-relaxed">
                {t("subscribe.popup.success.body", { email: success.email })}
                {success.consentSms && (
                  <>
                    <br />
                    {t("subscribe.popup.success.sms_note")}
                  </>
                )}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-center">
                <p className="text-[#c4a35a] text-3xl leading-none mb-4">✦</p>
                <h2
                  id="subscribe-popup-title"
                  className="font-serif italic text-2xl md:text-3xl text-[#f0eff8] leading-tight"
                >
                  {t("subscribe.popup.title")}
                </h2>
                <p className="font-sans text-sm text-[#8f8daa] mt-3 leading-relaxed">
                  {t("subscribe.popup.intro")}
                </p>
              </div>

              <div className="mt-6">
                <SubscribeFormFields
                  source="popup"
                  onSuccess={(result) => {
                    setSuccess(result);
                    localStorage.setItem(SUBSCRIBED_KEY, "1");
                    setTimeout(() => setIsOpen(false), 3000);
                  }}
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
                >
                  {t("subscribe.popup.decline")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
