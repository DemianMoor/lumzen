import { createSupabaseServerClient } from "@/lib/supabase";
import { SoundClient } from "./sound-client";

export const dynamic = "force-dynamic";

export default async function SoundPage() {
  const supabase = await createSupabaseServerClient();
  const { data: tracks } = await supabase
    .from("audio_tracks")
    .select("id, title, category, subcategory, duration_seconds, stream_url, frequency_hz, license, tags")
    .eq("is_active", true)
    .order("category", { ascending: true })
    .order("title", { ascending: true });

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#4db8a8] mb-3">
            ✦ MEDITATION &amp; SOUND
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            The sound temple
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa]">
            Frequencies, bowls, water, silence that speaks. Listen with intention.
          </p>
        </header>

        <SoundClient tracks={tracks ?? []} />
      </div>
    </main>
  );
}
