import Link from "next/link";
import {
  StarField,
  NebulaBackground,
  LumGlowOrb,
} from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";
import { getCurrentMessages, t } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type PillarCardKeys = {
  slug: PillarSlug;
  labelKey: string;
  titleKey: string;
  bodyKey: string;
};

const PILLAR_CARDS: PillarCardKeys[] = [
  {
    slug: "guides",
    labelKey: "marketing.landing.pillar_card.guides.label",
    titleKey: "marketing.landing.pillar_card.guides.title",
    bodyKey: "marketing.landing.pillar_card.guides.body",
  },
  {
    slug: "audiobooks",
    labelKey: "marketing.landing.pillar_card.audiobooks.label",
    titleKey: "marketing.landing.pillar_card.audiobooks.title",
    bodyKey: "marketing.landing.pillar_card.audiobooks.body",
  },
  {
    slug: "affirmations",
    labelKey: "marketing.landing.pillar_card.affirmations.label",
    titleKey: "marketing.landing.pillar_card.affirmations.title",
    bodyKey: "marketing.landing.pillar_card.affirmations.body",
  },
  {
    slug: "sound",
    labelKey: "marketing.landing.pillar_card.sound.label",
    titleKey: "marketing.landing.pillar_card.sound.title",
    bodyKey: "marketing.landing.pillar_card.sound.body",
  },
  {
    slug: "celestial",
    labelKey: "marketing.landing.pillar_card.celestial.label",
    titleKey: "marketing.landing.pillar_card.celestial.title",
    bodyKey: "marketing.landing.pillar_card.celestial.body",
  },
];

export default async function LandingPage() {
  const { messages } = await getCurrentMessages();
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StarField />
      <NebulaBackground />
      <LumGlowOrb />

      <SiteHeader />

      <main className="relative z-10 flex-1">
        {/* HERO */}
        <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <span className="inline-block text-[32px] leading-none text-[#c4a35a]">
                ✦
              </span>
            </div>
            <p className="font-display text-[15px] tracking-[0.1em] mb-6 text-[#c4a35a]">
              LumZen
            </p>
            <h1 className="font-serif italic text-4xl md:text-6xl text-[#f0eff8] mb-6 leading-tight">
              {t(messages, "marketing.landing.hero.title")}
            </h1>
            <p className="font-sans text-base md:text-lg text-[#8f8daa] mb-10 leading-relaxed max-w-2xl mx-auto">
              {t(messages, "marketing.landing.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/auth/signup"
                className="inline-block py-3 px-8 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
              >
                {t(messages, "marketing.landing.hero.cta_primary")}
              </Link>
              <Link
                href="#pillars"
                className="inline-block py-3 px-8 rounded-full border border-[#c4a35a] text-[#c4a35a] font-sans text-sm hover:bg-[rgba(196,163,90,0.10)] transition-all"
              >
                {t(messages, "marketing.landing.hero.cta_secondary")}
              </Link>
            </div>
            <p className="font-sans text-xs text-[#8f8daa] mt-8">
              {t(messages, "marketing.landing.hero.fine_print")}
            </p>
          </div>
        </section>

        {/* PILLARS */}
        <section id="pillars" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
                {t(messages, "marketing.landing.pillars.eyebrow")}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#f0eff8] mb-3">
                {t(messages, "marketing.landing.pillars.title")}
              </h2>
              <p className="font-sans text-sm text-[#8f8daa] max-w-2xl mx-auto leading-relaxed">
                {t(messages, "marketing.landing.pillars.intro")}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PILLAR_CARDS.map((card) => {
                const accent = PILLARS[card.slug].accent;
                return (
                  <div
                    key={card.slug}
                    className="rounded-2xl p-6 md:p-8 transition-all duration-200 hover:-translate-y-1"
                    style={{
                      background: "rgba(26,26,53,0.85)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${accent}33`,
                      boxShadow: `0 0 0 1px ${accent}11`,
                    }}
                  >
                    <p
                      className="font-display text-[11px] tracking-[0.2em] uppercase mb-3"
                      style={{ color: accent }}
                    >
                      {t(messages, card.labelKey)}
                    </p>
                    <h3 className="font-serif italic text-2xl text-[#f0eff8] mb-3 leading-tight">
                      {t(messages, card.titleKey)}
                    </h3>
                    <p className="font-sans text-sm text-[#8f8daa] leading-relaxed">
                      {t(messages, card.bodyKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHY LUMZEN */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
              {t(messages, "marketing.landing.why.eyebrow")}
            </p>
            <h2 className="font-serif italic text-3xl md:text-4xl text-[#f0eff8] mb-6 leading-tight">
              {t(messages, "marketing.landing.why.title")}
            </h2>
            <p className="font-sans text-base text-[#8f8daa] leading-relaxed mb-4">
              {t(messages, "marketing.landing.why.body_1")}
            </p>
            <p className="font-sans text-base text-[#8f8daa] leading-relaxed">
              {t(messages, "marketing.landing.why.body_2")}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 md:py-24">
          <div
            className="mx-auto max-w-3xl rounded-3xl p-10 md:p-16 text-center"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(196,163,90,0.20)",
            }}
          >
            <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
              {t(messages, "marketing.landing.cta.eyebrow")}
            </p>
            <h2 className="font-serif italic text-3xl md:text-4xl text-[#f0eff8] mb-6 leading-tight">
              {t(messages, "marketing.landing.cta.title")}
            </h2>
            <Link
              href="/auth/signup"
              className="inline-block py-3 px-10 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
            >
              {t(messages, "marketing.landing.cta.button")}
            </Link>
            <p className="font-sans text-xs text-[#8f8daa] mt-6">
              {t(messages, "marketing.landing.cta.fine_print")}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
