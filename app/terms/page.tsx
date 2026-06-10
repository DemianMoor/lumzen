import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing-page";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_OPERATOR,
} from "@/lib/legal/constants";
import { getCurrentMessages, t } from "@/lib/i18n/server";
import { fetchLegalPage } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getCurrentMessages();
  return {
    title: t(messages, "legal.terms.meta.title"),
    description: t(messages, "legal.terms.meta.description"),
  };
}

export default async function TermsPage() {
  const { locale, messages } = await getCurrentMessages();

  // English is managed in the admin panel; uk/ru stay file-based below.
  const db = await fetchLegalPage("terms", locale);
  if (db) {
    return (
      <MarketingPage
        eyebrow={t(messages, "legal.terms.eyebrow")}
        title={db.title}
        intro={t(messages, "legal.terms.intro")}
        quiet
        bodyHtml={db.body}
      />
    );
  }

  return (
    <MarketingPage
      eyebrow={t(messages, "legal.terms.eyebrow")}
      title={t(messages, "legal.terms.title")}
      intro={t(messages, "legal.terms.intro")}
      quiet
    >
      <p className="font-mono text-sm text-[#8f8daa]">
        <strong>{t(messages, "legal.terms.last_updated_label")}</strong> {LEGAL_LAST_UPDATED}
      </p>

      <hr />

      <p>
        {t(messages, "legal.terms.intro.agreement", {
          legalEntity: LEGAL_OPERATOR.legalEntity,
          brand: LEGAL_OPERATOR.brand,
        })}
      </p>
      <p>
        {t(messages, "legal.terms.intro.consent")}{" "}
        <Link href="/privacy">
          <strong>{t(messages, "footer.fine_print.privacy")}</strong>
        </Link>
        .
      </p>
      <p>
        <strong>
          {t(messages, "legal.terms.intro.read_carefully")}
        </strong>
      </p>
      <p>{t(messages, "legal.terms.intro.disagree")}</p>

      <h2 id="section-1">{t(messages, "legal.terms.section.1.heading")}</h2>
      <p>{t(messages, "legal.terms.section.1.intro")}</p>
      <ul>
        <li>{t(messages, "legal.terms.section.1.item_age")}</li>
        <li>{t(messages, "legal.terms.section.1.item_location")}</li>
        <li>{t(messages, "legal.terms.section.1.item_capacity")}</li>
        <li>{t(messages, "legal.terms.section.1.item_not_barred")}</li>
      </ul>
      <p>
        {t(messages, "legal.terms.section.1.accuracy")}
      </p>

      <h2 id="section-2">{t(messages, "legal.terms.section.2.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.2.body_1")}
      </p>
      <p>
        {t(messages, "legal.terms.section.2.body_2")}
      </p>

      <h2 id="section-3">{t(messages, "legal.terms.section.3.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.3.body_1")}
      </p>
      <p>{t(messages, "legal.terms.section.3.body_2")}</p>
      <ul>
        <li>{t(messages, "legal.terms.section.3.item_password")}</li>
        <li>{t(messages, "legal.terms.section.3.item_activity")}</li>
        <li>{t(messages, "legal.terms.section.3.item_notify")}</li>
      </ul>
      <p>
        {t(messages, "legal.terms.section.3.body_3")}
      </p>

      <h2 id="section-4">{t(messages, "legal.terms.section.4.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.4.intro")}
      </p>
      <ul>
        <li>{t(messages, "legal.terms.section.4.item_law")}</li>
        <li>{t(messages, "legal.terms.section.4.item_access")}</li>
        <li>{t(messages, "legal.terms.section.4.item_scrape")}</li>
        <li>{t(messages, "legal.terms.section.4.item_reverse")}</li>
        <li>{t(messages, "legal.terms.section.4.item_disrupt")}</li>
        <li>{t(messages, "legal.terms.section.4.item_harass")}</li>
        <li>{t(messages, "legal.terms.section.4.item_illegal_content")}</li>
        <li>{t(messages, "legal.terms.section.4.item_advice")}</li>
      </ul>

      <h2 id="section-5">{t(messages, "legal.terms.section.5.heading")}</h2>

      <h3>{t(messages, "legal.terms.section.5.our_content.heading")}</h3>
      <p>
        {t(messages, "legal.terms.section.5.our_content.body_1", {
          legalEntity: LEGAL_OPERATOR.legalEntity,
        })}
      </p>
      <p>
        {t(messages, "legal.terms.section.5.our_content.body_2")}
      </p>

      <h3>{t(messages, "legal.terms.section.5.third_party.heading")}</h3>
      <p>{t(messages, "legal.terms.section.5.third_party.intro")}</p>
      <ul>
        <li>{t(messages, "legal.terms.section.5.third_party.item_rws")}</li>
        <li>{t(messages, "legal.terms.section.5.third_party.item_librivox")}</li>
        <li>{t(messages, "legal.terms.section.5.third_party.item_freesound")}</li>
        <li>{t(messages, "legal.terms.section.5.third_party.item_other")}</li>
      </ul>
      <p>{t(messages, "legal.terms.section.5.third_party.governance")}</p>

      <h3>{t(messages, "legal.terms.section.5.user_submitted.heading")}</h3>
      <p>
        {t(messages, "legal.terms.section.5.user_submitted.body")}
      </p>
      <p>{t(messages, "legal.terms.section.5.user_submitted.intro")}</p>
      <ul>
        <li>{t(messages, "legal.terms.section.5.user_submitted.item_yours")}</li>
        <li>{t(messages, "legal.terms.section.5.user_submitted.item_rights")}</li>
        <li>{t(messages, "legal.terms.section.5.user_submitted.item_complies")}</li>
      </ul>

      <h2 id="section-6">{t(messages, "legal.terms.section.6.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.6.intro_1")}
      </p>
      <p>{t(messages, "legal.terms.section.6.intro_2")}</p>
      <ul>
        <li>{t(messages, "legal.terms.section.6.item_machine")}</li>
        <li>{t(messages, "legal.terms.section.6.item_reflection_only")}</li>
        <li>{t(messages, "legal.terms.section.6.item_errors")}</li>
        <li>{t(messages, "legal.terms.section.6.item_decisions")}</li>
      </ul>

      <h2 id="section-7">{t(messages, "legal.terms.section.7.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.7.intro")}
      </p>
      <ul>
        <li>{t(messages, "legal.terms.section.7.item_not_provider")}</li>
        <li>{t(messages, "legal.terms.section.7.item_entertainment")}</li>
        <li>{t(messages, "legal.terms.section.7.item_not_substitute")}</li>
        <li>{t(messages, "legal.terms.section.7.item_consult")}</li>
        <li>{t(messages, "legal.terms.section.7.item_hipaa")}</li>
      </ul>
      <p>
        <strong>{t(messages, "legal.terms.section.7.crisis")}</strong>
      </p>

      <h2 id="section-8">{t(messages, "legal.terms.section.8.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.8.transactional")}
      </p>
      <p>{t(messages, "legal.terms.section.8.intro")}</p>
      <ul>
        <li>{t(messages, "legal.terms.section.8.item_marketing")}</li>
        <li>{t(messages, "legal.terms.section.8.item_sms")}</li>
      </ul>
      <p>
        <Link href="/privacy">{t(messages, "legal.terms.section.8.see_also")}</Link>
      </p>

      <h2 id="section-9">{t(messages, "legal.terms.section.9.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.9.body")}
      </p>

      <h2 id="section-10">{t(messages, "legal.terms.section.10.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.10.body_1")}
      </p>
      <p>{t(messages, "legal.terms.section.10.body_2")}</p>
      <ul>
        <li>{t(messages, "legal.terms.section.10.item_requirements")}</li>
        <li>{t(messages, "legal.terms.section.10.item_ai_accurate")}</li>
        <li>{t(messages, "legal.terms.section.10.item_astrology")}</li>
        <li>{t(messages, "legal.terms.section.10.item_available")}</li>
      </ul>

      <h2 id="section-11">{t(messages, "legal.terms.section.11.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.11.body_1")}
      </p>
      <p>
        {t(messages, "legal.terms.section.11.body_2")}
      </p>
      <p>
        {t(messages, "legal.terms.section.11.body_3")}
      </p>

      <h2 id="section-12">{t(messages, "legal.terms.section.12.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.12.intro")}
      </p>
      <ul>
        <li>{t(messages, "legal.terms.section.12.item_use")}</li>
        <li>{t(messages, "legal.terms.section.12.item_terms")}</li>
        <li>{t(messages, "legal.terms.section.12.item_law")}</li>
        <li>{t(messages, "legal.terms.section.12.item_content")}</li>
      </ul>

      <h2 id="section-13">{t(messages, "legal.terms.section.13.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.13.body_1")}
      </p>
      <p>
        {t(messages, "legal.terms.section.13.body_2")}
      </p>
      <p>
        {t(messages, "legal.terms.section.13.body_3")}
      </p>

      <h2 id="section-14">{t(messages, "legal.terms.section.14.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.14.body_1", {
          province: LEGAL_OPERATOR.province,
        })}
      </p>
      <p>
        {t(messages, "legal.terms.section.14.body_2")}
      </p>
      <p>
        {t(messages, "legal.terms.section.14.body_3", {
          province: LEGAL_OPERATOR.province,
        })}
      </p>
      <p>
        <strong>{t(messages, "legal.terms.section.14.no_class_actions")}</strong>
      </p>

      <h2 id="section-15">{t(messages, "legal.terms.section.15.heading")}</h2>
      <p>
        {t(messages, "legal.terms.section.15.body")}
      </p>

      <h2 id="section-16">{t(messages, "legal.terms.section.16.heading")}</h2>
      <ul>
        <li>{t(messages, "legal.terms.section.16.item_entire")}</li>
        <li>{t(messages, "legal.terms.section.16.item_severability")}</li>
        <li>{t(messages, "legal.terms.section.16.item_no_waiver")}</li>
        <li>{t(messages, "legal.terms.section.16.item_assignment")}</li>
        <li>{t(messages, "legal.terms.section.16.item_contact")}</li>
      </ul>

      <hr />

      <p className="font-sans text-sm text-[#8f8daa]">
        <Link href="/privacy">{t(messages, "legal.terms.see_also")}</Link>
      </p>
    </MarketingPage>
  );
}
