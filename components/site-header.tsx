"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useT } from "@/lib/i18n/client";

type SiteHeaderProps = {
  greeting: string;
  subtitle: string;
  displayName: string;
  dayStreak: number;
  moonPhase: string;
  todayLabel: string;
};

export function SiteHeader({
  greeting,
  subtitle,
  displayName,
  dayStreak,
  moonPhase,
  todayLabel,
}: SiteHeaderProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const t = useT();
  const initial = displayName.charAt(0).toUpperCase() || "✦";

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  }

  return (
    <header
      className="md:sticky md:top-0 z-20 px-6 py-4 flex items-center justify-between gap-4"
      style={{
        background: "rgba(6, 6, 15, 0.80)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(196, 163, 90, 0.10)",
      }}
    >
      <div className="min-w-0">
        <h1 className="font-serif italic text-xl text-[#f0eff8] truncate">
          {greeting} <span className="text-[#c4a35a]">✦</span>
        </h1>
        <p className="font-sans text-xs text-[#8f8daa] mt-0.5 truncate">
          <span className="font-serif italic">{subtitle}</span>
          <span className="mx-2 text-[#4a4866]">·</span>
          <span className="font-mono">{todayLabel}</span>
          <span className="mx-2 text-[#4a4866]">·</span>
          <span>🌙 {moonPhase}</span>
          <span className="mx-2 text-[#4a4866]">·</span>
          <span>{t("header.day_streak", { count: dayStreak })}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          aria-label={t("header.search_aria")}
          className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] hover:bg-[rgba(196,163,90,0.08)] transition-colors"
        >
          <Search size={16} />
        </button>
        <button
          type="button"
          aria-label={t("header.notifications_aria")}
          className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] hover:bg-[rgba(196,163,90,0.08)] transition-colors"
        >
          <Bell size={20} />
        </button>
        <Link
          href="/profile"
          className="size-10 rounded-full flex items-center justify-center font-display text-sm shrink-0"
          style={{
            background: "rgba(196, 163, 90, 0.12)",
            border: "1px solid rgba(196, 163, 90, 0.30)",
            color: "#c4a35a",
            letterSpacing: "0.05em",
          }}
          aria-label={t("header.profile_aria")}
        >
          {initial}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          aria-label={t("header.sign_out_aria")}
          className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] hover:bg-[rgba(196,163,90,0.08)] transition-colors disabled:opacity-50"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
