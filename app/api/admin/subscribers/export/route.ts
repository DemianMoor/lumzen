import Papa from "papaparse";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const editor = await getCurrentEditor();
  if (!editor) {
    return new Response("Not authorized.", { status: 401 });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("subscribers")
    .select(
      "email, phone, email_consent_at, sms_consent_at, ip_address, user_agent, source, unsubscribed_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(`Export failed: ${error.message}`, { status: 500 });
  }

  const csv = Papa.unparse(data ?? []);
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lumzen-subscribers-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
