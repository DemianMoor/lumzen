import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase";
import { AudiobookPlayer } from "./audiobook-player";

export const dynamic = "force-dynamic";

export default async function AudiobookDetailPage({
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

  const { data: book } = await supabase
    .from("audiobooks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!book) notFound();

  const { data: progress } = await supabase
    .from("user_audiobook_progress")
    .select("chapter_id, position_seconds")
    .eq("book_id", book.id)
    .maybeSingle();

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/audiobooks"
          className="font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a] transition-colors"
        >
          ← Back to library
        </Link>

        <header className="grid md:grid-cols-[200px,1fr] gap-6 my-8 items-start">
          {book.cover_image_url ? (
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.04)]">
              <Image
                src={book.cover_image_url}
                alt={book.title}
                fill
                sizes="200px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full aspect-[2/3] rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
              <span className="font-display text-4xl text-[#c4a35a]">✦</span>
            </div>
          )}
          <div>
            <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#d4758a] mb-2">
              Sacred audiobook
            </p>
            <h1 className="font-serif italic text-3xl md:text-4xl text-[#f0eff8] mb-2">
              {book.title}
            </h1>
            <p className="font-sans text-sm text-[#8f8daa] mb-4">{book.author}</p>
            <p className="font-serif text-[#f0eff8] leading-relaxed">
              {book.description}
            </p>
          </div>
        </header>

        <AudiobookPlayer
          bookId={book.id}
          initialChapterId={progress?.chapter_id ?? null}
          initialPosition={progress?.position_seconds ?? 0}
        />
      </div>
    </main>
  );
}
