"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  Sparkles,
  Music2,
  Stars,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_PRIMARY = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/guides", label: "Spiritual Guides", icon: BookOpen },
  { href: "/audiobooks", label: "Audiobooks", icon: Headphones },
  { href: "/affirmations", label: "Affirmations", icon: Sparkles },
  { href: "/sound", label: "Sound Temple", icon: Music2 },
  { href: "/celestial", label: "Celestial Tools", icon: Stars },
] as const;

const NAV_SECONDARY = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className="hidden md:flex fixed top-0 left-0 h-screen z-30 flex-col transition-[width] duration-300 ease-out"
      style={{
        width: expanded ? 220 : 68,
        background: "rgba(6, 6, 15, 0.92)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(196, 163, 90, 0.12)",
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-label="Primary"
    >
      <div className="flex items-center px-4 h-16 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-[#c4a35a] font-display"
          style={{ letterSpacing: "0.10em" }}
        >
          <span className="text-xl shrink-0">✦</span>
          <span
            className="text-[15px] whitespace-nowrap transition-opacity duration-200"
            style={{ opacity: expanded ? 1 : 0 }}
          >
            LumZen
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-hidden">
        {NAV_PRIMARY.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            expanded={expanded}
            active={isActive(pathname, item.href)}
          />
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-[rgba(196,163,90,0.10)] flex flex-col gap-1">
        {NAV_SECONDARY.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            expanded={expanded}
            active={isActive(pathname, item.href)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((s) => !s)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        className="absolute top-20 -right-3 size-6 rounded-full flex items-center justify-center text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
        style={{
          background: "rgba(6, 6, 15, 0.92)",
          border: "1px solid rgba(196, 163, 90, 0.20)",
        }}
      >
        {expanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
}

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function SidebarLink({
  item,
  expanded,
  active,
}: {
  item: { href: string; label: string; icon: React.ComponentType<{ size?: number }> };
  expanded: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 h-11 px-3 rounded-md font-sans text-sm transition-colors duration-150"
      style={{
        background: active ? "rgba(196, 163, 90, 0.08)" : "transparent",
        color: active ? "#c4a35a" : "#8f8daa",
      }}
      title={item.label}
    >
      <span className="shrink-0 flex items-center justify-center w-5">
        <Icon size={20} />
      </span>
      <span
        className="whitespace-nowrap transition-opacity duration-200"
        style={{ opacity: expanded ? 1 : 0 }}
      >
        {item.label}
      </span>
    </Link>
  );
}

export const SIDEBAR_COLLAPSED_WIDTH = 68;
export const SIDEBAR_EXPANDED_WIDTH = 220;
