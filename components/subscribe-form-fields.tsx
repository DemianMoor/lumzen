"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";

// Maps the bracketed tokens used in the consent copy to their legal pages.
const CONSENT_LINKS: Record<string, string> = {
  "Terms of Service": "/terms",
  "Privacy Policy": "/privacy",
};

/**
 * Renders consent copy that embeds `[Terms of Service]` / `[Privacy Policy]`
 * tokens as inline links. The links open in a new tab so a subscriber can
 * read the policy without losing their place in the form, and stopPropagation
 * keeps a link click from toggling the surrounding checkbox `<label>`.
 */
function renderConsentText(text: string) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]$/);
    const href = match ? CONSENT_LINKS[match[1]] : undefined;
    if (match && href) {
      return (
        <Link
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[#c4a35a] hover:underline"
        >
          {match[1]}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export type SubscribeSource = "subscribe_page" | "popup";

export type SubscribeFormSuccess = {
  email: string;
  consentSms: boolean;
};

/**
 * Shared form body used by both /subscribe and the SubscribePopup so
 * the two surfaces can never drift. Includes name + email + mobile,
 * the two explicit consent checkboxes (both default unchecked), and
 * the collapsible SMS messaging & data policy disclosure.
 *
 * The host (page or popup) owns the success UI and any side effects
 * (auto-closing the modal, setting localStorage, etc.) — this
 * component just POSTs to /api/subscribe and reports back.
 *
 * Consent collected here is email (required) plus two optional SMS opt-ins,
 * kept separate because they are separate legal bases: account/service
 * notifications and marketing/promotional messages. Only the marketing one
 * feeds the promotional SimpleTexting sync. The Terms-acceptance checkbox
 * was retired; its `subscribers` columns are left in place so historical
 * consent records stay readable.
 */
export function SubscribeFormFields({
  source,
  onSuccess,
  showNameField = true,
}: {
  source: SubscribeSource;
  onSuccess: (result: SubscribeFormSuccess) => void;
  /**
   * The popup can hide the optional name field to keep its footprint
   * smaller; defaults to true (the standalone /subscribe page shows it).
   */
  showNameField?: boolean;
}) {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentSmsAccount, setConsentSmsAccount] = useState(false);
  const [consentSms, setConsentSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idPrefix = source === "popup" ? "popup" : "sub";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(t("subscribe.form.error.invalid_email"));
      return;
    }
    if (!consentEmail) {
      setError(t("subscribe.form.error.email_consent_required"));
      return;
    }
    const trimmedPhone = phone.trim();
    // Either SMS consent is a promise to text the number, so both require one.
    const wantsSms = consentSmsAccount || consentSms;
    if (wantsSms && !trimmedPhone) {
      setError(t("subscribe.form.error.sms_requires_phone"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          phone: wantsSms && trimmedPhone ? trimmedPhone : undefined,
          consent_email: consentEmail,
          consent_sms_account: consentSmsAccount,
          consent_sms: consentSms,
          source,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error(t("subscribe.form.error.already_subscribed"));
        }
        throw new Error(
          data.error || t("subscribe.form.error.generic", { status: res.status }),
        );
      }
      onSuccess({ email: email.trim(), consentSms: wantsSms });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("subscribe.form.error.unknown"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
      <div>
        <label
          htmlFor={`${idPrefix}-email`}
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          {t("subscribe.form.email_label")}
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("subscribe.form.email_placeholder")}
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
        />
      </div>

      {showNameField && (
        <div>
          <label
            htmlFor={`${idPrefix}-name`}
            className="block font-sans text-xs text-[#8f8daa] mb-2"
          >
            {t("subscribe.form.name_label")}{" "}
            <span className="text-[#4a4866]">{t("subscribe.form.name_optional")}</span>
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("subscribe.form.name_placeholder")}
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
          />
        </div>
      )}

      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          {t("subscribe.form.phone_label")}{" "}
          <span className="text-[#4a4866]">{t("subscribe.form.phone_optional")}</span>
        </label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("subscribe.form.phone_placeholder")}
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
        />
      </div>

      <div
        className="pt-4 border-t"
        style={{ borderColor: "rgba(196,163,90,0.12)" }}
      >
        <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
          {t("subscribe.form.consent_heading")}
        </p>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentEmail}
              onChange={(e) => setConsentEmail(e.target.checked)}
              className="mt-1 h-4 w-4 flex-shrink-0 accent-[#c4a35a]"
            />
            <span className="font-sans text-xs text-[#f0eff8] leading-relaxed">
              {t("subscribe.form.consent_email")}
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentSmsAccount}
              onChange={(e) => setConsentSmsAccount(e.target.checked)}
              className="mt-1 h-4 w-4 flex-shrink-0 accent-[#c4a35a]"
            />
            <span className="font-sans text-xs text-[#f0eff8] leading-relaxed">
              {renderConsentText(t("subscribe.form.consent_sms_account"))}
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentSms}
              onChange={(e) => setConsentSms(e.target.checked)}
              className="mt-1 h-4 w-4 flex-shrink-0 accent-[#c4a35a]"
            />
            <span className="font-sans text-xs text-[#f0eff8] leading-relaxed">
              {renderConsentText(t("subscribe.form.consent_sms"))}
            </span>
          </label>
        </div>
      </div>

      <details
        className="group border-t pt-4"
        style={{ borderColor: "rgba(196,163,90,0.12)" }}
      >
        <summary className="cursor-pointer list-none flex items-center gap-2 font-sans text-xs text-[#c4a35a] hover:brightness-110 transition-all">
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-open:rotate-90"
          >
            ▸
          </span>
          {t("subscribe.form.sms_policy_summary")}
        </summary>
        <p className="mt-3 font-sans text-[11px] text-[#8f8daa] leading-relaxed">
          {t("subscribe.form.sms_policy_body")}{" "}
          <Link href="/terms" className="text-[#c4a35a] hover:underline">
            {t("subscribe.form.sms_policy_link_terms")}
          </Link>{" "}
          <Link href="/privacy" className="text-[#c4a35a] hover:underline">
            {t("subscribe.form.sms_policy_link_privacy")}
          </Link>
        </p>
      </details>

      {error && (
        <p className="font-sans text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !consentEmail}
        className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? t("subscribe.form.submit_loading")
          : source === "popup"
            ? t("subscribe.form.submit_popup")
            : t("subscribe.form.submit_page")}
      </button>
    </form>
  );
}
