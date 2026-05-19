import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import { SiteHeader } from "@/components/site-header";
import { TodaysPracticeCard } from "@/components/todays-practice-card";
import { ContentRow, type ContentRowItem } from "@/components/content-row";
import { AdSlot } from "@/components/ad-slot";
import { PILLARS } from "@/lib/brand-voice";
import { moonPhaseFor } from "@/lib/moon-phase";

export const dynamic = "force-dynamic";

function timeBasedGreeting(hour: number, name: string) {
  if (hour >= 5 && hour < 12) {
    return {
      greeting: `Good morning, ${name}`,
      subtitle: "The light is already within you.",
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      greeting: `Good afternoon, ${name}`,
      subtitle: "Stillness is available right now.",
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      greeting: `Good evening, ${name}`,
      subtitle: "The stars are beginning to listen.",
    };
  }
  return {
    greeting: `Rest well, ${name}`,
    subtitle: "Your practice continues in your dreams.",
  };
}

const PRACTICE_LINES = [
  "The light is already within you.",
  "The cosmos has always been speaking.",
  "Stillness is a practice, not a destination.",
  "What you tend to grows quiet, then strong.",
  "The day was never the noise. The day was the listening.",
  "Begin again. The beginning is always available.",
  "Your breath is a doorway. Walk through.",
] as const;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const admin = createSupabaseAdmin();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("display_name, day_streak")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ||
    (user.email ? user.email.split("@")[0] : "traveler");
  const dayStreak = profile?.day_streak ?? 1;

  const now = new Date();
  const hour = now.getHours();
  const { greeting, subtitle } = timeBasedGreeting(hour, displayName);
  const moon = moonPhaseFor(now);
  const todayLabel = DATE_FORMATTER.format(now);

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  const practiceLine = PRACTICE_LINES[dayOfYear % PRACTICE_LINES.length];

  // Dashboard placeholder cards: each links to its pillar's top-level page,
  // where the real list is rendered against live data.
  const guideItems: ContentRowItem[] = [
    { href: "/guides", title: "The Seven Chakras", category: "Energy", meta: "12 min read", iconKey: "chakra-spiral" },
    { href: "/guides", title: "Reading the Moon", category: "Lunar", meta: "8 min read", iconKey: "moon-phases" },
    { href: "/guides", title: "Sacred Geometry", category: "Foundations", meta: "15 min read", iconKey: "flower-of-life" },
    { href: "/guides", title: "Shadow Work, Gently", category: "Inner Work", meta: "10 min read", iconKey: "sacred-book" },
  ];

  const audiobookItems: ContentRowItem[] = [
    { href: "/audiobooks", title: "The Prophet", category: "Kahlil Gibran", meta: "2h 14m", iconKey: "prophet" },
    { href: "/audiobooks", title: "Tao Te Ching", category: "Lao Tzu", meta: "1h 48m", iconKey: "yin-yang" },
    { href: "/audiobooks", title: "The Kybalion", category: "Hermetic", meta: "3h 02m", iconKey: "hermetic" },
    { href: "/audiobooks", title: "Meditations", category: "Marcus Aurelius", meta: "5h 36m", iconKey: "ancient-scroll" },
  ];

  const affirmationItems: ContentRowItem[] = [
    { href: "/affirmations", title: "Morning Abundance Flow", category: "Daily", meta: "7 min", iconKey: "morning-rise" },
    { href: "/affirmations", title: "Mirror Work", category: "Self", meta: "10 min", iconKey: "mirror-self" },
    { href: "/affirmations", title: "Chakra Sequence", category: "Energy", meta: "12 min", iconKey: "lotus-chakra" },
    { href: "/affirmations", title: "Breathe & Affirm", category: "Breathwork", meta: "5 min", iconKey: "breath-waves" },
  ];

  const soundItems: ContentRowItem[] = [
    { href: "/sound", title: "528 Hz · Love", category: "Solfeggio", meta: "30 min", iconKey: "frequency-waves" },
    { href: "/sound", title: "Tibetan Singing Bowls", category: "Resonance", meta: "45 min", iconKey: "singing-bowl" },
    { href: "/sound", title: "Theta Binaural", category: "Brainwave", meta: "60 min", iconKey: "theta-wave" },
    { href: "/sound", title: "Lunar Sleep", category: "Rest", meta: "90 min", iconKey: "lunar-sleep" },
  ];

  const celestialItems: ContentRowItem[] = [
    { href: "/tarot", title: "Daily Tarot Pull", category: "Tarot", meta: "Today", iconKey: "tarot-card" },
    { href: "/tarot", title: "Oracle of the Day", category: "Oracle", meta: "Today", iconKey: "oracle-crystal" },
    { href: "/natal", title: "Your Sign Today", category: "Astrology", meta: "2 min read", iconKey: "zodiac-wheel" },
    { href: "/natal", title: "Your Natal Chart", category: "Astrology", meta: "Saved", iconKey: "natal-chart" },
  ];

  return (
    <>
      <SiteHeader
        greeting={greeting}
        subtitle={subtitle}
        displayName={displayName}
        dayStreak={dayStreak}
        moonPhase={moon.name}
        todayLabel={todayLabel}
      />

      <main className="px-6 py-8 max-w-7xl mx-auto space-y-12">
        <div style={{ animation: "fadeUp 0.6s ease-out 0.00s forwards" }}>
          <TodaysPracticeCard
            dayStreak={dayStreak}
            affirmationLine={practiceLine}
          />
        </div>

        <div
          style={{ animation: "fadeUp 0.6s ease-out 0.08s forwards", opacity: 0 }}
          className="flex justify-center"
        >
          <AdSlot placement="leaderboard" />
        </div>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.16s forwards", opacity: 0 }}>
          <ContentRow
            eyebrow="Celestial Tools"
            title="The Cosmos Awaits"
            subtitle="Ancient intelligence for your modern life"
            accentColor={PILLARS.celestial.accent}
            seeAllHref="/celestial"
            items={celestialItems}
          />
        </div>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.24s forwards", opacity: 0 }}>
          <ContentRow
            eyebrow="Affirmation Practice"
            title="Rewire Your Inner World"
            subtitle="Daily activities for lasting change"
            accentColor={PILLARS.affirmations.accent}
            seeAllHref="/affirmations"
            items={affirmationItems}
          />
        </div>

        <div
          style={{ animation: "fadeUp 0.6s ease-out 0.32s forwards", opacity: 0 }}
          className="flex justify-center"
        >
          <AdSlot placement="in-feed" />
        </div>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.40s forwards", opacity: 0 }}>
          <ContentRow
            eyebrow="Meditation & Sound"
            title="The Sound Temple"
            subtitle="Frequencies that restore. Silence that speaks."
            accentColor={PILLARS.sound.accent}
            seeAllHref="/sound"
            items={soundItems}
          />
        </div>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.48s forwards", opacity: 0 }}>
          <ContentRow
            eyebrow="Sacred Audiobooks"
            title="Voices Across Time"
            subtitle="The texts that shaped seekers before you"
            accentColor={PILLARS.audiobooks.accent}
            seeAllHref="/audiobooks"
            items={audiobookItems}
          />
        </div>

        <div style={{ animation: "fadeUp 0.6s ease-out 0.56s forwards", opacity: 0 }}>
          <ContentRow
            eyebrow="Spiritual Guides"
            title="Deepen Your Understanding"
            subtitle="Wisdom you can actually use"
            accentColor={PILLARS.guides.accent}
            seeAllHref="/guides"
            items={guideItems}
          />
        </div>

        <div className="flex justify-center md:hidden">
          <AdSlot placement="sticky-footer" />
        </div>
      </main>
    </>
  );
}
