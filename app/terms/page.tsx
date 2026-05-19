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
  title: "Terms of Service · LumZen",
  description:
    "The agreement between you and LumZen. Covers eligibility, account use, AI interpretations, disclaimers, and dispute resolution.",
};

export default function TermsPage() {
  return (
    <MarketingPage
      eyebrow="✦ LEGAL"
      title="Terms of Service"
      intro="The agreement between you and LumZen."
      quiet
    >
      <p className="font-mono text-sm text-[#8f8daa]">
        <strong>Effective Date:</strong> {LEGAL_EFFECTIVE_DATE}
        <br />
        <strong>Last Updated:</strong> {LEGAL_LAST_UPDATED}
      </p>

      <hr />

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) form a legal agreement between you and{" "}
        <strong>{LEGAL_OPERATOR.legalEntity}</strong>, a Canadian company operating as{" "}
        <strong>{LEGAL_OPERATOR.brand}</strong> (&ldquo;LumZen,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;), regarding your use of lumzen.co and the
        related services we offer (collectively, the &ldquo;Services&rdquo;).
      </p>
      <p>
        By creating an account or otherwise using the Services, you agree to these Terms and to
        our <Link href="/privacy"><strong>Privacy Policy</strong></Link>.
      </p>
      <p>
        <strong>
          Please read these Terms carefully. They include important provisions about
          disclaimers, limitations of liability, and how disputes are resolved.
        </strong>
      </p>
      <p>If you do not agree, do not use the Services.</p>

      <h2 id="section-1">1) Eligibility</h2>
      <p>To use the Services, you must:</p>
      <ul>
        <li>Be at least <strong>18 years of age</strong></li>
        <li>Be <strong>located in the United States</strong></li>
        <li>Be capable of entering into a legally binding contract</li>
        <li>Not be barred from using the Services under applicable law</li>
      </ul>
      <p>
        You agree to provide accurate information when creating your account and to keep it up
        to date.
      </p>

      <h2 id="section-2">2) Free Service, Advertising-Supported</h2>
      <p>
        LumZen is <strong>provided free of charge</strong> and is supported by advertising. We
        do not currently offer paid plans. We reserve the right to introduce paid features in
        the future with clear notice.
      </p>
      <p>
        You agree that LumZen may display advertisements within the Services, including banner
        ads, in-content placements, and sponsored content. See our{" "}
        <Link href="/privacy">Privacy Policy</Link> for how advertising data is handled.
      </p>

      <h2 id="section-3">3) Your Account</h2>
      <p>
        To access most LumZen features, you must create an account using a valid email address
        and a password.
      </p>
      <p>You are responsible for:</p>
      <ul>
        <li>Maintaining the confidentiality of your password</li>
        <li>All activity that occurs under your account</li>
        <li>
          Notifying us immediately of any unauthorized access at{" "}
          <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>
        </li>
      </ul>
      <p>
        We may suspend or terminate your account if we believe you have violated these Terms or
        applicable law.
      </p>

      <h2 id="section-4">4) Permitted Use</h2>
      <p>
        You agree to use the Services only for lawful, personal, non-commercial purposes. You
        will not:
      </p>
      <ul>
        <li>Use the Services to violate any law or regulation</li>
        <li>Attempt to access another user&rsquo;s account or data</li>
        <li>
          Scrape, crawl, or otherwise extract data from the Services without our written
          permission
        </li>
        <li>
          Reverse engineer, decompile, or attempt to extract source code from the Services
        </li>
        <li>
          Interfere with or disrupt the Services (e.g., denial of service, abuse of rate
          limits)
        </li>
        <li>Use the Services to harass, threaten, or harm other users</li>
        <li>
          Submit content that is illegal, infringing, defamatory, obscene, or harmful
        </li>
        <li>
          Use the Services to provide professional advice to others (medical, legal, financial,
          or mental health) — the Services are for personal use only
        </li>
      </ul>

      <h2 id="section-5">5) Content and Intellectual Property</h2>

      <h3>Our content</h3>
      <p>
        All content, design, software, branding, and original written material on the Services
        (other than user-submitted content and third-party licensed content) are owned by{" "}
        {LEGAL_OPERATOR.legalEntity} or its licensors and are protected by copyright,
        trademark, and other intellectual property laws.
      </p>
      <p>
        We grant you a limited, non-exclusive, non-transferable, revocable license to access
        and use the Services for your personal, non-commercial use, in accordance with these
        Terms.
      </p>

      <h3>Third-party licensed content</h3>
      <p>The Services include content licensed from third parties, including:</p>
      <ul>
        <li>
          Tarot card imagery from the Rider-Waite-Smith deck (1909), in the public domain in
          the United States
        </li>
        <li>Audiobook recordings from LibriVox (public domain)</li>
        <li>Audio tracks from Freesound under Creative Commons licenses</li>
        <li>Other content as noted within the Services</li>
      </ul>
      <p>This content is governed by its own license terms.</p>

      <h3>User-submitted content</h3>
      <p>
        When you submit content to the Services (for example, journal entries, saved readings,
        support messages, or feedback), you retain ownership of your content. You grant LumZen
        a worldwide, non-exclusive, royalty-free license to store, process, display, and use
        your content solely to provide and improve the Services to you.
      </p>
      <p>You represent that any content you submit:</p>
      <ul>
        <li>Is yours to submit, or you have permission to submit it</li>
        <li>Does not violate the rights of any third party</li>
        <li>Complies with these Terms</li>
      </ul>

      <h2 id="section-6">6) AI-Generated Interpretations</h2>
      <p>
        LumZen uses third-party AI services (currently Anthropic&rsquo;s Claude) to generate
        personalized tarot interpretations, natal chart readings, affirmations, and other
        content.
      </p>
      <p>You acknowledge and agree that:</p>
      <ul>
        <li>
          AI-generated content is produced by a machine learning model and is not the work of a
          human reader, astrologer, or counselor
        </li>
        <li>
          AI-generated interpretations are{" "}
          <strong>for reflection and entertainment only</strong> and are not predictive,
          diagnostic, prescriptive, or professional advice
        </li>
        <li>
          AI output may occasionally contain errors, inaccuracies, or content you find
          unhelpful
        </li>
        <li>You should not rely on AI-generated interpretations for important life decisions</li>
      </ul>

      <h2 id="section-7">7) Spiritual &amp; Wellness Disclaimer</h2>
      <p>
        LumZen provides tools for spiritual practice, reflection, and personal growth.{" "}
        <strong>These are not professional services.</strong>
      </p>
      <ul>
        <li>
          LumZen is{" "}
          <strong>
            not a healthcare provider, mental health professional, financial advisor, or legal
            advisor
          </strong>
          .
        </li>
        <li>
          Tarot, astrology, numerology, and affirmation features are{" "}
          <strong>for entertainment and personal reflection purposes only</strong>.
        </li>
        <li>
          Content is not a substitute for professional medical, mental health, financial, or
          legal advice.
        </li>
        <li>
          Always consult a qualified professional for matters affecting your health, finances,
          or legal situation.
        </li>
        <li>
          LumZen is not designed to receive or process protected health information under
          HIPAA.
        </li>
      </ul>
      <p>
        <strong>Mental health emergencies:</strong> If you are experiencing a mental health
        crisis or are in immediate danger, contact emergency services (911 in the US), the 988
        Suicide and Crisis Lifeline, or another qualified professional.
      </p>

      <h2 id="section-8">8) Communications</h2>
      <p>
        By creating an account, you consent to receive{" "}
        <strong>transactional and service-related communications</strong> from us (for example,
        password resets, account confirmations, and security notices) by email. You cannot opt
        out of these communications while you have an active account.
      </p>
      <p>You may separately opt in to receive:</p>
      <ul>
        <li>
          <strong>Marketing emails</strong> — by checking the relevant box at signup or via
          your account settings. You can unsubscribe at any time via the link in any marketing
          email.
        </li>
        <li>
          <strong>SMS messages</strong> — by checking the SMS opt-in box and providing your
          mobile number.
        </li>
      </ul>
      <p>
        See our <Link href="/privacy">Privacy Policy</Link> for details on how we handle
        communications data.
      </p>

      <h2 id="section-9">9) Third-Party Services and Links</h2>
      <p>
        The Services may contain links to third-party websites, services, or resources. We do
        not control, endorse, or assume responsibility for any third-party services. Your use
        of third-party services is governed by their own terms and privacy policies.
      </p>

      <h2 id="section-10">10) Disclaimers</h2>
      <p>
        THE SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
        BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, LUMZEN AND ITS AFFILIATES, AND THEIR
        RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS, DISCLAIM ALL WARRANTIES OF ANY
        KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTY THAT THE SERVICES WILL BE
        UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
      </p>
      <p>WE MAKE NO REPRESENTATION OR WARRANTY THAT:</p>
      <ul>
        <li>THE SERVICES WILL MEET YOUR REQUIREMENTS</li>
        <li>AI-GENERATED CONTENT WILL BE ACCURATE OR USEFUL</li>
        <li>ASTROLOGICAL OR DIVINATORY FEATURES WILL PRODUCE ANY SPECIFIC OUTCOME</li>
        <li>THE SERVICES WILL ALWAYS BE AVAILABLE</li>
      </ul>

      <h2 id="section-11">11) Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, LUMZEN AND ITS AFFILIATES, AND THEIR RESPECTIVE
        OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS, WILL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO
        YOUR USE OF THE SERVICES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOST DATA, OR
        EMOTIONAL DISTRESS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>
      <p>
        OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THE SERVICES OR
        THESE TERMS WILL NOT EXCEED <strong>ONE HUNDRED US DOLLARS ($100.00)</strong> OR THE
        AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM AROSE, WHICHEVER IS GREATER. SINCE
        THE SERVICES ARE FREE, THE GREATER AMOUNT WILL TYPICALLY BE $100.00.
      </p>
      <p>
        SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN DAMAGES OR THE LIMITATION OF
        LIABILITY, SO SOME OF THESE LIMITATIONS MAY NOT APPLY TO YOU.
      </p>

      <h2 id="section-12">12) Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless LumZen and its affiliates, officers,
        directors, employees, and agents from any claims, damages, losses, liabilities, costs,
        and expenses (including reasonable attorneys&rsquo; fees) arising out of or related to:
      </p>
      <ul>
        <li>Your use of the Services</li>
        <li>Your violation of these Terms</li>
        <li>Your violation of any law or the rights of any third party</li>
        <li>Content you submit to the Services</li>
      </ul>

      <h2 id="section-13">13) Termination</h2>
      <p>
        You may stop using the Services and delete your account at any time via your account
        settings or by emailing{" "}
        <a href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a>.
      </p>
      <p>
        We may suspend or terminate your access to the Services at any time, with or without
        notice, for any reason, including if we believe you have violated these Terms.
      </p>
      <p>
        Sections that by their nature should survive termination (including intellectual
        property, disclaimers, limitations of liability, indemnification, and dispute
        resolution) will survive.
      </p>

      <h2 id="section-14">14) Governing Law and Dispute Resolution</h2>
      <p>
        These Terms are governed by the laws of the{" "}
        <strong>Province of {LEGAL_OPERATOR.province}, Canada</strong>, without regard to its
        conflict of laws principles, and by applicable Canadian federal law.
      </p>
      <p>
        For users located in the United States, we acknowledge that you may also have rights
        and protections under applicable US federal and state laws (including the TCPA and
        state consumer protection laws), and nothing in these Terms is intended to limit those
        rights.
      </p>
      <p>
        You and LumZen agree to attempt to resolve any dispute informally by contacting us at{" "}
        <a href={`mailto:${LEGAL_CONTACTS.general}`}>{LEGAL_CONTACTS.general}</a> before
        initiating any formal legal proceedings. If a dispute cannot be resolved informally
        within 60 days, it may be brought in the courts of the Province of{" "}
        {LEGAL_OPERATOR.province}, Canada, or in a court of competent jurisdiction in the
        United States, subject to applicable law.
      </p>
      <p>
        <strong>No class actions.</strong> To the fullest extent permitted by law, you and
        LumZen each waive the right to bring or participate in any class action, collective
        action, or representative proceeding against the other.
      </p>

      <h2 id="section-15">15) Changes to These Terms</h2>
      <p>
        We may modify these Terms at any time. We will post the updated Terms on this page and
        update the &ldquo;Effective Date&rdquo; above. For material changes, we will provide
        additional notice (such as by email or via a prominent notice on the Site). Your
        continued use of the Services after the updated Terms are posted means you accept the
        updated Terms.
      </p>

      <h2 id="section-16">16) Miscellaneous</h2>
      <ul>
        <li>
          <strong>Entire agreement:</strong> These Terms, together with the Privacy Policy,
          constitute the entire agreement between you and LumZen regarding the Services.
        </li>
        <li>
          <strong>Severability:</strong> If any provision of these Terms is held to be invalid
          or unenforceable, the remaining provisions will continue in full force and effect.
        </li>
        <li>
          <strong>No waiver:</strong> Our failure to enforce any provision of these Terms is
          not a waiver of our right to do so later.
        </li>
        <li>
          <strong>Assignment:</strong> You may not assign your rights or obligations under
          these Terms. We may assign our rights or obligations to an affiliate or in
          connection with a merger, acquisition, or sale of assets.
        </li>
        <li>
          <strong>Contact:</strong> For questions about these Terms, email{" "}
          <a href={`mailto:${LEGAL_CONTACTS.general}`}>{LEGAL_CONTACTS.general}</a>.
        </li>
      </ul>

      <hr />

      <p className="font-sans text-sm text-[#8f8daa]">
        See also: <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </MarketingPage>
  );
}
