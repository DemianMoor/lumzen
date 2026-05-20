"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { StarField, NebulaBackground } from "@/components/cosmic-background";
import { useT } from "@/lib/i18n/client";

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=/auth/reset-password`
            : undefined,
      },
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">
      <StarField />
      <NebulaBackground />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-8 border"
        style={{
          background: "rgba(26, 26, 53, 0.85)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(196, 163, 90, 0.20)",
        }}
      >
        <div className="text-center mb-8">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
            {t("auth.common.brand_eyebrow")}
          </p>
          <h1 className="font-serif italic text-3xl text-[#f0eff8]">
            {t("auth.forgot_password.title")}
          </h1>
        </div>

        {sent ? (
          <p className="font-sans text-sm text-[#f0eff8] text-center">
            {t("auth.forgot_password.sent_prefix")}{" "}
            <span className="text-[#c4a35a]">{email}</span>
            {t("auth.forgot_password.sent_suffix")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-sans text-xs text-[#8f8daa] mb-2">
                {t("auth.forgot_password.email_label")}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
              />
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
              {loading ? t("auth.forgot_password.submit_loading") : t("auth.forgot_password.submit")}
            </button>
          </form>
        )}

        <div className="mt-6 text-center font-sans text-xs text-[#8f8daa]">
          <Link href="/auth/signin" className="hover:text-[#c4a35a] transition-colors">
            {t("auth.forgot_password.back_to_signin")}
          </Link>
        </div>
      </div>
    </main>
  );
}
