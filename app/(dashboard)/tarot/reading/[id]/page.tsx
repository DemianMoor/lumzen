import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import { TarotCard } from "@/components/tarot-card";
import { getCurrentMessages, t } from "@/lib/i18n/server";

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
  const { messages } = await getCurrentMessages();

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
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(196,163,90,0.25)] bg-[rgba(196,163,90,0.06)] px-4 py-2 font-sans text-xs text-[#f0eff8] hover:bg-[rgba(196,163,90,0.14)] hover:border-[rgba(196,163,90,0.45)] hover:text-[#c4a35a] transition-all"
        >
          {t(messages, "tarot.reading_detail.back_to_tarot")}
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
              {t(messages, "tarot.reading_detail.reading_label")}
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
