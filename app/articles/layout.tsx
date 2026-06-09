import { StarField, NebulaBackground } from "@/components/cosmic-background";
import { SiteHeader, SiteFooter } from "@/components/site-nav";
import { SiteAnalytics } from "@/components/site-analytics";

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
      {/* Per-site analytics from site_settings (GA4 / GTM / Clarity). */}
      <SiteAnalytics />
    </div>
  );
}
