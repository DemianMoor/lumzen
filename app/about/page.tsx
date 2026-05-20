import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";
import { getCurrentMessages, t } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getCurrentMessages();
  return {
    title: t(messages, "marketing.about.meta.title"),
    description: t(messages, "marketing.about.meta.description"),
  };
}

export default async function AboutPage() {
  const { messages } = await getCurrentMessages();
  return (
    <MarketingPage
      eyebrow={t(messages, "marketing.about.eyebrow")}
      title={t(messages, "marketing.about.title")}
      intro={t(messages, "marketing.about.intro")}
    >
      <h2>{t(messages, "marketing.about.section.what_this_is.heading")}</h2>
      <p>
        {t(messages, "marketing.about.section.what_this_is.body")}
      </p>
      <ul>
        <li>
          {t(messages, "marketing.about.section.what_this_is.item_guides")}
        </li>
        <li>
          {t(messages, "marketing.about.section.what_this_is.item_audiobooks")}
        </li>
        <li>
          {t(messages, "marketing.about.section.what_this_is.item_affirmations")}
        </li>
        <li>
          {t(messages, "marketing.about.section.what_this_is.item_sound")}
        </li>
        <li>
          {t(messages, "marketing.about.section.what_this_is.item_celestial")}
        </li>
      </ul>

      <h2>{t(messages, "marketing.about.section.what_this_is_not.heading")}</h2>
      <p>
        {t(messages, "marketing.about.section.what_this_is_not.body")}
      </p>

      <h2>{t(messages, "marketing.about.section.how_it_stays_free.heading")}</h2>
      <p>
        {t(messages, "marketing.about.section.how_it_stays_free.body")}
      </p>

      <h2>{t(messages, "marketing.about.section.who_is_behind.heading")}</h2>
      <p>
        {t(messages, "marketing.about.section.who_is_behind.body")}
      </p>
    </MarketingPage>
  );
}
