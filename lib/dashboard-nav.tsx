import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  Sparkles,
  Music2,
  Stars,
  Spade,
  Orbit,
  User,
  Settings,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ size?: number }>;
};

export const NAV_PRIMARY: ReadonlyArray<DashboardNavItem> = [
  { href: "/dashboard", labelKey: "nav.sidebar.dashboard", icon: LayoutDashboard },
  { href: "/guides", labelKey: "nav.sidebar.guides", icon: BookOpen },
  { href: "/audiobooks", labelKey: "nav.sidebar.audiobooks", icon: Headphones },
  { href: "/affirmations", labelKey: "nav.sidebar.affirmations", icon: Sparkles },
  { href: "/sound", labelKey: "nav.sidebar.sound", icon: Music2 },
  { href: "/celestial", labelKey: "nav.sidebar.celestial", icon: Stars },
  { href: "/tarot", labelKey: "nav.sidebar.tarot", icon: Spade },
  { href: "/natal", labelKey: "nav.sidebar.natal", icon: Orbit },
];

export const NAV_SECONDARY: ReadonlyArray<DashboardNavItem> = [
  { href: "/profile", labelKey: "nav.sidebar.profile", icon: User },
  { href: "/settings", labelKey: "nav.sidebar.settings", icon: Settings },
];

export const NAV_FOOTER_LINKS: ReadonlyArray<{ href: string; labelKey: string }> = [
  { href: "/privacy", labelKey: "footer.fine_print.privacy" },
  { href: "/terms", labelKey: "footer.fine_print.terms" },
  { href: "/contact", labelKey: "footer.sanctuary.contact" },
];

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}
