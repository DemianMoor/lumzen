"use client";

import Link from "next/link";
import { useState } from "react";

export function SubscribeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Both consent boxes must default to UNCHECKED per TCPA / CAN-SPAM
  // best practice. Submit is disabled until at least email consent is given.
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentSms, setConsentSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("We need a valid email address to send you the practice.");
      return;
    }
    if (!consentEmail) {
      setError(
        "Please confirm you would like to receive emails by checking the box above.",
      );
      return;
    }
    const trimmedPhone = phone.trim();
    if (consentSms && !trimmedPhone) {
      setError(
        "Please add your mobile number above so we can send the text reminders.",
      );
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
          phone: consentSms && trimmedPhone ? trimmedPhone : undefined,
          consent_email: consentEmail,
          consent_sms: consentSms,
          source: "subscribe_page",
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
          ✦ WELCOME TO THE COMMUNITY
        </p>
        <h2 className="font-serif italic text-2xl text-[#f0eff8]">
          A welcome message is on its way{" "}
          <span className="text-[#c4a35a]">✦</span>
        </h2>
        <p className="font-sans text-sm text-[#8f8daa] mt-4 leading-relaxed">
          Check your inbox (and your spam folder, just in case).
          {consentSms && (
            <>
              <br />
              You will also receive an SMS confirmation shortly — reply{" "}
              <span className="font-mono">Y</span> to confirm.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="sub-email"
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          Your email
        </label>
        <input
          id="sub-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="sub-name"
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          Your name <span className="text-[#4a4866]">(optional)</span>
        </label>
        <input
          id="sub-name"
          type="text"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="sub-phone"
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          Mobile number{" "}
          <span className="text-[#4a4866]">(optional · US only)</span>
        </label>
        <input
          id="sub-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
        />
      </div>

      <div className="pt-4 border-t" style={{ borderColor: "rgba(196,163,90,0.12)" }}>
        <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
          How should we reach you?
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
              I consent to receive marketing and editorial emails from LumZen
              (operated by DemianSpirits). Frequency varies, typically one
              email per week. I can unsubscribe any time.
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
              By providing your phone number and checking this box, you are
              consenting to receive marketing text messages to that number
              from LumZen. Message frequency varies. Message and data rates
              may apply. Text HELP for help. Text STOP to unsubscribe. SMS
              opt-in data will not be shared or sold with 3rd parties.
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
          SMS messaging &amp; data policy
        </summary>
        <p className="mt-3 font-sans text-[11px] text-[#8f8daa] leading-relaxed">
          SMS is currently available in the United States only. By providing
          your phone number, checking the SMS consent box, and clicking the
          sign-up button, you agree to receive periodic text messages from
          LumZen — operated by DemianSpirits — at the number you submitted.
          These may include automated messages sent using an automatic
          telephone dialing system. Message and data rates may apply.
          Message frequency varies, typically one message per week. Messages
          will consist of weekly content digests, occasional content alerts,
          and account notifications. Consent to receive SMS is not a
          condition of subscribing to LumZen or accessing any of our
          content. Text HELP for help. Reply STOP at any time to unsubscribe
          — you will get one confirmation message and then no further texts.
          See our{" "}
          <Link href="/terms" className="text-[#c4a35a] hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#c4a35a] hover:underline">
            Privacy Policy
          </Link>{" "}
          for full details.
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
        {loading ? "Joining…" : "Subscribe ✦"}
      </button>
    </form>
  );
}
