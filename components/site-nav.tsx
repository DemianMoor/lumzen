"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "rgba(6,6,15,0.80)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(196,163,90,0.10)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[#c4a35a] text-lg leading-none">✦</span>
          <span className="font-display text-[15px] tracking-[0.1em] text-[#f0eff8] group-hover:text-[#c4a35a] transition-colors">
            LumZen
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm transition-colors ${
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
            className="font-sans text-sm text-[#8f8daa] hover:text-[#f0eff8] transition-colors hidden sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="font-sans text-sm py-2 px-4 rounded-full bg-[#c4a35a] text-[#06060f] font-medium hover:brightness-110 transition-all"
          >
            Begin ✦
          </Link>
        </nav>
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
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#c4a35a] text-lg leading-none">✦</span>
            <span className="font-display text-[15px] tracking-[0.1em] text-[#f0eff8]">
              LumZen
            </span>
          </div>
          <p className="font-serif italic text-sm text-[#8f8daa] leading-relaxed">
            Where light meets stillness.
          </p>
        </div>

        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            ✦ THE SANCTUARY
          </p>
          <ul className="space-y-2 font-sans text-sm text-[#8f8daa]">
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
          </ul>
        </div>

        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            ✦ THE FINE PRINT
          </p>
          <ul className="space-y-2 font-sans text-sm text-[#8f8daa]">
            <li>
              <Link href="/privacy" className="hover:text-[#f0eff8] transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#f0eff8] transition-colors">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/auth/signin" className="hover:text-[#f0eff8] transition-colors">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-8">
        <p className="font-mono text-[11px] text-[#4a4866]">
          © {new Date().getFullYear()} LumZen · A free, ad-supported community.
        </p>
      </div>
    </footer>
  );
}
