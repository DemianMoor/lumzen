import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");
  const next = url.searchParams.get("next") ?? "/dashboard";

  // Supabase appends ?error=access_denied&error_code=otp_expired (or similar)
  // when a magic / confirmation link has expired or been used.
  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/auth/verify-email?expired=1`, url.origin),
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/auth/verify-email?expired=1`, url.origin),
      );
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
