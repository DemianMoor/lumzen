"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";
import {
  IconSacredBook,
  IconChakraSpiral,
  IconMoonPhases,
  IconFlowerOfLife,
  IconAkashicRecords,
  IconProphet,
  IconAncientScroll,
  IconHermetic,
  IconYinYang,
  IconInfiniteWisdom,
  IconMorningRise,
  IconTransformation,
  IconMirrorSelf,
  IconLotusChakra,
  IconBreathWaves,
  IconFrequencyWaves,
  IconSingingBowl,
  IconThetaWave,
  IconLunarSleep,
  IconOmSymbol,
  IconTarotCard,
  IconOracleCrystal,
  IconCelticKnot,
  IconZodiacWheel,
  IconNatalChart,
} from "@/components/mystical-icons";

const ICONS = {
  "sacred-book": IconSacredBook,
  "chakra-spiral": IconChakraSpiral,
  "moon-phases": IconMoonPhases,
  "flower-of-life": IconFlowerOfLife,
  "akashic-records": IconAkashicRecords,
  prophet: IconProphet,
  "ancient-scroll": IconAncientScroll,
  hermetic: IconHermetic,
  "yin-yang": IconYinYang,
  "infinite-wisdom": IconInfiniteWisdom,
  "morning-rise": IconMorningRise,
  transformation: IconTransformation,
  "mirror-self": IconMirrorSelf,
  "lotus-chakra": IconLotusChakra,
  "breath-waves": IconBreathWaves,
  "frequency-waves": IconFrequencyWaves,
  "singing-bowl": IconSingingBowl,
  "theta-wave": IconThetaWave,
  "lunar-sleep": IconLunarSleep,
  "om-symbol": IconOmSymbol,
  "tarot-card": IconTarotCard,
  "oracle-crystal": IconOracleCrystal,
  "celtic-knot": IconCelticKnot,
  "zodiac-wheel": IconZodiacWheel,
  "natal-chart": IconNatalChart,
} as const;

export type IconKey = keyof typeof ICONS;

export type ContentCardProps = {
  href: string;
  title: string;
  category: string;
  meta: string;
  accentColor: string;
  iconKey: IconKey;
  dimmed?: boolean;
  onHoverChange?: (hovered: boolean) => void;
};

export function ContentCard({
  href,
  title,
  category,
  meta,
  accentColor,
  iconKey,
  dimmed,
  onHoverChange,
}: ContentCardProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICONS[iconKey];
  const t = useT();

  const isDimmed = dimmed && !hovered;

  return (
    <Link
      href={href}
      className="flex-shrink-0 w-[240px] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a35a]"
      style={{
        background: "rgba(26, 26, 53, 0.85)",
        backdropFilter: "blur(10px)",
        border: hovered
          ? `1px solid ${accentColor}66`
          : "1px solid rgba(255,255,255,0.06)",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 20px 60px ${accentColor}14` : "none",
        opacity: isDimmed ? 0.6 : 1,
        filter: isDimmed ? "brightness(0.8)" : "none",
      }}
      onMouseEnter={() => {
        setHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange?.(false);
      }}
      onFocus={() => {
        setHovered(true);
        onHoverChange?.(true);
      }}
      onBlur={() => {
        setHovered(false);
        onHoverChange?.(false);
      }}
    >
      <div
        className="h-[140px] flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${accentColor}33 0%, ${accentColor}11 100%)`,
        }}
      >
        <Icon color={accentColor} size={64} className="opacity-90" />
      </div>
      <div className="p-4">
        <span
          className="inline-block px-2 py-0.5 rounded-full text-[9px] font-display uppercase tracking-[0.10em] mb-2"
          style={{ background: `${accentColor}22`, color: accentColor }}
        >
          {category}
        </span>
        <h3 className="font-serif text-base text-[#f0eff8] mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="font-mono text-[11px] text-[#4a4866]">{meta}</p>
        <div className="flex items-center justify-end mt-3">
          <span className="font-sans text-xs text-[#c4a35a] group-hover:underline">
            {t("content_card.cta")}
          </span>
        </div>
      </div>
    </Link>
  );
}
