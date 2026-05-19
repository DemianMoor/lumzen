import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Terms — LumZen",
  description: "The terms of using LumZen and the SMS messaging policy.",
};

export default function TermsPage() {
  return (
    <MarketingPage
      eyebrow="✦ TERMS"
      title="The agreement, in plain language."
      intro="Using LumZen means agreeing to these terms. They are written to be readable, not legalistic."
    >
      <p>
        <em>Last updated: May 18, 2026.</em>
      </p>

      <h2>Free, ad-supported access</h2>
      <p>
        LumZen is free to join and use. The platform is funded by carefully
        chosen on-brand sponsorships. There is no payment required, ever, to
        access any feature.
      </p>

      <h2>Practice, not advice</h2>
      <p>
        Tarot interpretations, natal-chart readings, affirmation guidance,
        and editorial guides on LumZen are spiritual practices and editorial
        content. They are not medical, psychological, legal, or financial
        advice. If you are facing a serious decision or a health concern,
        please consult a qualified professional.
      </p>

      <h2>Your account</h2>
      <p>
        You are responsible for keeping your password private. Tell us at{" "}
        <a href="mailto:hello@lumzen.co">hello@lumzen.co</a> if you suspect
        unauthorized access. We may suspend or terminate accounts that
        violate these terms or use the platform abusively.
      </p>

      <h2>SMS messaging</h2>
      <p>
        SMS is available in the United States only. By providing your phone
        number, checking the SMS consent box, and submitting the form, you
        agree to receive periodic text messages from LumZen at the number
        you submitted. These may include automated messages sent using an
        automatic telephone dialing system.
      </p>
      <p>
        Message and data rates may apply. Message frequency varies,
        typically one message per week. Messages will consist of weekly
        content digests, occasional content alerts, and account
        notifications. Consent to receive SMS is not a condition of
        subscribing to LumZen or accessing any content. Text HELP for help.
        Reply STOP at any time to unsubscribe — you will get one
        confirmation message and then no further texts.
      </p>

      <h2>Email</h2>
      <p>
        If you opted in to email, you will receive one short editorial
        dispatch per week. Unsubscribe any time from the footer of any
        message.
      </p>

      <h2>Content ownership</h2>
      <p>
        Editorial content on LumZen — guides, audiobooks framing, tarot
        copy, affirmations — is owned by LumZen. Your own practice data —
        readings, charts, journal notes — belongs to you.
      </p>

      <h2>Changes</h2>
      <p>
        We may revise these terms. Material changes will be announced via
        the weekly email and dated above. Continued use of LumZen after a
        change means you accept it.
      </p>

      <h2>Contact</h2>
      <p>
        Questions go to{" "}
        <a href="mailto:hello@lumzen.co">hello@lumzen.co</a>.
      </p>
    </MarketingPage>
  );
}
