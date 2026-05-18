import Link from "next/link";
import {
  StarField,
  NebulaBackground,
  LumGlowOrb,
} from "@/components/cosmic-background";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">
      <StarField />
      <NebulaBackground />
      <LumGlowOrb />

      <div className="relative z-10 max-w-3xl text-center">
        <div className="mb-6">
          <span className="inline-block text-[32px] leading-none text-[#c4a35a]">
            ✦
          </span>
        </div>

        <p className="font-display text-[15px] tracking-[0.1em] mb-6 text-[#c4a35a]">
          LumZen
        </p>

        <h1 className="font-serif italic text-3xl md:text-5xl text-[#f0eff8] mb-12 leading-tight">
          Where Light Meets Stillness.
        </h1>

        <Link
          href="/auth/signup"
          className="inline-block py-3 px-10 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
        >
          Begin Your Journey ✦
        </Link>

        <p className="font-sans text-xs text-[#8f8daa] mt-6">
          Free forever. No payment. Just practice.
        </p>
      </div>
    </main>
  );
}
