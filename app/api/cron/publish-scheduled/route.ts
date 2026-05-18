import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Stage 2: Query articles where status='scheduled' AND scheduled_for <= now()
  // and update them to status='published', set published_at=now().
  return NextResponse.json({
    ok: true,
    message: "Stub — implementation in Stage 2",
  });
}
