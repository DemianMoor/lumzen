import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "About — LumZen",
  description:
    "LumZen is a free, ad-supported sanctuary for spiritual practice — tarot, natal charts, affirmations, meditation, sound healing, and sacred audiobooks.",
};

export default function AboutPage() {
  return (
    <MarketingPage
      eyebrow="✦ ABOUT LUMZEN"
      title="A sanctuary built for stillness."
      intro="LumZen is your daily spiritual practice platform — combining ancient wisdom, celestial guidance, and embodied practice in one luminous space."
    >
      <h2>What this is</h2>
      <p>
        LumZen brings together five long-standing traditions and lets you
        practice them every day, in one place:
      </p>
      <ul>
        <li>
          <strong>Spiritual Guides</strong> — long-form essays on chakras,
          shadow work, moon phases, and sacred geometry.
        </li>
        <li>
          <strong>Sacred Audiobooks</strong> — public-domain spiritual texts
          read aloud.
        </li>
        <li>
          <strong>Affirmation Practice</strong> — mirror work, journaling,
          breathwork, and daily activities for lasting change.
        </li>
        <li>
          <strong>Meditation &amp; Sound</strong> — nine Solfeggio frequencies,
          binaural tones, and ambient soundscapes.
        </li>
        <li>
          <strong>Celestial Tools</strong> — a daily tarot pull, your natal
          chart, and the cosmos as it actually is.
        </li>
      </ul>

      <h2>What this is not</h2>
      <p>
        LumZen is not a marketplace, a coaching funnel, or a wellness brand
        chasing the next trend. The voice is calm. The visual language is
        cosmic and quiet. The promises are honest — practice may support
        change, not guarantee outcomes.
      </p>

      <h2>How it stays free</h2>
      <p>
        The community pays nothing. The platform is supported by carefully
        chosen, on-brand sponsorships — never popups, never tracking pixels
        that follow you across the internet, never your data sold.
      </p>

      <h2>Who is behind it</h2>
      <p>
        LumZen is built by a small editorial team that believes spiritual
        practice deserves a home as considered as the practice itself. If
        you have feedback, write to{" "}
        <a href="mailto:hello@lumzen.co">hello@lumzen.co</a>.
      </p>
    </MarketingPage>
  );
}
