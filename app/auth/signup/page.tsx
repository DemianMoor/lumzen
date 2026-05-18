"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { StarField, NebulaBackground } from "@/components/cosmic-background";

export default function SignUpPage() {
  const router = useRouter();
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

    setInfo("Check your inbox to confirm your email, then sign in.");
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
            ✦ LUMZEN
          </p>
          <h1 className="font-serif italic text-3xl text-[#f0eff8]">
            Begin your journey <span className="text-[#c4a35a]">✦</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-sans text-xs text-[#8f8daa] mb-2">
              Name
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
              Email
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
              Password
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
            {loading ? "Creating account…" : "Create Account ✦"}
          </button>

          <p className="font-sans text-xs text-[#8f8daa] text-center mt-4 leading-relaxed">
            By creating an account, you join a free, ad-supported community.
            No payment, ever.
          </p>
        </form>

        <div className="mt-6 text-center font-sans text-xs text-[#8f8daa]">
          Already here?{" "}
          <Link href="/auth/signin" className="text-[#c4a35a] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
