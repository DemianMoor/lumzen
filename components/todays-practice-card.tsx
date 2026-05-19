"use client";

import Link from "next/link";

type TodaysPracticeCardProps = {
  dayStreak: number;
  affirmationLine: string;
};

const QUICK_STARTS = [
  { href: "/celestial", glyph: "✦", label: "Draw Today's Card" },
  { href: "/affirmations", glyph: "✨", label: "Morning Affirmation" },
  { href: "/sound", glyph: "🔮", label: "Enter Sound Temple" },
] as const;

export function TodaysPracticeCard({
  dayStreak,
  affirmationLine,
}: TodaysPracticeCardProps) {
  return (
    <section
      className="relative overflow-hidden rounded-[20px] p-6 md:p-10"
      style={{
        background:
          "linear-gradient(135deg, rgba(26,26,53,0.95) 0%, rgba(18,18,42,0.95) 100%)",
        border: "1px solid rgba(196, 163, 90, 0.18)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.30)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,163,90,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <p className="font-display text-[11px] tracking-[0.20em] uppercase text-[#c4a35a] mb-3">
        ✦ Your Practice Today
      </p>
      <h2 className="font-serif italic text-3xl md:text-4xl text-[#f0eff8] leading-tight max-w-2xl mb-4">
        {affirmationLine}
      </h2>
      <p className="font-sans text-sm text-[#8f8daa] mb-8">
        Day {dayStreak}{" "}of your journey. You&rsquo;re building something real.
      </p>

      <div className="flex flex-wrap gap-3">
        {QUICK_STARTS.map((qs) => (
          <Link
            key={qs.href}
            href={qs.href}
            className="flex items-center gap-3 px-5 h-11 rounded-full font-sans text-sm text-[#f0eff8] transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 0 0 rgba(196,163,90,0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(196,163,90,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 rgba(196,163,90,0)";
            }}
          >
            <span aria-hidden="true">{qs.glyph}</span>
            <span>{qs.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
