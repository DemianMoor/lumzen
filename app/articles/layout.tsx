import { StarField, NebulaBackground } from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";

// Analytics (GA4 / GTM / Clarity from site_settings) is rendered once, site-wide,
// in the root app/layout.tsx — not here, to avoid duplicate tags on article pages.
export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StarField />
      <NebulaBackground />
      <SiteHeader />
      <main className="relative z-10 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
