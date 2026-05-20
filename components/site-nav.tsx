"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

type NavLink = { href: string; label: string };

const NAV_LINKS: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/contact", label: "Contact" },
];

const MOBILE_SECONDARY: NavLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "rgba(6,6,15,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(196,163,90,0.12)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-5 md:py-7 flex items-center justify-between gap-6">
        {/* Brand mark — bigger on desktop */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="text-[#c4a35a] text-xl md:text-2xl leading-none">
            ✦
          </span>
          <span className="font-display text-[16px] md:text-[20px] tracking-[0.14em] text-[#f0eff8] group-hover:text-[#c4a35a] transition-colors">
            LumZen
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-[15px] transition-colors ${
                  active
                    ? "text-[#c4a35a]"
                    : "text-[#8f8daa] hover:text-[#f0eff8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/auth/signin"
            className="font-sans text-[15px] text-[#8f8daa] hover:text-[#f0eff8] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="font-sans text-[15px] py-2.5 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-medium hover:brightness-110 transition-all"
          >
            Begin ✦
          </Link>
        </nav>

        {/* Mobile trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="md:hidden size-10 rounded-full flex items-center justify-center text-[#f0eff8] hover:text-[#c4a35a] hover:bg-[rgba(196,163,90,0.08)] transition-colors"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[82%] sm:w-[360px] max-w-none border-l p-0 [&>button.absolute]:hidden"
            style={{
              background: "rgba(6,6,15,0.96)",
              backdropFilter: "blur(24px)",
              borderColor: "rgba(196,163,90,0.18)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(196,163,90,0.10)" }}>
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <span className="text-[#c4a35a] text-xl leading-none">✦</span>
                <span className="font-display text-[17px] tracking-[0.14em] text-[#f0eff8]">
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

            <nav className="px-6 py-6 flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-serif italic text-2xl py-3 transition-colors ${
                      active ? "text-[#c4a35a]" : "text-[#f0eff8] hover:text-[#c4a35a]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div
                className="mt-5 pt-5 border-t flex flex-col"
                style={{ borderColor: "rgba(196,163,90,0.10)" }}
              >
                {MOBILE_SECONDARY.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-sans text-sm text-[#8f8daa] hover:text-[#f0eff8] py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div
                className="mt-6 pt-6 border-t flex flex-col gap-3"
                style={{ borderColor: "rgba(196,163,90,0.10)" }}
              >
                <Link
                  href="/auth/signin"
                  onClick={() => setOpen(false)}
                  className="font-sans text-[15px] py-3 px-5 rounded-full border text-center text-[#f0eff8] hover:bg-[rgba(196,163,90,0.08)] transition-all"
                  style={{ borderColor: "rgba(196,163,90,0.35)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setOpen(false)}
                  className="font-sans text-[15px] py-3 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-medium text-center hover:brightness-110 transition-all"
                >
                  Begin ✦
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="relative z-10 mt-auto border-t"
      style={{ borderColor: "rgba(196,163,90,0.10)" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#c4a35a] text-xl leading-none">✦</span>
            <span className="font-display text-[17px] tracking-[0.14em] text-[#f0eff8]">
              LumZen
            </span>
          </div>
          <p className="font-serif italic text-base text-[#8f8daa] leading-relaxed">
            Where light meets stillness.
          </p>
          <p className="font-sans text-xs text-[#8f8daa] mt-4 leading-relaxed max-w-xs">
            A free, ad-supported community for daily spiritual practice.
          </p>
        </div>

        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
            ✦ THE SANCTUARY
          </p>
          <ul className="space-y-3 font-sans text-sm text-[#8f8daa]">
            <li>
              <Link href="/about" className="hover:text-[#f0eff8] transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/subscribe" className="hover:text-[#f0eff8] transition-colors">
                Subscribe
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#f0eff8] transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/auth/signin" className="hover:text-[#f0eff8] transition-colors">
                Sign in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
            ✦ THE FINE PRINT
          </p>
          <ul className="space-y-3 font-sans text-sm text-[#8f8daa]">
            <li>
              <Link href="/privacy" className="hover:text-[#f0eff8] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#f0eff8] transition-colors">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <a href="mailto:hello@lumzen.co" className="hover:text-[#f0eff8] transition-colors">
                hello@lumzen.co
              </a>
            </li>
            <li>
              <a href="tel:+15407397462" className="hover:text-[#f0eff8] transition-colors">
                +1 (540) 739-7462
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t"
        style={{ borderColor: "rgba(196,163,90,0.08)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-[#4a4866]">
            © {new Date().getFullYear()} LumZen · A free, ad-supported community.
          </p>
          <p className="font-mono text-[11px] text-[#4a4866]">
            Practice may support change, not guarantee outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}
