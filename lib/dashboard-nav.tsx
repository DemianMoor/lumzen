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
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

export const NAV_PRIMARY: ReadonlyArray<DashboardNavItem> = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/guides", label: "Spiritual Guides", icon: BookOpen },
  { href: "/audiobooks", label: "Audiobooks", icon: Headphones },
  { href: "/affirmations", label: "Affirmations", icon: Sparkles },
  { href: "/sound", label: "Sound Temple", icon: Music2 },
  { href: "/celestial", label: "Celestial Tools", icon: Stars },
  { href: "/tarot", label: "Tarot", icon: Spade },
  { href: "/natal", label: "Natal Chart", icon: Orbit },
];

export const NAV_SECONDARY: ReadonlyArray<DashboardNavItem> = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const NAV_FOOTER_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact" },
];

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}
