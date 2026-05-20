import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentLocale, getCurrentMessages, t } from "@/lib/i18n/server";
import { AffirmationsClient } from "./affirmations-client";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { key: "abundance", labelKey: "affirmations.category.abundance.label", descriptionKey: "affirmations.category.abundance.description" },
  { key: "love", labelKey: "affirmations.category.love.label", descriptionKey: "affirmations.category.love.description" },
  { key: "health", labelKey: "affirmations.category.health.label", descriptionKey: "affirmations.category.health.description" },
  { key: "identity", labelKey: "affirmations.category.identity.label", descriptionKey: "affirmations.category.identity.description" },
  { key: "manifestation", labelKey: "affirmations.category.manifestation.label", descriptionKey: "affirmations.category.manifestation.description" },
  { key: "morning", labelKey: "affirmations.category.morning.label", descriptionKey: "affirmations.category.morning.description" },
  { key: "sleep", labelKey: "affirmations.category.sleep.label", descriptionKey: "affirmations.category.sleep.description" },
  { key: "shadow_work", labelKey: "affirmations.category.shadow_work.label", descriptionKey: "affirmations.category.shadow_work.description" },
];

const CHAKRA_CATEGORIES = [
  { key: "chakra_root", labelKey: "affirmations.chakra.chakra_root.label", descriptionKey: "affirmations.chakra.chakra_root.description" },
  { key: "chakra_sacral", labelKey: "affirmations.chakra.chakra_sacral.label", descriptionKey: "affirmations.chakra.chakra_sacral.description" },
  { key: "chakra_solar", labelKey: "affirmations.chakra.chakra_solar.label", descriptionKey: "affirmations.chakra.chakra_solar.description" },
  { key: "chakra_heart", labelKey: "affirmations.chakra.chakra_heart.label", descriptionKey: "affirmations.chakra.chakra_heart.description" },
  { key: "chakra_throat", labelKey: "affirmations.chakra.chakra_throat.label", descriptionKey: "affirmations.chakra.chakra_throat.description" },
  { key: "chakra_third_eye", labelKey: "affirmations.chakra.chakra_third_eye.label", descriptionKey: "affirmations.chakra.chakra_third_eye.description" },
  { key: "chakra_crown", labelKey: "affirmations.chakra.chakra_crown.label", descriptionKey: "affirmations.chakra.chakra_crown.description" },
];

export default async function AffirmationsPage() {
  const supabase = await createSupabaseServerClient();
  const { messages } = await getCurrentMessages();
  const locale = await getCurrentLocale();
  const { data: affirmations } = await supabase
    .from("affirmations")
    .select("id, text, category, chakra")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("text", { ascending: true });

  const localizedCategories = CATEGORIES.map((c) => ({
    key: c.key,
    label: t(messages, c.labelKey),
    description: t(messages, c.descriptionKey),
  }));
  const localizedChakras = CHAKRA_CATEGORIES.map((c) => ({
    key: c.key,
    label: t(messages, c.labelKey),
    description: t(messages, c.descriptionKey),
  }));

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#6bcc9e] mb-3">
            {t(messages, "affirmations.page.eyebrow")}
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            {t(messages, "affirmations.page.title")}
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa]">
            {t(messages, "affirmations.page.subtitle")}
          </p>
        </header>

        <AffirmationsClient
          categories={localizedCategories}
          chakras={localizedChakras}
          affirmations={affirmations ?? []}
        />
      </div>
    </main>
  );
}
