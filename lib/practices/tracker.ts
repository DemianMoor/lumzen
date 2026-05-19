import { createSupabaseAdmin } from "@/lib/supabase";

export type PracticeKind =
  | "tarot"
  | "affirmation"
  | "meditation"
  | "journaling"
  | "gratitude";

const COLUMN_BY_KIND: Record<PracticeKind, string> = {
  tarot: "tarot_done",
  affirmation: "affirmation_done",
  meditation: "meditation_done",
  journaling: "journaling_done",
  gratitude: "gratitude_done",
};

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Mark a practice complete for the given user on today's date.
 *
 * Idempotent: re-marking the same practice for the same day is a no-op. Also
 * updates the user_profiles streak fields when a practice completes for the
 * first time today.
 */
export async function markPracticeComplete(
  userId: string,
  kind: PracticeKind,
): Promise<void> {
  const admin = createSupabaseAdmin();
  const date = todayISO();
  const column = COLUMN_BY_KIND[kind];

  const { data: existing } = await admin
    .from("daily_practices")
    .select("*")
    .eq("user_id", userId)
    .eq("practice_date", date)
    .maybeSingle();

  if (existing) {
    if (existing[column] === true) {
      return;
    }
    await admin
      .from("daily_practices")
      .update({ [column]: true })
      .eq("id", existing.id);
  } else {
    await admin.from("daily_practices").insert({
      user_id: userId,
      practice_date: date,
      [column]: true,
    });
  }

  await updateStreak(userId, date);
}

async function updateStreak(userId: string, today: string): Promise<void> {
  const admin = createSupabaseAdmin();

  const { data: profile } = await admin
    .from("user_profiles")
    .select("day_streak, last_practice_date")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return;

  const last = profile.last_practice_date as string | null;
  let nextStreak = profile.day_streak ?? 0;

  if (!last) {
    nextStreak = 1;
  } else if (last === today) {
    return;
  } else {
    const lastDate = new Date(`${last}T00:00:00Z`);
    const todayDate = new Date(`${today}T00:00:00Z`);
    const diffDays = Math.round(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    nextStreak = diffDays === 1 ? nextStreak + 1 : 1;
  }

  await admin
    .from("user_profiles")
    .update({ day_streak: nextStreak, last_practice_date: today })
    .eq("id", userId);
}
