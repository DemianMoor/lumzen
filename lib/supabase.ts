import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

/**
 * For Client Components (browser-side).
 * Used in any file that has "use client" at the top.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * For Server Components and Route Handlers.
 * Reads/writes auth cookies so the user's session is available server-side.
 */
export async function createSupabaseServerClient() {
  // Dynamic import so client components don't pull in next/headers.
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore;
            // proxy.ts refreshes sessions.
          }
        },
      },
    },
  );
}

/**
 * Admin client — uses the service role key.
 * SERVER-SIDE ONLY. Never import from a client component.
 * Bypasses Row Level Security. Use for migrations, cron, admin operations.
 */
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase environment variables are not set. Check .env.local.",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Serve-time tracking config for landing pages, from this brand's own
 * site_settings. The central admin writes these; the public site reads them —
 * same pattern as the analytics IDs.
 *
 * `domain` / `source` drive the tracking-URL rewrite (lib/tracking-rewrite).
 * `script` is the operator-pasted Keitaro visit script (lib/keitaro-inject); it
 * is stored raw, with whatever tracking host Keitaro issued it under, and the
 * rewrite is what makes it brand-correct.
 *
 * Never throws: any failure returns nulls, which turns both the rewriter and the
 * visit-script injection off and serves landing pages exactly as uploaded.
 */
export async function getTrackingConfig(): Promise<{
  domain: string | null;
  source: string | null;
  script: string | null;
}> {
  try {
    const supabase = createSupabaseAdmin();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [
        "tracking_domain",
        "tracking_source",
        "keitaro_tracking_script",
      ]);

    // `value` is jsonb, so supabase-js hands back an already-decoded JS value.
    const get = (key: string): string | null => {
      const raw = data?.find((row) => row.key === key)?.value;
      if (raw === null || raw === undefined) return null;
      return (typeof raw === "string" ? raw : String(raw)) || null;
    };

    return {
      domain: get("tracking_domain"),
      source: get("tracking_source"),
      script: get("keitaro_tracking_script"),
    };
  } catch {
    return { domain: null, source: null, script: null };
  }
}
