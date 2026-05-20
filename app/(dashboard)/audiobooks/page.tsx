import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentMessages, t } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AudiobooksPage() {
  const supabase = await createSupabaseServerClient();
  const { messages } = await getCurrentMessages();
  const { data: books } = await supabase
    .from("audiobooks")
    .select("id, title, author, description, cover_image_url, is_featured")
    .order("is_featured", { ascending: false })
    .order("title", { ascending: true });

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#d4758a] mb-3">
            {t(messages, "audiobooks.page.eyebrow")}
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            {t(messages, "audiobooks.page.title")}
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa]">
            {t(messages, "audiobooks.page.subtitle")}
          </p>
        </header>

        {!books || books.length === 0 ? (
          <p className="text-center font-serif italic text-[#8f8daa]">
            {t(messages, "audiobooks.page.empty_state")}
          </p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <li key={book.id}>
                <Link
                  href={`/audiobooks/${book.id}`}
                  className="block rounded-2xl border p-5 hover:-translate-y-1 transition-all"
                  style={{
                    background: "rgba(26,26,53,0.5)",
                    borderColor: "rgba(212,117,138,0.15)",
                  }}
                >
                  {book.cover_image_url ? (
                    <div className="relative w-full aspect-[2/3] mb-4 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.04)]">
                      <Image
                        src={book.cover_image_url}
                        alt={book.title}
                        fill
                        sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[2/3] mb-4 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                      <span className="font-display text-3xl text-[#c4a35a]">✦</span>
                    </div>
                  )}
                  <p className="font-serif italic text-lg text-[#f0eff8] leading-snug">
                    {book.title}
                  </p>
                  <p className="font-sans text-xs text-[#8f8daa] mt-1">
                    {book.author}
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
