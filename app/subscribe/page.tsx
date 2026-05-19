import type { Metadata } from "next";
import {
  StarField,
  NebulaBackground,
} from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";
import { NoSubscribePopup } from "@/lib/popup-context";
import { SubscribeForm } from "./subscribe-form";

export const metadata: Metadata = {
  title: "Subscribe — LumZen",
  description:
    "One quiet email a week, written for the community. Free, always. Unsubscribe in one tap.",
};

export default function SubscribePage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StarField />
      <NebulaBackground />

      <SiteHeader />
      <NoSubscribePopup />

      <main className="relative z-10 flex-1 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10 text-center">
            <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
              ✦ THE WEEKLY
            </p>
            <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] leading-tight">
              One quiet email a week.
            </h1>
            <p className="font-sans text-base text-[#8f8daa] mt-6 leading-relaxed">
              A short, useful dispatch every Sunday morning. Tarot, the
              cosmos, sound, and the practice of presence. Free, always.
              Unsubscribe in one tap.
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
            <SubscribeForm />
          </div>

          <p className="font-sans text-xs text-[#8f8daa] text-center mt-6 leading-relaxed">
            We will never sell your data. Read our{" "}
            <a href="/privacy" className="text-[#c4a35a] hover:underline">
              privacy policy
            </a>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
