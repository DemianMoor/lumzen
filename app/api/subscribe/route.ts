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
      consent_sms,
      source,
    } = body as {
      email?: string;
      phone?: string;
      name?: string;
      consent_email?: boolean;
      consent_sms?: boolean;
      source?: string;
    };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!consent_email && !consent_sms) {
      return NextResponse.json(
        {
          error:
            "Please consent to email or SMS so we know how to reach you.",
        },
        { status: 400 },
      );
    }

    if (consent_sms && (!phone || phone.trim().length === 0)) {
      return NextResponse.json(
        {
          error:
            "Please add your phone number to receive the SMS digest.",
        },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim() || null;
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
        sms_consent_at: consent_sms ? now : null,
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
              smsConsent: !!consent_sms,
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
