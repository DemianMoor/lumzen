import { createSupabaseServerClient } from "@/lib/supabase";
import { AffirmationsClient } from "./affirmations-client";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { key: "abundance", label: "Receivership", description: "Open to what is being offered." },
  { key: "love", label: "Love", description: "For relationship with self and others." },
  { key: "health", label: "Body and rest", description: "For tending what carries you." },
  { key: "identity", label: "Identity", description: "For coming home to yourself." },
  { key: "manifestation", label: "Aligned action", description: "For moving toward what calls you." },
  { key: "morning", label: "Morning", description: "For setting the tone of the day." },
  { key: "sleep", label: "Sleep", description: "For releasing the day." },
  { key: "shadow_work", label: "Shadow", description: "For meeting what you have been avoiding." },
];

const CHAKRA_CATEGORIES = [
  { key: "chakra_root", label: "Root", description: "Ground, safety, body." },
  { key: "chakra_sacral", label: "Sacral", description: "Feeling, creativity, flow." },
  { key: "chakra_solar", label: "Solar plexus", description: "Will, power, agency." },
  { key: "chakra_heart", label: "Heart", description: "Love, connection, compassion." },
  { key: "chakra_throat", label: "Throat", description: "Voice, truth, expression." },
  { key: "chakra_third_eye", label: "Third eye", description: "Insight, intuition." },
  { key: "chakra_crown", label: "Crown", description: "Connection to the larger." },
];

export default async function AffirmationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: affirmations } = await supabase
    .from("affirmations")
    .select("id, text, category, chakra")
    .eq("is_active", true)
    .order("text", { ascending: true });

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#6bcc9e] mb-3">
            ✦ AFFIRMATION PRACTICE
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            Rewire your inner world
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa]">
            Choose a category. Choose a practice. The change is the repetition.
          </p>
        </header>

        <AffirmationsClient
          categories={CATEGORIES}
          chakras={CHAKRA_CATEGORIES}
          affirmations={affirmations ?? []}
        />
      </div>
    </main>
  );
}
