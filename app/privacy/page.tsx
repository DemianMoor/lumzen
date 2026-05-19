import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Privacy — LumZen",
  description: "How LumZen handles your data, what we store, and what we never share.",
};

export default function PrivacyPage() {
  return (
    <MarketingPage
      eyebrow="✦ PRIVACY"
      title="What we hold in trust."
      intro="A plain-language summary of what data LumZen stores, why, and how it is protected."
    >
      <p>
        <em>Last updated: May 18, 2026.</em>
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your email address, display name, and
          password hash. Used only to authenticate you.
        </li>
        <li>
          <strong>Practice data:</strong> tarot readings, natal-chart inputs
          (birth date, time, place), affirmation sessions, audio history, and
          practice streaks. Used only to render your dashboard and history.
        </li>
        <li>
          <strong>Subscriber data:</strong> if you opt in to the weekly email,
          we store your email and the date you consented. If you opt in to
          SMS, we store your phone number and the date you consented.
        </li>
        <li>
          <strong>Analytics:</strong> aggregated, anonymized page-view counts
          via Vercel Analytics. No third-party tracking pixels.
        </li>
      </ul>

      <h2>What we never do</h2>
      <ul>
        <li>We never sell your data.</li>
        <li>
          We never share your natal chart, tarot history, or affirmation
          practice with third parties.
        </li>
        <li>
          We never use your data to train external AI models. AI features run
          on Anthropic Claude with no training on your inputs.
        </li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        Practice data is kept while your account is active. When you delete
        your account, all rows tied to your user ID are deleted within 30
        days. Subscriber emails are kept until you unsubscribe.
      </p>

      <h2>Your rights</h2>
      <p>
        Under GDPR and similar regimes, you can request an export or deletion
        of your data at any time by writing to{" "}
        <a href="mailto:hello@lumzen.co">hello@lumzen.co</a>. Subscribers can
        unsubscribe from the footer of any email.
      </p>

      <h2>Cookies</h2>
      <p>
        LumZen uses one essential cookie for authentication and a session
        flag to remember that the subscribe popup has been shown. No
        third-party advertising cookies are set on the public site.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy go to{" "}
        <a href="mailto:hello@lumzen.co">hello@lumzen.co</a>.
      </p>
    </MarketingPage>
  );
}
