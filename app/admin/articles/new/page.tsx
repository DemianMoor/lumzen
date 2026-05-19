import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { NewArticleForm } from "./new-article-form";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  return (
    <div>
      <header className="mb-8">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
          ✦ NEW ARTICLE
        </p>
        <h1 className="font-serif italic text-3xl text-[#f0eff8]">
          Begin a draft.
        </h1>
        <p className="font-sans text-sm text-[#8f8daa] mt-2">
          Pick a pillar and a title. The full editor opens next.
        </p>
      </header>

      <div className="max-w-2xl">
        <NewArticleForm />
      </div>
    </div>
  );
}
