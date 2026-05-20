import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentLocale, getCurrentMessages, t } from "@/lib/i18n/server";
import { TarotClient } from "./tarot-client";

export const dynamic = "force-dynamic";

export default async function TarotPage() {
  const supabase = await createSupabaseServerClient();
  const { messages } = await getCurrentMessages();
  const locale = await getCurrentLocale();

  const { data: history } = await supabase
    .from("tarot_readings")
    .select("id, spread_type, created_at, question, cards")
    .eq("locale", locale)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            {t(messages, "tarot.page.eyebrow")}
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            {t(messages, "tarot.page.title")}
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa]">
            {t(messages, "tarot.page.subtitle")}
          </p>
        </header>

        <TarotClient />

        {history && history.length > 0 && (
          <section className="mt-16 border-t pt-10" style={{ borderColor: "rgba(196,163,90,0.12)" }}>
            <h2 className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-4">
              {t(messages, "tarot.page.recent_readings_heading")}
            </h2>
            <ul className="space-y-2">
              {history.map((r) => {
                const cards = (r.cards as Array<{ position: string; card: { name: string } }>) ?? [];
                const summary = cards.map((c) => c.card?.name ?? "—").join(" · ");
                return (
                  <li key={r.id}>
                    <Link
                      href={`/tarot/reading/${r.id}`}
                      className="block rounded-lg border p-4 hover:border-[#c4a35a] transition-colors"
                      style={{
                        background: "rgba(26,26,53,0.5)",
                        borderColor: "rgba(196,163,90,0.12)",
                      }}
                    >
                      <p className="font-sans text-xs text-[#8f8daa] mb-1">
                        {new Date(r.created_at).toLocaleString()} · {r.spread_type}
                      </p>
                      <p className="font-serif italic text-[#f0eff8]">{summary}</p>
                      {r.question && (
                        <p className="font-sans text-xs text-[#8f8daa] mt-1">
                          {r.question}
                        </p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
