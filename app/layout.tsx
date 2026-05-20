import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Cinzel, Jost, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PopupProvider } from "@/lib/popup-context";
import { SubscribePopup } from "@/components/subscribe-popup";
import { LocaleProvider } from "@/lib/i18n/client";
import { getCurrentMessages, t } from "@/lib/i18n/server";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WWT573HR";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

const jost = Jost({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getCurrentMessages();
  return {
    title: t(messages, "meta.root.title"),
    description: t(messages, "meta.root.description"),
    keywords: [
      t(messages, "meta.root.keywords.spiritual_practice"),
      t(messages, "meta.root.keywords.meditation"),
      t(messages, "meta.root.keywords.tarot"),
      t(messages, "meta.root.keywords.natal_chart"),
      t(messages, "meta.root.keywords.affirmations"),
      t(messages, "meta.root.keywords.sound_healing"),
      t(messages, "meta.root.keywords.mindfulness"),
    ],
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#06060f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, messages } = await getCurrentMessages();
  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${cinzel.variable} ${jost.variable} ${jetbrainsMono.variable} bg-[#06060f]`}
    >
      <head>
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#06060f] text-[#f0eff8]">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LocaleProvider locale={locale} messages={messages}>
          <PopupProvider>
            {children}
            <SubscribePopup />
          </PopupProvider>
        </LocaleProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
