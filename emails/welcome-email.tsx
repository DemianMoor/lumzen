import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type WelcomeEmailProps = {
  name?: string;
  emailConsent?: boolean;
  smsConsent?: boolean;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lumzen.co";

export default function WelcomeEmail({
  name,
  emailConsent = true,
  smsConsent = false,
}: WelcomeEmailProps) {
  const greetingName = name?.trim() || "traveler";

  return (
    <Html>
      <Head />
      <Preview>Welcome to LumZen — where light meets stillness.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandMark}>✦ LUMZEN</Text>
          </Section>

          <Section style={hero}>
            <Heading as="h1" style={heroHeading}>
              Welcome, {greetingName} ✦
            </Heading>
            <Text style={heroSubhead}>Where light meets stillness.</Text>
          </Section>

          <Section style={body2}>
            <Text style={paragraph}>
              You have joined a free, ad-supported community for spiritual
              practice. No payment, ever. Just practice.
            </Text>

            <Text style={paragraph}>
              Each Sunday morning, one quiet email finds you — a short,
              useful read on tarot, the cosmos, sound, or the practice of
              presence. Nothing more.
            </Text>

            {smsConsent && (
              <Text style={paragraph}>
                You also opted in to receive occasional SMS dispatches. Reply
                STOP at any time to opt out.
              </Text>
            )}

            <Section style={ctaWrap}>
              <Link href={`${SITE_URL}/auth/signup`} style={cta}>
                Begin Your Journey ✦
              </Link>
            </Section>

            <Hr style={hr} />

            <Text style={footerSmall}>
              You are receiving this because you subscribed at {SITE_URL}.
              {emailConsent
                ? " Unsubscribe any time from the footer of any email."
                : ""}
            </Text>
            <Text style={footerSmall}>
              LumZen · hello@lumzen.co · {SITE_URL}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#06060f",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: 0,
  color: "#f0eff8",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 24px",
};

const header: React.CSSProperties = {
  textAlign: "center" as const,
  paddingBottom: "24px",
};

const brandMark: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: "12px",
  letterSpacing: "0.2em",
  color: "#c4a35a",
  textTransform: "uppercase" as const,
  margin: 0,
};

const hero: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "16px 0 32px",
  borderTop: "1px solid rgba(196, 163, 90, 0.20)",
  borderBottom: "1px solid rgba(196, 163, 90, 0.20)",
};

const heroHeading: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "32px",
  fontStyle: "italic" as const,
  fontWeight: 400,
  color: "#f0eff8",
  margin: "16px 0 8px",
  lineHeight: 1.2,
};

const heroSubhead: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "16px",
  fontStyle: "italic" as const,
  color: "#8f8daa",
  margin: 0,
};

const body2: React.CSSProperties = {
  padding: "32px 0",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.6,
  color: "#f0eff8",
  margin: "0 0 16px",
};

const ctaWrap: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const cta: React.CSSProperties = {
  display: "inline-block",
  background: "#c4a35a",
  color: "#06060f",
  padding: "12px 28px",
  borderRadius: "9999px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
};

const hr: React.CSSProperties = {
  borderColor: "rgba(196, 163, 90, 0.15)",
  margin: "32px 0 16px",
};

const footerSmall: React.CSSProperties = {
  fontSize: "12px",
  color: "#8f8daa",
  lineHeight: 1.5,
  margin: "0 0 8px",
};
