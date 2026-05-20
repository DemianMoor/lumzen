import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  cookieDomainForHost,
  HOST_BY_LOCALE,
  LOCALE_HEADER,
  localeFromHost,
} from "./lib/i18n/config";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  const locale = localeFromHost(host);
  const cookieDomain = cookieDomainForHost(host);
  const pathname = request.nextUrl.pathname;

  // ──────────────────────────────────────────────────────────────────
  // Admin lives only on the apex domain (lumzen.co). Any request to
  // /admin/* on UA or RU subdomains gets 308'd back to the apex.
  // ──────────────────────────────────────────────────────────────────
  if (locale !== "en" && pathname.startsWith("/admin")) {
    const url = new URL(request.url);
    url.host = HOST_BY_LOCALE.en;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // Forward the resolved locale to RSC and route handlers via a request header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            const finalOptions = { ...options };
            if (cookieDomain) finalOptions.domain = cookieDomain;
            supabaseResponse.cookies.set(name, value, finalOptions);
          });
        },
      },
    },
  );

  // Refresh the session so Server Components see a current user.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-dark-32x32.png|icon-light-32x32.png|apple-icon.png|opengraph-image|api).*)",
  ],
};
