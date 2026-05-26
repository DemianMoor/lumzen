import { NextRequest, NextResponse } from "next/server";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { effectiveChromeState } from "@/lib/landing-page-chrome";

export const runtime = "nodejs";

const BUCKET = "landing-pages";

const VALID_DEADLINE_HOURS = new Set([1, 2, 3, 4, 5, 6, 12, 24, 48, 72, 168]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.description === "string" || body.description === null) {
    updates.description = body.description ? body.description.trim() || null : null;
  }
  if (typeof body.entry_file === "string") {
    updates.entry_file = body.entry_file.trim() || "index.html";
  }
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
  if (typeof body.gtm_id === "string" || body.gtm_id === null) {
    updates.gtm_id = body.gtm_id || null;
  }

  const hasChromeToggle = typeof body.use_site_chrome === "boolean";
  const wantsCancelRevert = body.cancel_revert === true;

  if (hasChromeToggle || wantsCancelRevert) {
    const supabase = createSupabaseAdmin();
    const { data: current, error: readErr } = await supabase
      .from("landing_pages")
      .select("use_site_chrome, chrome_revert_to, chrome_revert_at")
      .eq("slug", slug)
      .maybeSingle();
    if (readErr || !current) {
      return NextResponse.json(
        { error: readErr?.message || "Landing page not found." },
        { status: 404 },
      );
    }

    const state = effectiveChromeState({
      use_site_chrome: current.use_site_chrome ?? false,
      chrome_revert_to: current.chrome_revert_to ?? null,
      chrome_revert_at: current.chrome_revert_at ?? null,
    });

    if (hasChromeToggle) {
      const nextValue = body.use_site_chrome as boolean;
      const rawDeadline =
        body.deadline_hours === undefined ? null : body.deadline_hours;
      let deadlineHours: number | null;
      if (rawDeadline === null) {
        deadlineHours = null;
      } else if (
        typeof rawDeadline === "number" &&
        VALID_DEADLINE_HOURS.has(rawDeadline)
      ) {
        deadlineHours = rawDeadline;
      } else {
        return NextResponse.json(
          { error: "Invalid deadline_hours." },
          { status: 400 },
        );
      }

      updates.use_site_chrome = nextValue;
      if (deadlineHours === null) {
        updates.chrome_revert_to = null;
        updates.chrome_revert_at = null;
      } else {
        const revertAt = new Date(Date.now() + deadlineHours * 3_600_000);
        updates.chrome_revert_to = state.effective;
        updates.chrome_revert_at = revertAt.toISOString();
      }
    } else if (wantsCancelRevert) {
      updates.use_site_chrome = state.effective;
      updates.chrome_revert_to = null;
      updates.chrome_revert_at = null;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("landing_pages")
    .update(updates)
    .eq("slug", slug)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ landingPage: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const editor = await getCurrentEditor();
  if (!editor) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { slug } = await params;
  const supabase = createSupabaseAdmin();

  // Best-effort cleanup of storage objects under this slug.
  const { data: files } = await supabase.storage.from(BUCKET).list(slug, {
    limit: 1000,
  });
  if (files && files.length > 0) {
    const paths = files.map((f) => `${slug}/${f.name}`);
    await supabase.storage.from(BUCKET).remove(paths);
  }

  const { error } = await supabase
    .from("landing_pages")
    .delete()
    .eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
