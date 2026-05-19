"use client";

import Link from "next/link";
import { useState } from "react";

export function SubscribeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consentEmail, setConsentEmail] = useState(true);
  const [consentSms, setConsentSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          phone: trimmedPhone || undefined,
          consent_email: consentEmail,
          consent_sms: consentSms,
          source: "subscribe_page",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
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
          ✦ YOU ARE WITHIN
        </p>
        <h2 className="font-serif italic text-2xl text-[#f0eff8]">
          Welcome, traveler <span className="text-[#c4a35a]">✦</span>
        </h2>
        <p className="font-sans text-sm text-[#8f8daa] mt-4">
          A quiet email finds you each Sunday morning.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="sub-name"
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          Name <span className="text-[#4a4866]">(optional)</span>
        </label>
        <input
          id="sub-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="sub-email"
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          Email
        </label>
        <input
          id="sub-email"
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
          htmlFor="sub-phone"
          className="block font-sans text-xs text-[#8f8daa] mb-2"
        >
          Phone <span className="text-[#4a4866]">(optional, for SMS)</span>
        </label>
        <input
          id="sub-phone"
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
            I consent to receive editorial emails from LumZen. Frequency
            varies, typically one email per week. Unsubscribe any time.
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
            By providing my phone number and checking this box, I consent
            to receive marketing text messages from LumZen. Message
            frequency varies. Message and data rates may apply. Text HELP
            for help. Text STOP to unsubscribe.
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
        disabled={loading}
        className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Joining…" : "Join the Community ✦"}
      </button>

      <p className="font-sans text-[11px] text-[#4a4866] text-center leading-relaxed">
        By signing up you agree to our{" "}
        <Link href="/terms" className="text-[#c4a35a] hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#c4a35a] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
