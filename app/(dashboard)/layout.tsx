import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  StarField,
  NebulaBackground,
} from "@/components/cosmic-background";

export const dynamic = "force-dynamic";

/**
 * Shared layout for the authenticated content pillars (tarot, natal,
 * affirmations, audiobooks, sound, guides). Provides the cosmic background
 * and a minimal nav bar. Auth gate redirects to /auth/signin if no user.
 *
 * NOTE: W1 (feature/dashboard) is the canonical owner of the full sidebar +
 * header chrome. When W1 merges, this layout will compose with the W1 chrome.
 */
const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tarot", label: "Tarot" },
  { href: "/natal", label: "Natal" },
  { href: "/affirmations", label: "Affirmations" },
  { href: "/audiobooks", label: "Audiobooks" },
  { href: "/sound", label: "Sound" },
  { href: "/guides", label: "Guides" },
];

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="relative min-h-screen">
      <StarField />
      <NebulaBackground />

      <header
        className="sticky top-0 z-30 border-b backdrop-blur"
        style={{
          background: "rgba(6, 6, 15, 0.72)",
          borderColor: "rgba(196, 163, 90, 0.12)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="font-display text-[12px] tracking-[0.2em] uppercase text-[#c4a35a]"
          >
            ✦ LUMZEN
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs text-[#8f8daa]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#f0eff8] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
