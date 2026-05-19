import Link from "next/link";
import { getCurrentEditor } from "@/lib/admin-auth";
import { SignOutButton } from "./sign-out-button";

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/articles/import", label: "Import" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/landing-pages", label: "Landing pages" },
  { href: "/admin/site-settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const editor = await getCurrentEditor();

  // Not signed in or not an editor — let the child page render its own UI
  // (signin / forgot-password / reset-password screens are unauthenticated).
  if (!editor) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#06060f] text-[#f0eff8]">
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(6,6,15,0.92)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(196,163,90,0.15)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 group"
          >
            <span className="text-[#c4a35a] text-lg leading-none">✦</span>
            <span className="font-display text-[15px] tracking-[0.1em] text-[#f0eff8] group-hover:text-[#c4a35a] transition-colors">
              LumZen
            </span>
            <span className="font-sans text-xs text-[#4a4866] ml-1">
              / admin
            </span>
          </Link>

          <div className="flex items-center gap-4 font-sans text-xs">
            <Link
              href="/"
              target="_blank"
              rel="noopener"
              className="text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
            >
              View site ↗
            </Link>
            <span className="text-[#4a4866]">|</span>
            <span className="text-[#8f8daa]">{editor.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 flex gap-8">
        <aside className="w-52 flex-shrink-0">
          <nav className="space-y-1 font-sans text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-[#8f8daa] hover:text-[#f0eff8] hover:bg-[rgba(196,163,90,0.08)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
