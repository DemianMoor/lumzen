import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const CONTACT_INBOX = "hello@lumzen.co";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Please write a message." },
        { status: 400 },
      );
    }

    const cleanName = name?.trim() || "(no name given)";
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress =
      process.env.RESEND_FROM_ADDRESS ||
      "LumZen <onboarding@resend.dev>";

    if (!resendApiKey) {
      console.error(
        "RESEND_API_KEY missing — contact form payload:",
        { name: cleanName, email: cleanEmail, message: cleanMessage },
      );
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(resendApiKey);

    const subject = `Contact form — ${cleanName}`;
    const html = `
      <p><strong>From:</strong> ${cleanName} &lt;${cleanEmail}&gt;</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(cleanMessage)}</pre>
    `;

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: CONTACT_INBOX,
      replyTo: cleanEmail,
      subject,
      html,
    });

    if (error) {
      console.error("Contact form Resend error:", error);
      return NextResponse.json(
        { error: "We could not send your message right now. Please try email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
