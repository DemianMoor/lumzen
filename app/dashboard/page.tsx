import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import { SiteHeader } from "@/components/site-header";
import { TodaysPracticeCard } from "@/components/todays-practice-card";
import { ContentRow, type ContentRowItem } from "@/components/content-row";
import { AdSlot } from "@/components/ad-slot";
import { PILLARS } from "@/lib/brand-voice";
import { moonPhaseFor } from "@/lib/moon-phase";
import {
  IconSacredBook,
  IconChakraSpiral,
  IconMoonPhases,
  IconFlowerOfLife,
  IconProphet,
  IconAncientScroll,
  IconHermetic,
  IconYinYang,
  IconMorningRise,
  IconMirrorSelf,
  IconLotusChakra,
  IconBreathWaves,
  IconFrequencyWaves,
  IconSingingBowl,
  IconThetaWave,
  IconLunarSleep,
  IconTarotCard,
  IconOracleCrystal,
  IconZodiacWheel,
  IconNatalChart,
} from "@/components/mystical-icons";

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

  const guideItems: ContentRowItem[] = [
    {
      href: "/guides/the-seven-chakras",
      title: "The Seven Chakras",
      category: "Energy",
      meta: "12 min read",
      Icon: IconChakraSpiral,
    },
    {
      href: "/guides/reading-the-moon",
      title: "Reading the Moon",
      category: "Lunar",
      meta: "8 min read",
      Icon: IconMoonPhases,
    },
    {
      href: "/guides/sacred-geometry",
      title: "Sacred Geometry",
      category: "Foundations",
      meta: "15 min read",
      Icon: IconFlowerOfLife,
    },
    {
      href: "/guides/shadow-work",
      title: "Shadow Work, Gently",
      category: "Inner Work",
      meta: "10 min read",
      Icon: IconSacredBook,
    },
  ];

  const audiobookItems: ContentRowItem[] = [
    {
      href: "/audiobooks/the-prophet",
      title: "The Prophet",
      category: "Kahlil Gibran",
      meta: "2h 14m",
      Icon: IconProphet,
    },
    {
      href: "/audiobooks/tao-te-ching",
      title: "Tao Te Ching",
      category: "Lao Tzu",
      meta: "1h 48m",
      Icon: IconYinYang,
    },
    {
      href: "/audiobooks/kybalion",
      title: "The Kybalion",
      category: "Hermetic",
      meta: "3h 02m",
      Icon: IconHermetic,
    },
    {
      href: "/audiobooks/meditations",
      title: "Meditations",
      category: "Marcus Aurelius",
      meta: "5h 36m",
      Icon: IconAncientScroll,
    },
  ];

  const affirmationItems: ContentRowItem[] = [
    {
      href: "/affirmations/morning-abundance",
      title: "Morning Abundance Flow",
      category: "Daily",
      meta: "7 min",
      Icon: IconMorningRise,
    },
    {
      href: "/affirmations/mirror-work",
      title: "Mirror Work",
      category: "Self",
      meta: "10 min",
      Icon: IconMirrorSelf,
    },
    {
      href: "/affirmations/chakra-sequence",
      title: "Chakra Sequence",
      category: "Energy",
      meta: "12 min",
      Icon: IconLotusChakra,
    },
    {
      href: "/affirmations/breathe-affirm",
      title: "Breathe & Affirm",
      category: "Breathwork",
      meta: "5 min",
      Icon: IconBreathWaves,
    },
  ];

  const soundItems: ContentRowItem[] = [
    {
      href: "/sound/528-hz",
      title: "528 Hz · Love",
      category: "Solfeggio",
      meta: "30 min",
      Icon: IconFrequencyWaves,
    },
    {
      href: "/sound/singing-bowls",
      title: "Tibetan Singing Bowls",
      category: "Resonance",
      meta: "45 min",
      Icon: IconSingingBowl,
    },
    {
      href: "/sound/theta-binaural",
      title: "Theta Binaural",
      category: "Brainwave",
      meta: "60 min",
      Icon: IconThetaWave,
    },
    {
      href: "/sound/lunar-sleep",
      title: "Lunar Sleep",
      category: "Rest",
      meta: "90 min",
      Icon: IconLunarSleep,
    },
  ];

  const celestialItems: ContentRowItem[] = [
    {
      href: "/celestial/daily-tarot",
      title: "Daily Tarot Pull",
      category: "Tarot",
      meta: "Today",
      Icon: IconTarotCard,
    },
    {
      href: "/celestial/oracle",
      title: "Oracle of the Day",
      category: "Oracle",
      meta: "Today",
      Icon: IconOracleCrystal,
    },
    {
      href: "/celestial/zodiac",
      title: "Your Sign Today",
      category: "Astrology",
      meta: "2 min read",
      Icon: IconZodiacWheel,
    },
    {
      href: "/celestial/natal-chart",
      title: "Your Natal Chart",
      category: "Astrology",
      meta: "Saved",
      Icon: IconNatalChart,
    },
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
