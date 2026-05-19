import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { ImportForm } from "./import-form";

export const dynamic = "force-dynamic";

export default async function ArticlesImportPage() {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  return (
    <div>
      <header className="mb-8">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
          ✦ BULK IMPORT
        </p>
        <h1 className="font-serif italic text-3xl text-[#f0eff8]">
          Import articles from CSV.
        </h1>
        <p className="font-sans text-sm text-[#8f8daa] mt-2 leading-relaxed max-w-2xl">
          Headers expected (case-insensitive):{" "}
          <code className="font-mono text-[#c4a35a]">title</code>,{" "}
          <code className="font-mono text-[#c4a35a]">pillar</code>,{" "}
          <code className="font-mono text-[#c4a35a]">slug</code>,{" "}
          <code className="font-mono text-[#c4a35a]">subtitle</code>,{" "}
          <code className="font-mono text-[#c4a35a]">excerpt</code>,{" "}
          <code className="font-mono text-[#c4a35a]">content</code>,{" "}
          <code className="font-mono text-[#c4a35a]">tags</code>,{" "}
          <code className="font-mono text-[#c4a35a]">status</code>,{" "}
          <code className="font-mono text-[#c4a35a]">scheduled_for</code>,{" "}
          <code className="font-mono text-[#c4a35a]">hero_image_url</code>.
          Rows with an existing slug are updated; new rows are inserted.
        </p>
      </header>

      <div className="max-w-2xl">
        <ImportForm />
      </div>
    </div>
  );
}
