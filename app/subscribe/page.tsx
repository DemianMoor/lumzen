import type { Metadata } from "next";
import {
  StarField,
  NebulaBackground,
} from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";
import { NoSubscribePopup } from "@/lib/popup-context";
import { SubscribeForm } from "./subscribe-form";

export const metadata: Metadata = {
  title: "Subscribe · LumZen",
  description:
    "Receive the daily card, weekly reflections, and quiet announcements from LumZen. Free, always. Unsubscribe at any time.",
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
              ✦ JOIN THE COMMUNITY
            </p>
            <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] leading-tight">
              Receive the practice in your inbox.
            </h1>
            <p className="font-sans text-base text-[#8f8daa] mt-6 leading-relaxed">
              Daily card, weekly reflections, and quiet announcements. No
              noise, no urgency, no marketing tricks.
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
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
