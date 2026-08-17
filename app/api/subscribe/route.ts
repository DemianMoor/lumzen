import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createSupabaseAdmin } from "@/lib/supabase";
import WelcomeEmail from "@/emails/welcome-email";
import { getLocaleFromRequest, getMessages, t } from "@/lib/i18n/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      phone,
      name,
      consent_email,
      consent_sms_account,
      consent_sms,
      source,
    } = body as {
      email?: string;
      phone?: string;
      name?: string;
      consent_email?: boolean;
      consent_sms_account?: boolean;
      consent_sms?: boolean;
      source?: string;
    };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!consent_email && !consent_sms_account && !consent_sms) {
      return NextResponse.json(
        {
          error:
            "Please consent to email or SMS so we know how to reach you.",
        },
        { status: 400 },
      );
    }

    if (
      (consent_sms_account || consent_sms) &&
      (!phone || phone.trim().length === 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Please add your phone number to receive the SMS digest.",
        },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    // Persist the phone number only when the subscriber gave at least one SMS
    // consent (account/service or marketing). A number submitted with neither
    // box checked must never be stored, so it can never be swept into the
    // promotional SimpleTexting sync — that sync must gate on
    // sms_consent_at IS NOT NULL, never on phone-presence. Account-only
    // consent deliberately leaves sms_consent_at null: those subscribers
    // agreed to service notifications, not promotions.
    const smsConsented = !!(consent_sms_account || consent_sms);
    const cleanPhone = smsConsented ? phone?.trim() || null : null;
    const cleanName = name?.trim() || null;
    const locale = getLocaleFromRequest(request);

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;
    const now = new Date().toISOString();

    const supabase = createSupabaseAdmin();

    const { error: dbError } = await supabase.from("subscribers").upsert(
      {
        email: cleanEmail,
        phone: cleanPhone,
        email_consent_at: consent_email ? now : null,
        sms_account_consent: !!consent_sms_account,
        sms_account_consent_at: consent_sms_account ? now : null,
        // Marketing SMS consent is collected again, so this column tracks the
        // subscriber's current answer: clearing it on an unchecked re-submit
        // is what drops them from the promotional sync.
        sms_consent_at: consent_sms ? now : null,
        // terms_consent / terms_consent_at stay absent: that checkbox was
        // retired, and omitting the columns leaves any historical value intact
        // when an existing subscriber re-submits (ON CONFLICT only touches
        // supplied columns).
        ip_address: ip,
        user_agent: userAgent,
        source: source || "unknown",
        unsubscribed_at: null,
        locale,
      },
      { onConflict: "email" },
    );

    if (dbError) {
      console.error("Supabase subscriber upsert error:", dbError);
      return NextResponse.json(
        {
          error:
            "Something went wrong saving your subscription. Please try again.",
        },
        { status: 500 },
      );
    }

    if (consent_email) {
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromAddress =
        process.env.RESEND_FROM_ADDRESS ||
        "LumZen <onboarding@resend.dev>";
      // Replies go to the brand's real inbox — the bare address inside the
      // from ("hello@lumzen.co"), so a subscriber hitting Reply reaches a human.
      const replyTo = fromAddress.match(/<([^>]+)>/)?.[1] ?? fromAddress;

      if (!resendApiKey) {
        console.error("RESEND_API_KEY is not set. Welcome email not sent.");
      } else {
        try {
          const resend = new Resend(resendApiKey);
          const html = await render(
            WelcomeEmail({
              name: cleanName ?? undefined,
              emailConsent: !!consent_email,
              smsConsent: !!(consent_sms_account || consent_sms),
              locale,
            }),
          );

          const messages = getMessages(locale);
          const subject = t(messages, "email.welcome.subject");

          const { error: emailError } = await resend.emails.send({
            from: fromAddress,
            replyTo,
            to: cleanEmail,
            subject,
            html,
          });

          if (emailError) {
            console.error("Resend send error:", emailError);
          }
        } catch (err) {
          console.error("Resend exception:", err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
