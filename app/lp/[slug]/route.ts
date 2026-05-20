import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { getLocaleFromRequest } from "@/lib/i18n/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const STORAGE_PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public/landing-pages`;
const DEFAULT_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || null;

/**
 * Proxies a landing-page bundle stored in Supabase Storage.
 *
 * Limitation: asset path rewriting is regex-based. Dynamically-built URLs
 * inside JS bundles (e.g. fetch(`/assets/${name}`)) will NOT be rewritten —
 * those landing pages must use absolute paths or render-time helpers.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const locale = getLocaleFromRequest(req);
  const supabase = createSupabaseAdmin();
  const { data: page } = await supabase
    .from("landing_pages")
    .select("slug, entry_file, is_active, gtm_id")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .maybeSingle();

  if (!page) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const entry = page.entry_file || "index.html";
  const entryUrl = `${STORAGE_PUBLIC_BASE}/${slug}/${entry}`;

  let html: string;
  try {
    const res = await fetch(entryUrl, { cache: "no-store" });
    if (!res.ok) {
      return new NextResponse("Landing page bundle missing.", { status: 502 });
    }
    html = await res.text();
  } catch {
    return new NextResponse("Failed to load landing page.", { status: 502 });
  }

  html = rewriteAssetPaths(html, slug);

  const gtmId = page.gtm_id || DEFAULT_GTM_ID;
  if (gtmId) {
    html = injectGtm(html, gtmId);
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function rewriteAssetPaths(html: string, slug: string): string {
  const baseUrl = `${STORAGE_PUBLIC_BASE}/${slug}/`;

  function isRelative(url: string): boolean {
    if (!url) return false;
    if (/^https?:\/\//i.test(url)) return false;
    if (url.startsWith("//")) return false;
    if (url.startsWith("#")) return false;
    if (url.startsWith("mailto:")) return false;
    if (url.startsWith("tel:")) return false;
    if (url.startsWith("data:")) return false;
    if (url.startsWith("javascript:")) return false;
    return true;
  }

  function resolve(url: string): string {
    if (!isRelative(url)) return url;
    return baseUrl + url.replace(/^\.\//, "").replace(/^\//, "");
  }

  html = html.replace(
    /\b(href|src)=(["'])([^"']+)(["'])/gi,
    (_m, attr, q1, url, q2) => `${attr}=${q1}${resolve(url)}${q2}`,
  );

  html = html.replace(
    /\bsrcset=(["'])([^"']+)(["'])/gi,
    (_m, q1, value, q2) => {
      const rewritten = value
        .split(",")
        .map((part: string) => {
          const trimmed = part.trim();
          const space = trimmed.search(/\s/);
          if (space === -1) return resolve(trimmed);
          return resolve(trimmed.substring(0, space)) + trimmed.substring(space);
        })
        .join(", ");
      return `srcset=${q1}${rewritten}${q2}`;
    },
  );

  html = html.replace(
    /url\((["']?)([^)"']+)(["']?)\)/gi,
    (_m, q1, url, q2) => `url(${q1}${resolve(url)}${q2})`,
  );

  return html;
}

function injectGtm(html: string, gtmId: string): string {
  const headScript = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');</script>`;
  const bodyNoscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const at = headMatch.index! + headMatch[0].length;
    html = html.substring(0, at) + headScript + html.substring(at);
  }
  const bodyMatch = html.match(/<body[^>]*>/i);
  if (bodyMatch) {
    const at = bodyMatch.index! + bodyMatch[0].length;
    html = html.substring(0, at) + bodyNoscript + html.substring(at);
  }
  return html;
}
