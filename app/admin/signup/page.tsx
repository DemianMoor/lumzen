"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { StarField, NebulaBackground } from "@/components/cosmic-background";

export default function AdminSignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          display_name: displayName.trim() || undefined,
          invite_code: inviteCode.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Registration failed (${res.status})`);
      }

      // Account exists and editor row is set — sign in to land at /admin.
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        // Edge case: account created but auto-signin failed; fall back to manual.
        router.push("/admin/signin");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
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
          <h1 className="font-serif text-2xl text-[#f0eff8]">
            Register an editor account
          </h1>
          <p className="font-sans text-xs text-[#8f8daa] mt-2 leading-relaxed">
            Editor access is invite-only. If the editors table is empty
            (first install) you can register the bootstrap admin without
            an invite code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="display-name"
              className="block font-sans text-xs text-[#8f8daa] mb-2"
            >
              Display name <span className="text-[#4a4866]">(optional)</span>
            </label>
            <input
              id="display-name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-sans text-xs text-[#8f8daa] mb-2"
            >
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
            <label
              htmlFor="password"
              className="block font-sans text-xs text-[#8f8daa] mb-2"
            >
              Password{" "}
              <span className="text-[#4a4866]">(12 characters or more)</span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-3 px-4 font-sans text-sm text-[#f0eff8] placeholder:text-[#4a4866] focus:outline-none focus:border-[#c4a35a] focus:ring-1 focus:ring-[#c4a35a] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="invite-code"
              className="block font-sans text-xs text-[#8f8daa] mb-2"
            >
              Invite code{" "}
              <span className="text-[#4a4866]">
                (leave blank for bootstrap admin)
              </span>
            </label>
            <input
              id="invite-code"
              type="text"
              autoComplete="off"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
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
            {loading ? "Creating account…" : "Create editor account"}
          </button>

          <p className="text-center font-sans text-xs text-[#8f8daa] pt-2">
            Already have access?{" "}
            <Link
              href="/admin/signin"
              className="text-[#c4a35a] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
