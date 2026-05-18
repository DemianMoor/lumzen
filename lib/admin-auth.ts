import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";

export type EditorRecord = {
  id: string;
  user_id: string | null;
  email: string;
  role: "admin" | "editor";
  created_at: string;
};

/**
 * Get the currently signed-in editor (or null if not signed in or not an editor).
 * Use this in any admin page to gatekeep access.
 *
 * Signing in to Supabase Auth alone is not enough — the user must also have
 * a row in the `editors` table matching their email.
 */
export async function getCurrentEditor(): Promise<{
  user: { id: string; email: string };
  editor: EditorRecord;
} | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const admin = createSupabaseAdmin();
  const { data: editor } = await admin
    .from("editors")
    .select("*")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (!editor) {
    return null;
  }

  // Auto-fill user_id on first sign-in (so we can join by user_id later).
  if (!editor.user_id) {
    await admin
      .from("editors")
      .update({ user_id: user.id })
      .eq("id", editor.id);
    editor.user_id = user.id;
  }

  return {
    user: { id: user.id, email: user.email },
    editor: editor as EditorRecord,
  };
}
