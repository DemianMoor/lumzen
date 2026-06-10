import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing-page";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_OPERATOR,
  LEGAL_CONTACTS,
} from "@/lib/legal/constants";
import { getCurrentMessages, t } from "@/lib/i18n/server";
import { fetchLegalPage } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getCurrentMessages();
  return {
    title: t(messages, "legal.privacy.meta.title"),
    description: t(messages, "legal.privacy.meta.description"),
  };
}

export default async function PrivacyPage() {
  const { locale, messages } = await getCurrentMessages();

  // English is managed in the admin panel; uk/ru stay file-based below.
  const db = await fetchLegalPage("privacy", locale);
  if (db) {
    return (
      <MarketingPage
        eyebrow={t(messages, "legal.privacy.eyebrow")}
        title={db.title}
        intro={t(messages, "legal.privacy.intro")}
        quiet
        bodyHtml={db.body}
      />
    );
  }

  return (
    <MarketingPage
      eyebrow={t(messages, "legal.privacy.eyebrow")}
      title={t(messages, "legal.privacy.title")}
      intro={t(messages, "legal.privacy.intro")}
      quiet
    >
      <p className="font-mono text-sm text-[#8f8daa]">
        <strong>{t(messages, "legal.privacy.last_updated_label")}</strong> {LEGAL_LAST_UPDATED}
      </p>

      <hr />

      <p>
        {t(messages, "legal.privacy.intro.who_we_are", {
          legalEntity: LEGAL_OPERATOR.legalEntity,
          brand: LEGAL_OPERATOR.brand,
        })}
      </p>
      <p>
        {t(messages, "legal.privacy.intro.what_lumzen_offers")}
      </p>
      <p>
        {t(messages, "legal.privacy.intro.us_only")}
      </p>
      <p>
        {t(messages, "legal.privacy.intro.opt_out")}
      </p>

      <h2 id="section-1">{t(messages, "legal.privacy.section.1.heading")}</h2>
      <ul>
        <li><strong>{t(messages, "legal.privacy.section.1.label_brand")}</strong> {LEGAL_OPERATOR.brand}</li>
        <li><strong>{t(messages, "legal.privacy.section.1.label_website")}</strong> lumzen.co</li>
        <li><strong>{t(messages, "legal.privacy.section.1.label_legal_entity")}</strong> {LEGAL_OPERATOR.legalEntity} {t(messages, "legal.privacy.section.1.value_legal_entity_suffix")}</li>
        <li><strong>{t(messages, "legal.privacy.section.1.label_operating_location")}</strong> {LEGAL_OPERATOR.operatingCountry}</li>
        <li><strong>{t(messages, "legal.privacy.section.1.label_service_region")}</strong> {LEGAL_OPERATOR.serviceRegion}</li>
        <li>
          <strong>{t(messages, "legal.privacy.section.1.label_email")}</strong>{" "}
          <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>
        </li>
        <li>
          <strong>{t(messages, "legal.privacy.section.1.label_general_contact")}</strong>{" "}
          <a href={`mailto:${LEGAL_CONTACTS.general}`}>{LEGAL_CONTACTS.general}</a>
        </li>
        <li>
          <strong>{t(messages, "legal.privacy.section.1.label_phone")}</strong>{" "}
          <a href={LEGAL_CONTACTS.phoneHref}>{LEGAL_CONTACTS.phone}</a>
        </li>
      </ul>
      <p>
        {t(messages, "legal.privacy.section.1.transfer_notice")}
      </p>

      <h2 id="section-2">{t(messages, "legal.privacy.section.2.heading")}</h2>
      <p>{t(messages, "legal.privacy.section.2.body_1")}</p>
      <p>{t(messages, "legal.privacy.section.2.body_2")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.2.list_third_party_sites")}</li>
        <li>{t(messages, "legal.privacy.section.2.list_ad_networks")}</li>
        <li>{t(messages, "legal.privacy.section.2.list_third_party_auth")}</li>
      </ul>
      <p>{t(messages, "legal.privacy.section.2.review_notice")}</p>

      <h2 id="section-3">{t(messages, "legal.privacy.section.3.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.3.definition")}
      </p>

      <h3>{t(messages, "legal.privacy.section.3.a.heading")}</h3>
      <p>{t(messages, "legal.privacy.section.3.a.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.3.a.item_identifiers")}</li>
        <li>{t(messages, "legal.privacy.section.3.a.item_account")}</li>
        <li>{t(messages, "legal.privacy.section.3.a.item_practice_data")}</li>
        <li>{t(messages, "legal.privacy.section.3.a.item_message_content")}</li>
        <li>{t(messages, "legal.privacy.section.3.a.item_preferences")}</li>
      </ul>
      <p>{t(messages, "legal.privacy.section.3.a.choose_note")}</p>
      <blockquote>
        {t(messages, "legal.privacy.section.3.a.birth_data_note")}
      </blockquote>

      <h3>{t(messages, "legal.privacy.section.3.b.heading")}</h3>
      <p>{t(messages, "legal.privacy.section.3.b.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.3.b.item_device")}</li>
        <li>{t(messages, "legal.privacy.section.3.b.item_usage")}</li>
        <li>{t(messages, "legal.privacy.section.3.b.item_location")}</li>
      </ul>

      <h3>{t(messages, "legal.privacy.section.3.c.heading")}</h3>
      <p>{t(messages, "legal.privacy.section.3.c.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.3.c.item_functionality")}</li>
        <li>{t(messages, "legal.privacy.section.3.c.item_auth")}</li>
        <li>{t(messages, "legal.privacy.section.3.c.item_analytics")}</li>
        <li>{t(messages, "legal.privacy.section.3.c.item_preferences")}</li>
        <li>{t(messages, "legal.privacy.section.3.c.item_engagement")}</li>
        <li>{t(messages, "legal.privacy.section.3.c.item_ads")}</li>
      </ul>
      <p>
        {t(messages, "legal.privacy.section.3.c.controls")}
      </p>

      <h2 id="section-4">{t(messages, "legal.privacy.section.4.heading")}</h2>
      <p>{t(messages, "legal.privacy.section.4.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.4.item_interaction")}</li>
        <li>{t(messages, "legal.privacy.section.4.item_opt_in")}</li>
        <li>{t(messages, "legal.privacy.section.4.item_chart")}</li>
        <li>{t(messages, "legal.privacy.section.4.item_support")}</li>
        <li>{t(messages, "legal.privacy.section.4.item_automatic")}</li>
        <li>{t(messages, "legal.privacy.section.4.item_partners")}</li>
      </ul>
      <p>
        {t(messages, "legal.privacy.section.4.about_others")}
      </p>

      <h2 id="section-5">{t(messages, "legal.privacy.section.5.heading")}</h2>
      <p>{t(messages, "legal.privacy.section.5.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.5.item_provide")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_generate")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_communications")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_administer")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_personalize")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_ads")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_support")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_fraud")}</li>
        <li>{t(messages, "legal.privacy.section.5.item_legal")}</li>
      </ul>

      <h2 id="section-6">{t(messages, "legal.privacy.section.6.heading")}</h2>
      <h3>{t(messages, "legal.privacy.section.6.a.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.6.a.body")}
      </p>

      <h3>{t(messages, "legal.privacy.section.6.b.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.6.b.body")}
      </p>

      <h3>{t(messages, "legal.privacy.section.6.c.heading")}</h3>
      <p>{t(messages, "legal.privacy.section.6.c.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.6.c.item_law")}</li>
        <li>{t(messages, "legal.privacy.section.6.c.item_safety")}</li>
        <li>{t(messages, "legal.privacy.section.6.c.item_transfer")}</li>
      </ul>

      <h3>{t(messages, "legal.privacy.section.6.d.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.6.d.body")}
      </p>

      <h2 id="section-7">{t(messages, "legal.privacy.section.7.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.7.intro")}
      </p>
      <ul>
        <li>{t(messages, "legal.privacy.section.7.item_purpose")}</li>
        <li>{t(messages, "legal.privacy.section.7.item_frequency")}</li>
        <li>{t(messages, "legal.privacy.section.7.item_rates")}</li>
        <li>{t(messages, "legal.privacy.section.7.item_optout")}</li>
        <li>{t(messages, "legal.privacy.section.7.item_help")}</li>
        <li>{t(messages, "legal.privacy.section.7.item_carrier")}</li>
      </ul>

      <h3>{t(messages, "legal.privacy.section.7.a.heading")}</h3>
      <p>{t(messages, "legal.privacy.section.7.a.intro")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.7.a.item_no_sale")}</li>
        <li>{t(messages, "legal.privacy.section.7.a.item_no_share_optin")}</li>
      </ul>

      <h3>{t(messages, "legal.privacy.section.7.b.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.7.b.body")}
      </p>

      <h3>{t(messages, "legal.privacy.section.7.c.heading")}</h3>
      <p>{t(messages, "legal.privacy.section.7.c.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.7.c.item_consent")}</li>
        <li>{t(messages, "legal.privacy.section.7.c.item_stop")}</li>
        <li>{t(messages, "legal.privacy.section.7.c.item_legal")}</li>
        <li>{t(messages, "legal.privacy.section.7.c.item_abuse")}</li>
      </ul>

      <h2 id="section-8">{t(messages, "legal.privacy.section.8.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.8.intro")}
      </p>
      <ul>
        <li>{t(messages, "legal.privacy.section.8.item_sender")}</li>
        <li>{t(messages, "legal.privacy.section.8.item_subjects")}</li>
        <li>{t(messages, "legal.privacy.section.8.item_unsubscribe")}</li>
      </ul>
      <p>
        {t(messages, "legal.privacy.section.8.optout")}
      </p>
      <p>
        {t(messages, "legal.privacy.section.8.transactional")}
      </p>

      <h2 id="section-9">{t(messages, "legal.privacy.section.9.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.9.intro")}
      </p>

      <h3>{t(messages, "legal.privacy.section.9.how.heading")}</h3>
      <ul>
        <li>{t(messages, "legal.privacy.section.9.how.item_networks")}</li>
        <li>{t(messages, "legal.privacy.section.9.how.item_collect")}</li>
        <li>{t(messages, "legal.privacy.section.9.how.item_no_share")}</li>
        <li>{t(messages, "legal.privacy.section.9.how.item_contextual")}</li>
      </ul>

      <h3>{t(messages, "legal.privacy.section.9.choices.heading")}</h3>
      <ul>
        <li>{t(messages, "legal.privacy.section.9.choices.item_optout")}</li>
        <li>{t(messages, "legal.privacy.section.9.choices.item_mobile")}</li>
        <li>{t(messages, "legal.privacy.section.9.choices.item_gpc")}</li>
      </ul>

      <h3>{t(messages, "legal.privacy.section.9.not_used.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.9.not_used.body")}
      </p>
      <ul>
        <li>{t(messages, "legal.privacy.section.9.not_used.item_birth")}</li>
        <li>{t(messages, "legal.privacy.section.9.not_used.item_natal")}</li>
        <li>{t(messages, "legal.privacy.section.9.not_used.item_tarot")}</li>
        <li>{t(messages, "legal.privacy.section.9.not_used.item_journal")}</li>
        <li>{t(messages, "legal.privacy.section.9.not_used.item_sms")}</li>
      </ul>

      <h2 id="section-10">{t(messages, "legal.privacy.section.10.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.10.body_1")}
      </p>
      <p>
        {t(messages, "legal.privacy.section.10.body_2")}
      </p>

      <h2 id="section-11">{t(messages, "legal.privacy.section.11.heading")}</h2>
      <p>{t(messages, "legal.privacy.section.11.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.11.item_provide")}</li>
        <li>{t(messages, "legal.privacy.section.11.item_comply")}</li>
        <li>{t(messages, "legal.privacy.section.11.item_disputes")}</li>
        <li>{t(messages, "legal.privacy.section.11.item_enforce")}</li>
      </ul>
      <p>
        {t(messages, "legal.privacy.section.11.varies")}
      </p>
      <p><strong>{t(messages, "legal.privacy.section.11.specific_label")}</strong></p>
      <ul>
        <li>{t(messages, "legal.privacy.section.11.item_account")}</li>
        <li>{t(messages, "legal.privacy.section.11.item_sms_consent")}</li>
        <li>{t(messages, "legal.privacy.section.11.item_email_engagement")}</li>
        <li>{t(messages, "legal.privacy.section.11.item_readings")}</li>
        <li>{t(messages, "legal.privacy.section.11.item_logs")}</li>
      </ul>

      <h2 id="section-12">{t(messages, "legal.privacy.section.12.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.12.body")}
      </p>
      <ul>
        <li>{t(messages, "legal.privacy.section.12.item_https")}</li>
        <li>{t(messages, "legal.privacy.section.12.item_encryption")}</li>
        <li>{t(messages, "legal.privacy.section.12.item_hashing")}</li>
        <li>{t(messages, "legal.privacy.section.12.item_rbac")}</li>
        <li>{t(messages, "legal.privacy.section.12.item_review")}</li>
      </ul>
      <p>
        {t(messages, "legal.privacy.section.12.disclaimer")}
      </p>

      <h2 id="section-13">{t(messages, "legal.privacy.section.13.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.13.body_1")}
      </p>
      <p>
        {t(messages, "legal.privacy.section.13.body_2")}
      </p>

      <h2 id="section-14">{t(messages, "legal.privacy.section.14.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.14.intro")}
      </p>
      <ul>
        <li>{t(messages, "legal.privacy.section.14.item_access")}</li>
        <li>{t(messages, "legal.privacy.section.14.item_delete")}</li>
        <li>{t(messages, "legal.privacy.section.14.item_correct")}</li>
        <li>{t(messages, "legal.privacy.section.14.item_port")}</li>
        <li>{t(messages, "legal.privacy.section.14.item_optout")}</li>
        <li>{t(messages, "legal.privacy.section.14.item_information")}</li>
        <li>{t(messages, "legal.privacy.section.14.item_limit_sensitive")}</li>
      </ul>

      <h3>{t(messages, "legal.privacy.section.14.shine_the_light.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.14.shine_the_light.body")}
      </p>

      <h3 id="do-not-sell">{t(messages, "legal.privacy.section.14.do_not_sell.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.14.do_not_sell.body")}
      </p>

      <h3>{t(messages, "legal.privacy.section.14.how_to_submit.heading")}</h3>
      <p>
        {t(messages, "legal.privacy.section.14.how_to_submit.body")}
      </p>
      <ul>
        <li>{t(messages, "legal.privacy.section.14.item_non_discrimination")}</li>
        <li>{t(messages, "legal.privacy.section.14.item_appeals")}</li>
      </ul>

      <h2 id="section-15">{t(messages, "legal.privacy.section.15.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.15.body")}
      </p>
      <ul>
        <li>{t(messages, "legal.privacy.section.15.item_not_provider")}</li>
        <li>{t(messages, "legal.privacy.section.15.item_not_predictive")}</li>
        <li>{t(messages, "legal.privacy.section.15.item_not_substitute")}</li>
        <li>{t(messages, "legal.privacy.section.15.item_consult")}</li>
        <li>{t(messages, "legal.privacy.section.15.item_hipaa")}</li>
      </ul>
      <p>
        {t(messages, "legal.privacy.section.15.crisis")}
      </p>

      <h2 id="section-16">{t(messages, "legal.privacy.section.16.heading")}</h2>
      <p>
        {t(messages, "legal.privacy.section.16.body")}
      </p>

      <h2 id="section-17">{t(messages, "legal.privacy.section.17.heading")}</h2>
      <p>{t(messages, "legal.privacy.section.17.body")}</p>
      <ul>
        <li>{t(messages, "legal.privacy.section.17.item_email")}</li>
        <li>{t(messages, "legal.privacy.section.17.item_phone")}</li>
        <li>{t(messages, "legal.privacy.section.17.item_subject_privacy")}</li>
        <li>{t(messages, "legal.privacy.section.17.item_subject_unsubscribe")}</li>
      </ul>

      <hr />

      <p className="font-sans text-sm text-[#8f8daa]">
        <Link href="/terms">{t(messages, "legal.privacy.see_also")}</Link>
      </p>
    </MarketingPage>
  );
}
