import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/marketing-page";
import {
  LEGAL_EFFECTIVE_DATE,
  LEGAL_LAST_UPDATED,
  LEGAL_OPERATOR,
  LEGAL_CONTACTS,
} from "@/lib/legal/constants";

export const metadata: Metadata = {
  title: "Privacy Policy · LumZen",
  description:
    "How LumZen collects, uses, and protects your personal information. Covers TCPA SMS, CAN-SPAM email, and US state privacy rights.",
};

export default function PrivacyPage() {
  return (
    <MarketingPage
      eyebrow="✦ LEGAL"
      title="Privacy Policy"
      intro="How LumZen collects, uses, and protects your information."
      quiet
    >
      <p className="font-mono text-sm text-[#8f8daa]">
        <strong>Effective Date:</strong> {LEGAL_EFFECTIVE_DATE}
        <br />
        <strong>Last Updated:</strong> {LEGAL_LAST_UPDATED}
      </p>

      <hr />

      <p>
        This Privacy Policy explains how <strong>{LEGAL_OPERATOR.legalEntity}</strong>, a Canadian
        company operating as <strong>{LEGAL_OPERATOR.brand}</strong> (&ldquo;LumZen,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), collects, uses, and
        discloses personal information when you visit lumzen.co (the &ldquo;Site&rdquo;), create a
        LumZen account, or subscribe to receive email or text (SMS) communications from us
        (collectively, the &ldquo;Services&rdquo;).
      </p>
      <p>
        LumZen offers spiritual practice tools — including tarot readings, natal chart
        generation, guided affirmations, meditation audio, and educational content — provided
        free of charge and supported by advertising.
      </p>
      <p>
        The Services are intended for residents of the <strong>United States only</strong>. By
        using the Services, you confirm that you are located in the United States and are at
        least 18 years of age.
      </p>
      <p>
        If you do not agree with this Privacy Policy, please do not use the Services or provide
        personal information to us.
      </p>

      <h2 id="section-1">1) Who We Are / Contact</h2>
      <ul>
        <li><strong>Brand:</strong> {LEGAL_OPERATOR.brand}</li>
        <li><strong>Website:</strong> lumzen.co</li>
        <li><strong>Legal Entity:</strong> {LEGAL_OPERATOR.legalEntity} (a Canadian company)</li>
        <li><strong>Operating Location:</strong> {LEGAL_OPERATOR.operatingCountry}</li>
        <li><strong>Service Region:</strong> {LEGAL_OPERATOR.serviceRegion}</li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>
        </li>
        <li>
          <strong>General contact:</strong>{" "}
          <a href={`mailto:${LEGAL_CONTACTS.general}`}>{LEGAL_CONTACTS.general}</a>
        </li>
      </ul>
      <p>
        Because LumZen is operated from Canada, personal information you provide will be
        transferred to, processed, and stored in Canada and may also be processed in the United
        States by our service providers. Canada is a jurisdiction with comprehensive privacy
        laws (PIPEDA), and we apply equivalent safeguards regardless of where data is processed.
      </p>

      <h2 id="section-2">2) What This Policy Covers (and What It Doesn&rsquo;t)</h2>
      <p>This Privacy Policy applies to information we collect through the Services.</p>
      <p>It does <strong>not</strong> apply to:</p>
      <ul>
        <li>Third-party websites, apps, or services we link to</li>
        <li>
          Third-party advertising networks and the data they collect through ad placements on
          our Site (see Section 9)
        </li>
        <li>
          Third-party authentication providers if you sign in via a third party (currently we
          offer email + password only)
        </li>
      </ul>
      <p>We encourage you to review the privacy policies of any third parties you interact with.</p>

      <h2 id="section-3">3) Personal Information We May Collect</h2>
      <p>
        &ldquo;Personal information&rdquo; means information that identifies you or reasonably
        relates to an identifiable individual.
      </p>

      <h3>A. Information you provide</h3>
      <p>We may collect:</p>
      <ul>
        <li>
          <strong>Identifiers and contact information</strong> — name, email address, mobile
          number, ZIP code
        </li>
        <li>
          <strong>Account information</strong> — display name, profile preferences, password
          (stored as a hash, never in plain text)
        </li>
        <li>
          <strong>Spiritual practice data</strong> — birth date, birth time, and birth city
          (for natal chart generation), tarot reading history, affirmation activity, listening
          history, journal entries you choose to save
        </li>
        <li>
          <strong>Message content you submit</strong> — inquiries, customer support requests,
          SMS replies
        </li>
        <li>
          <strong>Preferences</strong> — practice focus areas, intention selections,
          time-of-day preferences
        </li>
      </ul>
      <p>You choose what to share. Most LumZen features work with just an email and password.</p>
      <blockquote>
        <strong>Important about birth data.</strong> Your birth date, time, and city are used
        only to generate your natal chart and may be sent to our AI service provider (see
        Section 6) to produce a personalized interpretation. Birth data is stored encrypted at
        rest in our database and is never sold or shared for marketing purposes.
      </blockquote>

      <h3>B. Information collected automatically</h3>
      <p>When you use the Site, we may collect:</p>
      <ul>
        <li>
          <strong>Device and browser information</strong> — IP address, device type, browser
          type, operating system, screen size
        </li>
        <li>
          <strong>Usage data</strong> — pages viewed, features used, links clicked, time spent,
          referring URLs, audio tracks played
        </li>
        <li>
          <strong>Approximate location</strong> derived from IP address (city or state level
          only — we do not collect precise GPS location)
        </li>
      </ul>

      <h3>C. Cookies and similar technologies</h3>
      <p>We may use cookies, pixels, tags, SDKs, and similar technologies for:</p>
      <ul>
        <li>Site functionality and security (essential cookies)</li>
        <li>Authentication and session management</li>
        <li>Analytics — understanding how the Site is used</li>
        <li>Remembering your preferences</li>
        <li>Measuring email and SMS engagement (e.g., open and click rates)</li>
        <li>Serving and measuring advertisements (see Section 9)</li>
      </ul>
      <p>
        You can control cookies via your browser settings. If you disable essential cookies, the
        Services may not function. For information about your choices regarding interest-based
        advertising, you may visit the Digital Advertising Alliance at{" "}
        <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">
          optout.aboutads.info
        </a>{" "}
        or the Network Advertising Initiative at{" "}
        <a
          href="https://optout.networkadvertising.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          optout.networkadvertising.org
        </a>
        .
      </p>

      <h2 id="section-4">4) How We Collect Personal Information</h2>
      <p>We may collect personal information:</p>
      <ul>
        <li>
          When you create an account, fill out a form, subscribe, or otherwise interact with the
          Site
        </li>
        <li>When you opt in to receive SMS or email communications</li>
        <li>When you generate a natal chart or save a tarot reading</li>
        <li>When you contact us for support</li>
        <li>Automatically via cookies, server logs, and similar technologies</li>
        <li>
          From advertising and analytics partners who share aggregated audience information with
          us
        </li>
      </ul>
      <p>
        If you provide information about another person (for example, a family member&rsquo;s
        birth chart you generate), you represent that you have the authority to do so.
      </p>

      <h2 id="section-5">5) How We Use Personal Information</h2>
      <p>We may use personal information to:</p>
      <ul>
        <li>Provide, operate, maintain, and improve the Services</li>
        <li>
          Generate your natal chart, daily tarot card, personalized affirmations, and other
          practice features
        </li>
        <li>
          Send you requested communications, including newsletters, content updates, feature
          announcements, and promotional messages
        </li>
        <li>
          Administer and support our SMS and email programs (see Sections 7 and 8)
        </li>
        <li>
          Personalize content and recommendations based on your preferences and engagement
        </li>
        <li>Display and measure advertisements that support our free service (see Section 9)</li>
        <li>Respond to questions, requests, or customer support issues</li>
        <li>
          Monitor, prevent, and investigate fraud, abuse, security incidents, and policy
          violations
        </li>
        <li>Comply with legal obligations and enforce our terms and policies</li>
      </ul>

      <h2 id="section-6">6) How We Disclose Personal Information</h2>
      <h3>A. We do not sell your personal information</h3>
      <p>
        LumZen does not sell your personal information for money. We also do not
        &ldquo;share&rdquo; your personal information for cross-context behavioral advertising
        as those terms are defined under California law, <strong>except</strong> as you may
        consent through advertising cookie choices managed via your browser or via the Digital
        Advertising Alliance opt-out tools.
      </p>

      <h3>B. Service providers (processors)</h3>
      <p>
        We disclose personal information to vendors that perform services for us. These parties
        may use personal information only to provide services to us, under contractual
        protections. Categories include:
      </p>
      <ul>
        <li>
          <strong>Website hosting and infrastructure</strong> — {LEGAL_OPERATOR.websiteHost}
        </li>
        <li>
          <strong>Database and authentication</strong> — {LEGAL_OPERATOR.database}
        </li>
        <li>
          <strong>AI interpretation services</strong> — {LEGAL_OPERATOR.aiProvider}, used to
          generate natal chart readings, tarot interpretations, and personalized affirmations.
          When you request these features, the relevant input (birth data, tarot card draw,
          your question) is sent to Anthropic for processing. Anthropic does not store
          conversational content for training under their standard API terms.
        </li>
        <li>
          <strong>Email service</strong> — {LEGAL_OPERATOR.emailProvider}, for transactional and
          marketing emails
        </li>
        <li>
          <strong>SMS delivery</strong> — {LEGAL_OPERATOR.smsProvider}
        </li>
        <li>
          <strong>Analytics</strong> — Google Analytics, Microsoft Clarity, and similar
          measurement services
        </li>
        <li>
          <strong>Advertising</strong> — ad networks and ad measurement partners (see Section 9)
        </li>
        <li>
          <strong>Audio content delivery</strong> — Freesound (Creative Commons audio
          streaming), LibriVox (public domain audiobook streaming)
        </li>
        <li>
          <strong>Astrology calculations</strong> — open-source ephemeris libraries running on
          our servers; no third-party API receives your birth data for chart calculations
          themselves
        </li>
      </ul>

      <h3>C. Legal, safety, and business transfers</h3>
      <p>We may disclose information:</p>
      <ul>
        <li>
          To comply with law, regulation, subpoena, or lawful government request from US
          authorities or, in limited circumstances, Canadian authorities
        </li>
        <li>To protect the rights, safety, and security of users, our business, or others</li>
        <li>
          In connection with a merger, acquisition, financing, reorganization, or sale of
          assets (subject to appropriate safeguards)
        </li>
      </ul>

      <h3>D. De-identified or aggregated information</h3>
      <p>
        We may share aggregated or de-identified information that cannot reasonably identify
        you.
      </p>

      <h2 id="section-7">7) SMS / Text Messaging Privacy</h2>
      <p>
        If you choose to join our SMS program, we will use your mobile number and related data
        to send you text messages and to operate the program. By opting in, you provide your{" "}
        <strong>prior express written consent under the Telephone Consumer Protection Act
        (TCPA)</strong>{" "}
        to receive marketing text messages from LumZen sent using an automatic telephone
        dialing system or otherwise. Consent is not a condition of using any free LumZen
        service.
      </p>
      <ul>
        <li>
          <strong>Program purpose:</strong> daily practice reminders, content drops, feature
          announcements, and curated spiritual practice tips
        </li>
        <li>
          <strong>Message frequency:</strong> Message frequency varies (up to a few messages per
          week)
        </li>
        <li><strong>Msg &amp; data rates may apply</strong></li>
        <li><strong>Opt-out:</strong> Reply STOP at any time to cancel</li>
        <li>
          <strong>Help:</strong> Reply HELP for help, or contact{" "}
          <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>
        </li>
        <li>
          <strong>Carrier disclaimer:</strong> Carriers are not liable for delayed or
          undelivered messages
        </li>
      </ul>

      <h3>A. No marketing sharing of mobile data or opt-in data</h3>
      <p>To meet wireless-carrier expectations for messaging programs, we state clearly:</p>
      <ul>
        <li>
          <strong>
            No mobile information will be sold or shared with third parties or affiliates for
            marketing or promotional purposes.
          </strong>
        </li>
        <li>
          <strong>
            Text messaging originator opt-in data and consent will not be shared with any
            third parties.
          </strong>
        </li>
      </ul>

      <h3>B. Who we do share SMS data with (limited)</h3>
      <p>
        We share the minimum necessary information with vendors that help deliver and manage
        messages (for example, messaging platform providers, delivery vendors, and telecom
        carriers). These parties may use the data only to provide services to us (delivery,
        compliance, support, fraud prevention).
      </p>

      <h3>C. Retention for consent and compliance</h3>
      <p>We retain records of SMS opt-in and opt-out events and message history as needed to:</p>
      <ul>
        <li>demonstrate consent,</li>
        <li>honor STOP requests,</li>
        <li>comply with legal and carrier requirements (including the TCPA), and</li>
        <li>prevent abuse.</li>
      </ul>

      <h2 id="section-8">8) Email Marketing Communications</h2>
      <p>
        If you sign up for our emails, you consent to receive marketing and promotional
        messages from LumZen. We comply with the federal <strong>CAN-SPAM Act</strong>, which
        means:
      </p>
      <ul>
        <li>
          Our marketing emails identify LumZen as the sender and include a valid postal address
        </li>
        <li>Subject lines accurately reflect the content of the email</li>
        <li>Each marketing email contains a clear unsubscribe link</li>
      </ul>
      <p>
        You can opt out at any time by clicking the unsubscribe link in any of our marketing
        emails or by emailing{" "}
        <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a> with the
        subject line &ldquo;Unsubscribe.&rdquo; We will honor opt-out requests promptly, and in
        any event within 10 business days, as required by law.
      </p>
      <p>
        Some communications may be transactional or service-related (for example, password
        resets, account confirmations, security notices, or responses to your support request),
        and you may not be able to opt out of those while you are using the Services.
      </p>

      <h2 id="section-9">9) Advertising</h2>
      <p>
        LumZen is <strong>free to use and supported by advertising</strong>. We may display
        advertisements within the Services, including banner ads, in-content ad placements, and
        sponsored content.
      </p>

      <h3>How advertising works</h3>
      <ul>
        <li>
          We may use third-party advertising networks and ad-tech vendors to display ads
          relevant to your interests.
        </li>
        <li>
          These partners may collect information about your activity on the Services and other
          sites over time using cookies, pixels, and similar technologies.
        </li>
        <li>
          We do not directly provide your name, email, mobile number, or birth data to
          advertisers.
        </li>
        <li>
          Some advertising on the Services may be contextual (based on the content of the page)
          rather than behavioral (based on your activity).
        </li>
      </ul>

      <h3>Your choices</h3>
      <ul>
        <li>
          You can opt out of interest-based advertising via the{" "}
          <strong>Digital Advertising Alliance</strong> (
          <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">
            optout.aboutads.info
          </a>
          ) or the <strong>Network Advertising Initiative</strong> (
          <a
            href="https://optout.networkadvertising.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            optout.networkadvertising.org
          </a>
          ).
        </li>
        <li>
          For mobile devices, you can use your device&rsquo;s &ldquo;Limit Ad Tracking&rdquo; or
          equivalent setting.
        </li>
        <li>
          Where required by law, we honor opt-out preference signals such as the{" "}
          <strong>Global Privacy Control (GPC)</strong>.
        </li>
      </ul>

      <h3>Not used for advertising</h3>
      <p>
        The following data is <strong>never</strong> used for advertising purposes, including
        not shared with ad networks or measured against ad performance:
      </p>
      <ul>
        <li>Your birth date, time, or city</li>
        <li>Your natal chart data or interpretations</li>
        <li>Tarot reading content or interpretations</li>
        <li>Affirmation journal entries</li>
        <li>SMS opt-in data and consent records</li>
      </ul>

      <h2 id="section-10">10) Digital Tracking and Analytics</h2>
      <p>
        We may use analytics tools (such as Google Analytics, Microsoft Clarity, tag managers,
        and similar measurement services) to understand Site usage and improve performance.
        These tools may collect device and usage information, including IP address, browser
        type, and page interactions.
      </p>
      <p>
        Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT) signal. Because there is no
        industry-standard interpretation of DNT signals, our Site does not currently respond to
        DNT signals. Where required by law, we honor opt-out preference signals such as the
        Global Privacy Control (GPC).
      </p>

      <h2 id="section-11">11) Data Retention</h2>
      <p>We retain personal information for as long as necessary to:</p>
      <ul>
        <li>Provide the Services to you while your account is active</li>
        <li>
          Comply with our legal obligations (including TCPA, CAN-SPAM, and applicable state
          privacy laws)
        </li>
        <li>Resolve disputes</li>
        <li>Enforce our agreements</li>
      </ul>
      <p>
        Retention periods vary based on the type of information and the purpose for which it
        was collected. When you delete your account, we will delete or de-identify your personal
        information within a reasonable timeframe, except where retention is required by law.
      </p>
      <p><strong>Specific retention periods:</strong></p>
      <ul>
        <li>
          <strong>Account data:</strong> retained while your account is active and for up to 30
          days after deletion, then permanently deleted
        </li>
        <li>
          <strong>SMS consent records:</strong> retained for at least 4 years after opt-out, per
          TCPA recordkeeping best practices
        </li>
        <li>
          <strong>Email engagement data:</strong> retained for up to 2 years
        </li>
        <li>
          <strong>Tarot readings and natal charts you save:</strong> retained while your account
          is active; deleted on account deletion
        </li>
        <li>
          <strong>Server and security logs:</strong> retained for up to 90 days
        </li>
      </ul>

      <h2 id="section-12">12) Security</h2>
      <p>
        We use reasonable administrative, technical, and physical safeguards designed to
        protect personal information, including:
      </p>
      <ul>
        <li>HTTPS encryption for all data in transit</li>
        <li>Encryption at rest for sensitive fields (birth data, journal entries)</li>
        <li>Industry-standard password hashing (bcrypt or equivalent)</li>
        <li>Role-based access controls for our team</li>
        <li>Regular security review of third-party service providers</li>
      </ul>
      <p>
        However, no security system is perfect, and we cannot guarantee absolute security. You
        are responsible for keeping your account credentials confidential. If you believe your
        account has been compromised, contact us immediately at{" "}
        <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>.
      </p>

      <h2 id="section-13">13) Persons Under 18</h2>
      <p>
        Our Services are intended for individuals <strong>18 years of age or older</strong> and
        located in the United States. We do not knowingly collect personal information from
        individuals under 18, and the Services are not directed to children under 13 within the
        meaning of the <strong>Children&rsquo;s Online Privacy Protection Act (COPPA)</strong>.
      </p>
      <p>
        If you believe a minor has provided us information, contact us at{" "}
        <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a> and we will
        take reasonable steps to delete it.
      </p>

      <h2 id="section-14">14) U.S. State Privacy Rights</h2>
      <p>
        Depending on your state of residence (including, where applicable,{" "}
        <strong>California, Colorado, Connecticut, Virginia, Utah, Oregon, Texas</strong>, and
        other states with comprehensive privacy laws), you may have the right to:
      </p>
      <ul>
        <li><strong>Access</strong> — request access to the personal information we hold about you</li>
        <li><strong>Delete</strong> — request deletion of your personal information</li>
        <li><strong>Correct</strong> — request correction of inaccurate personal information</li>
        <li>
          <strong>Port</strong> — request a copy of your personal information in a portable
          format
        </li>
        <li>
          <strong>Opt out</strong> — opt out of the sale or sharing of personal information and
          of certain targeted advertising or profiling, where applicable
        </li>
        <li>
          <strong>Information</strong> — receive information about our collection, use, and
          disclosure practices
        </li>
        <li>
          <strong>Limit use of sensitive personal information</strong> — where applicable under
          California law
        </li>
      </ul>

      <h3>California — &ldquo;Shine the Light&rdquo;</h3>
      <p>
        California Civil Code Section 1798.83 permits California residents to request
        information regarding the disclosure of personal information to third parties for those
        parties&rsquo; direct marketing purposes. LumZen does not disclose personal information
        to third parties for their direct marketing purposes.
      </p>

      <h3 id="do-not-sell">Do Not Sell or Share My Personal Information</h3>
      <p>
        LumZen does not sell personal information and does not share mobile opt-in data for
        third-party marketing (see Section 7). For interest-based advertising opt-out, see
        Section 9. Where required by law, we honor opt-out preference signals such as the{" "}
        <strong>Global Privacy Control (GPC)</strong>.
      </p>

      <h3>How to Submit a Request</h3>
      <p>
        To submit a privacy request, email{" "}
        <strong>
          <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>
        </strong>{" "}
        with the subject line &ldquo;Privacy Request.&rdquo; We may need to verify your identity
        before completing your request. You may use an authorized agent to submit a request on
        your behalf where state law permits; we may require proof of authorization.
      </p>
      <ul>
        <li>
          <strong>Non-discrimination:</strong> We will not discriminate against you for
          exercising your privacy rights.
        </li>
        <li>
          <strong>Appeals:</strong> If we deny your request, you may appeal our decision by
          replying to our denial email. Where state law provides a right to contact a state
          regulator if your appeal is denied, that right will be described in our response.
        </li>
      </ul>

      <h2 id="section-15">15) Spiritual &amp; Wellness Content Disclaimer</h2>
      <p>
        LumZen provides tools and content related to spiritual practice, including tarot,
        astrology, affirmations, meditation, and educational guides. These offerings are{" "}
        <strong>for entertainment, reflection, and personal growth purposes only</strong>.
      </p>
      <ul>
        <li>
          LumZen is <strong>not</strong> a healthcare provider, mental health professional,
          financial advisor, or legal advisor.
        </li>
        <li>
          Tarot readings, natal chart interpretations, and AI-generated guidance are not
          predictive, diagnostic, or prescriptive.
        </li>
        <li>
          Content should not be used as a substitute for professional medical, mental health,
          financial, or legal advice.
        </li>
        <li>
          Always consult a qualified professional for matters affecting your health, finances,
          or legal situation.
        </li>
        <li>
          LumZen is not designed to receive or process protected health information under
          HIPAA. Information you submit to us is not protected by HIPAA.
        </li>
      </ul>
      <p>
        If you are experiencing a mental health crisis or are in immediate danger, please
        contact emergency services (911 in the US), the 988 Suicide and Crisis Lifeline, or
        another qualified professional.
      </p>

      <h2 id="section-16">16) Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will post the updated policy on
        this page and update the &ldquo;Effective Date&rdquo; above. For material changes, we
        will provide additional notice (such as by email or via a prominent notice on the Site).
        Your continued use of the Services after the updated policy is posted means you accept
        the updated policy.
      </p>

      <h2 id="section-17">17) Contact Us</h2>
      <p>Questions or requests regarding privacy can be sent to:</p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>
        </li>
        <li>
          <strong>Subject line for privacy requests:</strong> &ldquo;Privacy Request&rdquo;
        </li>
        <li>
          <strong>Subject line for unsubscribes:</strong> &ldquo;Unsubscribe&rdquo;
        </li>
      </ul>

      <hr />

      <p className="font-sans text-sm text-[#8f8daa]">
        See also: <Link href="/terms">Terms of Service</Link>.
      </p>
    </MarketingPage>
  );
}
