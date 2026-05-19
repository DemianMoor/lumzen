"use client";

import Link from "next/link";
import { useState } from "react";
import { ContentCard, type ContentCardProps } from "@/components/content-card";

export type ContentRowItem = Omit<
  ContentCardProps,
  "dimmed" | "onHoverChange" | "accentColor" | "Icon"
> & {
  Icon: ContentCardProps["Icon"];
};

export type ContentRowProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accentColor: string;
  seeAllHref?: string;
  items: ContentRowItem[];
};

export function ContentRow({
  eyebrow,
  title,
  subtitle,
  accentColor,
  seeAllHref,
  items,
}: ContentRowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative">
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <p
            className="font-display text-[11px] tracking-[0.20em] uppercase mb-1"
            style={{ color: accentColor }}
          >
            ✦ {eyebrow}
          </p>
          <h2 className="font-serif italic text-2xl text-[#f0eff8]">{title}</h2>
          <p className="font-sans text-sm text-[#8f8daa] mt-1">{subtitle}</p>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="hidden md:inline-block font-sans text-sm text-[#c4a35a] hover:underline shrink-0"
          >
            See all →
          </Link>
        )}
      </div>

      <div className="-mx-6 px-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {items.map((item, idx) => (
            <ContentCard
              key={`${item.href}-${idx}`}
              {...item}
              accentColor={accentColor}
              dimmed={hoveredIndex !== null && hoveredIndex !== idx}
              onHoverChange={(h) => setHoveredIndex(h ? idx : null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
