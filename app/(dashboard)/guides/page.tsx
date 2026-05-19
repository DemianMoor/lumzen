import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function GuidesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: guides } = await supabase
    .from("spiritual_guides")
    .select("id, slug, title, category, description, read_time_minutes, difficulty, is_featured")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("title", { ascending: true });

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            ✦ SPIRITUAL GUIDES
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            Wisdom you can actually use
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa]">
            Long-form guides on chakras, shadow, moon phases, sacred geometry, the
            foundations of practice.
          </p>
        </header>

        {!guides || guides.length === 0 ? (
          <p className="text-center font-serif italic text-[#8f8daa]">
            The wisdom is waiting. Begin with what calls to you.
          </p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-6">
            {guides.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="block rounded-2xl border p-6 hover:-translate-y-1 transition-all h-full"
                  style={{
                    background: "rgba(26,26,53,0.5)",
                    borderColor: "rgba(196,163,90,0.15)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a]">
                      {g.category.replace(/_/g, " ")}
                    </p>
                    {g.is_featured && (
                      <span
                        className="text-[9px] font-display uppercase tracking-[0.2em] px-2 py-1 rounded-full"
                        style={{
                          background: "rgba(196,163,90,0.12)",
                          color: "#c4a35a",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif italic text-2xl text-[#f0eff8] mb-2 leading-snug">
                    {g.title}
                  </h2>
                  <p className="font-serif text-[#8f8daa] mb-4">{g.description}</p>
                  <p className="font-sans text-xs text-[#8f8daa]">
                    {g.read_time_minutes
                      ? `${g.read_time_minutes} min read`
                      : "Read"}
                    {g.difficulty
                      ? ` · ${DIFFICULTY_LABELS[g.difficulty] ?? g.difficulty}`
                      : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
