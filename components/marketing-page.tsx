import {
  StarField,
  NebulaBackground,
} from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";

export function MarketingPage({
  eyebrow,
  title,
  intro,
  quiet,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /**
   * Legal/compliance pages set `quiet` so the animated star field
   * doesn't draw attention away from dense body copy. The nebula
   * backdrop stays for brand continuity.
   */
  quiet?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {!quiet && <StarField />}
      <NebulaBackground />

      <SiteHeader />

      <main className="relative z-10 flex-1 px-6 py-16 md:py-24">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12 text-center">
            <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
              {eyebrow}
            </p>
            <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] leading-tight">
              {title}
            </h1>
            {intro && (
              <p className="font-sans text-base text-[#8f8daa] mt-6 leading-relaxed max-w-2xl mx-auto">
                {intro}
              </p>
            )}
          </header>

          <div className="prose-lumzen space-y-6 font-sans text-[#f0eff8] text-base leading-relaxed">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
