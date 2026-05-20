/**
 * AdSlot — gold-bordered placeholder for ad inventory.
 *
 * Controlled by NEXT_PUBLIC_ADS_ENABLED:
 *  - "false" or unset (default): render a quiet placeholder with the
 *    "✦ SPONSORED ✦" mark + a faint caption.
 *  - "true": render an empty container with the reserved dimensions so
 *    a real ad provider (Ezoic, Mediavine, AdSense) can populate it.
 *
 * Three placements per PLATFORM-RESEARCH.md:
 *   leaderboard  728x90  — between hero and first row
 *   in-feed      300x250 — mid-dashboard, square
 *   sticky-footer 320x50 — mobile-only, above the audio player
 */

import { cn } from "@/lib/utils";
import { getCurrentMessages, t } from "@/lib/i18n/server";

export type AdSlotPlacement = "leaderboard" | "in-feed" | "sticky-footer";

const PLACEMENT_DIMENSIONS: Record<
  AdSlotPlacement,
  { width: number; height: number; mobileOnly: boolean }
> = {
  leaderboard: { width: 728, height: 90, mobileOnly: false },
  "in-feed": { width: 300, height: 250, mobileOnly: false },
  "sticky-footer": { width: 320, height: 50, mobileOnly: true },
};

export async function AdSlot({
  placement,
  className,
}: {
  placement: AdSlotPlacement;
  className?: string;
}) {
  const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
  const { width, height, mobileOnly } = PLACEMENT_DIMENSIONS[placement];
  const { messages } = await getCurrentMessages();

  const isStickyFooter = placement === "sticky-footer";
  const containerClass = cn(
    "rounded-lg flex items-center justify-center",
    mobileOnly ? "md:hidden" : "hidden md:flex",
    isStickyFooter
      ? "fixed left-1/2 -translate-x-1/2 bottom-[80px] z-40"
      : "mx-auto",
    className,
  );

  if (enabled) {
    return (
      <div
        className={containerClass}
        style={{ width, height, minHeight: height }}
        data-ad-placement={placement}
        aria-label={t(messages, "ad_slot.enabled_aria")}
      />
    );
  }

  return (
    <div
      className={containerClass}
      style={{
        width,
        height,
        minHeight: height,
        background: "rgba(26, 26, 53, 0.40)",
        border: "1px dashed rgba(196, 163, 90, 0.30)",
      }}
      role="complementary"
      aria-label={t(messages, "ad_slot.placeholder_aria")}
    >
      <div className="flex flex-col items-center gap-1">
        <span
          className="font-display text-[10px] tracking-[0.30em] uppercase text-[#c4a35a]"
        >
          {t(messages, "ad_slot.sponsored_label")}
        </span>
        <span className="font-sans text-[10px] text-[#4a4866]">
          {t(messages, "ad_slot.reserved_caption", { width, height })}
        </span>
      </div>
    </div>
  );
}
