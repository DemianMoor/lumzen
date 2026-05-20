"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { StarField, NebulaBackground } from "@/components/cosmic-background";
import { useT } from "@/lib/i18n/client";

export default function SignUpPage() {
  const router = useRouter();
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
        data: {
          display_name: name.trim() || email.split("@")[0],
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If the project has email confirmation off, session is established immediately.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    // Email confirmation is required — hand off to /auth/verify-email so the
    // user can resend the verification link (up to 5 total) if it gets lost.
    const params = new URLSearchParams({
      email: email.trim().toLowerCase(),
      sent: "1",
    });
    router.push(`/auth/verify-email?${params}`);
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
            {t("auth.signup.title")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-sans text-xs text-[#8f8daa] mb-2">
              {t("auth.signup.name_label")}
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-sans text-xs text-[#8f8daa] mb-2">
              {t("auth.signup.email_label")}
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

          <div>
            <label htmlFor="password" className="block font-sans text-xs text-[#8f8daa] mb-2">
              {t("auth.signup.password_label")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.signup.submit_loading") : t("auth.signup.submit")}
          </button>

          <p className="font-sans text-xs text-[#8f8daa] text-center mt-4 leading-relaxed">
            {t("auth.signup.disclaimer")}
          </p>
        </form>

        <div className="mt-6 text-center font-sans text-xs text-[#8f8daa]">
          {t("auth.signup.already_here_prefix")}{" "}
          <Link href="/auth/signin" className="text-[#c4a35a] hover:underline">
            {t("auth.signup.sign_in_link")}
          </Link>
        </div>
      </div>
    </main>
  );
}
