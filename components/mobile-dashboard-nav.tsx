"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  NAV_PRIMARY,
  NAV_SECONDARY,
  NAV_FOOTER_LINKS,
  isNavActive,
} from "@/lib/dashboard-nav";

/**
 * Mobile-only top bar for signed-in surfaces. Renders below md: where
 * the Sidebar is hidden. Brand mark links back to /dashboard; the
 * hamburger opens a Sheet drawer carrying the same nav as the desktop
 * Sidebar plus the legal footer links and a Sign-out action.
 */
export function MobileDashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/auth/signin");
    router.refresh();
  }

  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4"
      style={{
        background: "rgba(6, 6, 15, 0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(196, 163, 90, 0.12)",
      }}
      aria-label="Primary"
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-2 group"
        aria-label="LumZen — go to dashboard"
      >
        <span className="text-[#c4a35a] text-lg leading-none">✦</span>
        <span className="font-display text-[15px] tracking-[0.14em] text-[#f0eff8] group-hover:text-[#c4a35a] transition-colors">
          LumZen
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Open menu"
            className="size-10 rounded-full flex items-center justify-center text-[#f0eff8] hover:text-[#c4a35a] hover:bg-[rgba(196,163,90,0.08)] transition-colors"
          >
            <Menu size={22} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[84%] sm:w-[360px] max-w-none border-l p-0 [&>button.absolute]:hidden flex flex-col"
          style={{
            background: "rgba(6, 6, 15, 0.96)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(196, 163, 90, 0.18)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 h-14 border-b shrink-0"
            style={{ borderColor: "rgba(196, 163, 90, 0.10)" }}
          >
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <span className="text-[#c4a35a] text-lg leading-none">✦</span>
              <span className="font-display text-[15px] tracking-[0.14em] text-[#f0eff8]">
                LumZen
              </span>
            </Link>
            <SheetClose asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="size-9 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
              >
                <X size={20} />
              </button>
            </SheetClose>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
            {NAV_PRIMARY.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 h-12 px-3 rounded-md font-serif italic text-[17px] transition-colors"
                  style={{
                    background: active ? "rgba(196, 163, 90, 0.08)" : "transparent",
                    color: active ? "#c4a35a" : "#f0eff8",
                  }}
                >
                  <span className="shrink-0 flex items-center justify-center w-6">
                    <Icon size={20} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div
              className="mt-3 pt-3 border-t flex flex-col gap-1"
              style={{ borderColor: "rgba(196, 163, 90, 0.10)" }}
            >
              {NAV_SECONDARY.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 h-11 px-3 rounded-md font-sans text-sm transition-colors"
                    style={{
                      background: active ? "rgba(196, 163, 90, 0.08)" : "transparent",
                      color: active ? "#c4a35a" : "#8f8daa",
                    }}
                  >
                    <span className="shrink-0 flex items-center justify-center w-6">
                      <Icon size={18} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div
              className="mt-4 pt-4 border-t flex flex-col gap-1 px-3"
              style={{ borderColor: "rgba(196, 163, 90, 0.10)" }}
            >
              <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-1">
                The fine print
              </p>
              {NAV_FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-sans text-sm py-2 text-[#8f8daa] hover:text-[#f0eff8] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div
            className="border-t px-5 py-4 shrink-0"
            style={{ borderColor: "rgba(196, 163, 90, 0.10)" }}
          >
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(196,163,90,0.25)] bg-[rgba(196,163,90,0.06)] px-4 py-3 font-sans text-sm text-[#f0eff8] hover:bg-[rgba(196,163,90,0.14)] hover:border-[rgba(196,163,90,0.45)] hover:text-[#c4a35a] transition-all disabled:opacity-60"
            >
              <LogOut size={16} />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
