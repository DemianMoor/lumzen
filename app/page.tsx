import Link from "next/link";
import {
  StarField,
  NebulaBackground,
  LumGlowOrb,
} from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";
import { PILLARS, type PillarSlug } from "@/lib/brand-voice";

export const dynamic = "force-dynamic";

type PillarCard = {
  slug: PillarSlug;
  label: string;
  title: string;
  body: string;
};

const PILLAR_CARDS: PillarCard[] = [
  {
    slug: "guides",
    label: "✦ SPIRITUAL GUIDES",
    title: "Deepen Your Understanding",
    body: "Long-form essays on chakras, shadow work, moon phases, and the foundations of practice. Wisdom you can actually use.",
  },
  {
    slug: "audiobooks",
    label: "✦ SACRED AUDIOBOOKS",
    title: "Voices Across Time",
    body: "Public-domain spiritual texts, read aloud. The books that shaped seekers before you.",
  },
  {
    slug: "affirmations",
    label: "✦ AFFIRMATION PRACTICE",
    title: "Rewire Your Inner World",
    body: "Mirror work, journaling, breathwork, daily challenges. Activities that move from idea to embodied change.",
  },
  {
    slug: "sound",
    label: "✦ MEDITATION & SOUND",
    title: "The Sound Temple",
    body: "Nine Solfeggio frequencies, binaural tones, and silence that speaks. Choose your key.",
  },
  {
    slug: "celestial",
    label: "✦ CELESTIAL TOOLS",
    title: "The Cosmos Awaits",
    body: "A daily tarot pull, your natal chart, and the sky as it actually is. Ancient intelligence for modern life.",
  },
];

export default function LandingPage() {
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
              Where Light Meets Stillness.
            </h1>
            <p className="font-sans text-base md:text-lg text-[#8f8daa] mb-10 leading-relaxed max-w-2xl mx-auto">
              Ancient wisdom. Celestial guidance. Daily practice. One luminous
              space for tarot, natal charts, affirmations, meditation, sound
              healing, and sacred audiobooks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/auth/signup"
                className="inline-block py-3 px-8 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
              >
                Begin Your Journey ✦
              </Link>
              <Link
                href="#pillars"
                className="inline-block py-3 px-8 rounded-full border border-[#c4a35a] text-[#c4a35a] font-sans text-sm hover:bg-[rgba(196,163,90,0.10)] transition-all"
              >
                See What is Inside →
              </Link>
            </div>
            <p className="font-sans text-xs text-[#8f8daa] mt-8">
              Free forever. No payment. Just practice.
            </p>
          </div>
        </section>

        {/* PILLARS */}
        <section id="pillars" className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
                ✦ THE FIVE PILLARS
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#f0eff8] mb-3">
                One sanctuary. Five doorways.
              </h2>
              <p className="font-sans text-sm text-[#8f8daa] max-w-2xl mx-auto leading-relaxed">
                Each pillar is a complete practice in itself. Together they
                form one continuous path of presence.
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
                      {card.label}
                    </p>
                    <h3 className="font-serif italic text-2xl text-[#f0eff8] mb-3 leading-tight">
                      {card.title}
                    </h3>
                    <p className="font-sans text-sm text-[#8f8daa] leading-relaxed">
                      {card.body}
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
              ✦ A QUIET PROMISE
            </p>
            <h2 className="font-serif italic text-3xl md:text-4xl text-[#f0eff8] mb-6 leading-tight">
              The light is already within you.
            </h2>
            <p className="font-sans text-base text-[#8f8daa] leading-relaxed mb-4">
              LumZen exists because spiritual practice deserves a home that is
              calm, beautiful, and honest. No urgency, no upsell, no &ldquo;raise
              your vibration&rdquo; jargon — just the tools.
            </p>
            <p className="font-sans text-base text-[#8f8daa] leading-relaxed">
              The community is free. It is supported by quiet, on-brand
              sponsorships. Your practice belongs to you.
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
              ✦ THE DOOR IS OPEN
            </p>
            <h2 className="font-serif italic text-3xl md:text-4xl text-[#f0eff8] mb-6 leading-tight">
              Step into the sanctuary.
            </h2>
            <Link
              href="/auth/signup"
              className="inline-block py-3 px-10 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
            >
              Begin Your Journey ✦
            </Link>
            <p className="font-sans text-xs text-[#8f8daa] mt-6">
              Free forever. No payment, ever.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
