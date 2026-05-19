import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();

  const { data: due, error: selectError } = await supabase
    .from("articles")
    .select("id, slug, scheduled_for")
    .eq("status", "scheduled")
    .lte("scheduled_for", now);

  if (selectError) {
    console.error("Cron select error:", selectError);
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  if (!due || due.length === 0) {
    return NextResponse.json({ ok: true, published: 0 });
  }

  const ids = due.map((d) => d.id);
  const { error: updateError } = await supabase
    .from("articles")
    .update({ status: "published", published_at: now })
    .in("id", ids);

  if (updateError) {
    console.error("Cron update error:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    published: ids.length,
    slugs: due.map((d) => d.slug),
  });
}
