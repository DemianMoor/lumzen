"use client";

import Link from "next/link";
import { useState } from "react";

export function SubscribeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // SMS consent must default to UNCHECKED per TCPA. Email consent is
  // implicit and disclosed in the body copy above the submit button.
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
          // Submitting the form is express consent to receive marketing
          // email per the disclosure rendered above the submit button.
          consent_email: true,
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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
        <p className="mt-2 font-sans text-[11px] text-[#4a4866] leading-relaxed">
          For text message reminders. US numbers only.
        </p>
      </div>

      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentSms}
            onChange={(e) => setConsentSms(e.target.checked)}
            className="mt-1 h-4 w-4 flex-shrink-0 accent-[#c4a35a]"
          />
          <span className="font-sans text-xs text-[#f0eff8] leading-relaxed">
            I want to receive practice reminders and updates by text message
            from LumZen at the number above.
          </span>
        </label>
        <p className="mt-2 pl-7 font-sans text-[11px] text-[#8f8daa] leading-relaxed">
          By checking this box, I provide my prior express written consent
          under the TCPA to receive recurring marketing text messages from
          LumZen sent using an automatic telephone dialing system. Consent
          is not a condition of using LumZen. Message frequency varies.
          Msg &amp; data rates may apply. Reply STOP to cancel, HELP for
          help. See our{" "}
          <Link href="/terms" className="text-[#c4a35a] hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>

      {error && (
        <p className="font-sans text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}

      <p className="font-sans text-[11px] text-[#8f8daa] leading-relaxed pt-2">
        By subscribing, you agree to receive marketing emails from LumZen.
        You can unsubscribe at any time using the link in any email. See our{" "}
        <Link href="/privacy" className="text-[#c4a35a] hover:underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-[#c4a35a] hover:underline">
          Terms of Service
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Joining…" : "Subscribe ✦"}
      </button>
    </form>
  );
}
