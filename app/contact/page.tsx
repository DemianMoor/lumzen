import type { Metadata } from "next";
import {
  StarField,
  NebulaBackground,
} from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact — LumZen",
  description:
    "Reach the LumZen editorial team. Feedback, questions, partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StarField />
      <NebulaBackground />

      <SiteHeader />

      <main className="relative z-10 flex-1 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10 text-center">
            <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
              ✦ CONTACT
            </p>
            <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] leading-tight">
              Write to us.
            </h1>
            <p className="font-sans text-base text-[#8f8daa] mt-6 leading-relaxed">
              Feedback, broken links, partnership inquiries. Read by a small
              editorial team. We answer within a few days.
            </p>
            <p className="font-sans text-sm text-[#8f8daa] mt-2">
              Or email{" "}
              <a
                href="mailto:hello@lumzen.co"
                className="text-[#c4a35a] hover:underline"
              >
                hello@lumzen.co
              </a>{" "}
              directly.
            </p>
          </header>

          <div
            className="rounded-2xl p-8 border"
            style={{
              background: "rgba(26,26,53,0.85)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(196,163,90,0.20)",
            }}
          >
            <ContactForm />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
