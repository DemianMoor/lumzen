import Link from "next/link";
import {
  IconTarotCard,
  IconNatalChart,
} from "@/components/mystical-icons";
import { getCurrentMessages, t } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const PILLAR_ACCENT = "#8b6fc9"; // lum-glow per BRAND.md §3.3

const TOOLS = [
  {
    href: "/tarot",
    eyebrowKey: "celestial.tool.tarot.eyebrow",
    titleKey: "celestial.tool.tarot.title",
    bodyKey: "celestial.tool.tarot.body",
    Icon: IconTarotCard,
  },
  {
    href: "/natal",
    eyebrowKey: "celestial.tool.natal.eyebrow",
    titleKey: "celestial.tool.natal.title",
    bodyKey: "celestial.tool.natal.body",
    Icon: IconNatalChart,
  },
];

export default async function CelestialPage() {
  const { messages } = await getCurrentMessages();
  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            {t(messages, "celestial.page.eyebrow")}
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            {t(messages, "celestial.page.title")}
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa] max-w-2xl mx-auto">
            {t(messages, "celestial.page.subtitle")}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {TOOLS.map((tool) => {
            const Icon = tool.Icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl p-8 border transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a35a]"
                style={{
                  background: "rgba(26,26,53,0.85)",
                  backdropFilter: "blur(10px)",
                  borderColor: `${PILLAR_ACCENT}33`,
                  boxShadow: `0 0 0 1px ${PILLAR_ACCENT}11`,
                }}
              >
                <div
                  className="flex items-center justify-center h-32 rounded-xl mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${PILLAR_ACCENT}33 0%, ${PILLAR_ACCENT}11 100%)`,
                  }}
                >
                  <Icon color={PILLAR_ACCENT} size={72} className="opacity-90" />
                </div>
                <p
                  className="font-display text-[11px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: PILLAR_ACCENT }}
                >
                  {t(messages, tool.eyebrowKey)}
                </p>
                <h2 className="font-serif italic text-2xl text-[#f0eff8] mb-3 leading-tight">
                  {t(messages, tool.titleKey)}
                </h2>
                <p className="font-sans text-sm text-[#8f8daa] leading-relaxed mb-6">
                  {t(messages, tool.bodyKey)}
                </p>
                <span className="font-sans text-sm text-[#c4a35a] group-hover:underline">
                  {t(messages, "celestial.page.begin_link")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
