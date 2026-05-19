import { notFound, redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { ArticleEditor, type ArticleRecord } from "./article-editor";

export const dynamic = "force-dynamic";

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  const { id } = await params;
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  return <ArticleEditor article={data as ArticleRecord} />;
}
