import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SignupBody = {
  email?: string;
  password?: string;
  display_name?: string;
  invite_code?: string;
};

/**
 * POST /api/admin/signup
 *
 * Creates a Supabase auth user AND inserts a row into public.editors so
 * the new account passes the gate in lib/admin-auth.ts.
 *
 * Access rules:
 *   1. If the editors table is empty, the very first signup is allowed
 *      without an invite code (bootstrap mode — there's no admin yet
 *      to issue one).
 *   2. Otherwise the body must include the ADMIN_INVITE_CODE configured
 *      in the environment.
 *
 * New accounts confirm email automatically because they're created via
 * the service-role admin client.
 */
export async function POST(request: Request) {
  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const displayName = body.display_name?.trim() || null;
  const inviteCode = body.invite_code?.trim() ?? "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }
  if (password.length < 12) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters." },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdmin();

  // 1) Is this a bootstrap signup, or does an invite code need to match?
  const { count: editorCount, error: countErr } = await admin
    .from("editors")
    .select("id", { count: "exact", head: true });

  if (countErr) {
    return NextResponse.json(
      { error: `Could not check editor table: ${countErr.message}` },
      { status: 500 },
    );
  }

  const isBootstrap = (editorCount ?? 0) === 0;

  if (!isBootstrap) {
    const expected = process.env.ADMIN_INVITE_CODE;
    if (!expected) {
      return NextResponse.json(
        {
          error:
            "Editor registration is closed. The server has no ADMIN_INVITE_CODE configured.",
        },
        { status: 503 },
      );
    }
    if (inviteCode !== expected) {
      return NextResponse.json(
        { error: "That invite code is not valid." },
        { status: 403 },
      );
    }
  }

  // 2) Reject if this email is already an editor.
  const { data: existingEditor } = await admin
    .from("editors")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingEditor) {
    return NextResponse.json(
      { error: "An editor with that email already exists." },
      { status: 409 },
    );
  }

  // 3) Find or create the auth user. If they already have a public-side
  //    LumZen account, reuse it instead of failing.
  const { data: usersPage, error: listErr } =
    await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (listErr) {
    return NextResponse.json(
      { error: `Could not look up users: ${listErr.message}` },
      { status: 500 },
    );
  }
  const existingUser = usersPage.users.find(
    (u) => u.email?.toLowerCase() === email,
  );

  let userId: string;
  if (existingUser) {
    userId = existingUser.id;
  } else {
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: displayName ? { display_name: displayName } : undefined,
      });
    if (createErr || !created.user) {
      return NextResponse.json(
        {
          error: createErr?.message || "Could not create the account.",
        },
        { status: 500 },
      );
    }
    userId = created.user.id;
  }

  // 4) Insert the editor row. Bootstrap signup becomes admin; subsequent
  //    invited signups are role=editor (an existing admin can promote
  //    them later in the editors table).
  const role = isBootstrap ? "admin" : "editor";
  const { error: insertErr } = await admin.from("editors").insert({
    email,
    user_id: userId,
    display_name: displayName,
    role,
  });
  if (insertErr) {
    return NextResponse.json(
      { error: `Could not create editor record: ${insertErr.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    bootstrap: isBootstrap,
    role,
  });
}
