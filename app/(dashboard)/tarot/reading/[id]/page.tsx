import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import { TarotCard } from "@/components/tarot-card";

export const dynamic = "force-dynamic";

type Placed = {
  position: string;
  card: {
    id: string;
    name: string;
    image_url: string | null;
    reversed: boolean;
    meaning_upright?: string;
    meaning_reversed?: string;
  };
};

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const { data: reading } = await supabase
    .from("tarot_readings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!reading) notFound();

  const cards = reading.cards as Placed[];

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/tarot"
          className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
        >
          ← Back to tarot
        </Link>

        <header className="text-center my-8">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            {reading.spread_type}
          </p>
          <p className="font-sans text-xs text-[#8f8daa]">
            {new Date(reading.created_at).toLocaleString()}
          </p>
          {reading.question && (
            <p className="font-serif italic text-lg text-[#f0eff8] mt-4">
              "{reading.question}"
            </p>
          )}
        </header>

        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {cards.map((c, i) => (
            <TarotCard
              key={i}
              name={c.card.name}
              imageUrl={c.card.image_url}
              reversed={c.card.reversed}
              position={c.position}
            />
          ))}
        </div>

        {reading.ai_interpretation && (
          <section
            className="rounded-2xl p-8 border"
            style={{
              background: "rgba(26,26,53,0.5)",
              borderColor: "rgba(196,163,90,0.15)",
            }}
          >
            <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
              Reading
            </p>
            <div className="font-serif text-[#f0eff8] leading-relaxed whitespace-pre-wrap">
              {reading.ai_interpretation}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
