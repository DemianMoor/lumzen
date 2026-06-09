import Script from "next/script";
import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Per-site analytics (MASTER-SPEC §7). Reads GA4 / GTM / Clarity IDs from this
 * brand's own site_settings and renders the script tags. The central admin
 * manages these IDs; the public site renders them. No control-plane call.
 *
 * (C3 follow-up: this can replace the hardcoded GTM in app/layout.tsx so the
 * whole site is driven by site_settings; here it's wired into the article pages.)
 */
export async function SiteAnalytics() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["analytics_ga4_id", "analytics_gtm_id", "analytics_clarity_id"]);

  const get = (k: string) => {
    const v = data?.find((r) => r.key === k)?.value;
    if (v === null || v === undefined) return "";
    return typeof v === "string" ? v : String(v);
  };
  const ga4 = get("analytics_ga4_id");
  const gtm = get("analytics_gtm_id");
  const clarity = get("analytics_clarity_id");

  return (
    <>
      {gtm && (
        <Script
          id="lz-gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
          }}
        />
      )}
      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script
            id="lz-ga4"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`,
            }}
          />
        </>
      )}
      {clarity && (
        <Script
          id="lz-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`,
          }}
        />
      )}
    </>
  );
}
