import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = createSupabaseAdmin();
  const [articles, subs, lps] = await Promise.all([
    supabase.from("articles").select("status", { count: "exact", head: false }),
    supabase
      .from("subscribers")
      .select("unsubscribed_at", { count: "exact", head: false }),
    supabase
      .from("landing_pages")
      .select("is_active", { count: "exact", head: false }),
  ]);

  const articleCount = articles.data?.length ?? 0;
  const drafts = (articles.data ?? []).filter(
    (a) => a.status === "draft",
  ).length;
  const scheduled = (articles.data ?? []).filter(
    (a) => a.status === "scheduled",
  ).length;
  const published = (articles.data ?? []).filter(
    (a) => a.status === "published",
  ).length;

  const subscriberCount = subs.data?.length ?? 0;
  const activeSubscribers = (subs.data ?? []).filter(
    (s) => !s.unsubscribed_at,
  ).length;

  const lpCount = lps.data?.length ?? 0;
  const activeLps = (lps.data ?? []).filter((p) => p.is_active).length;

  return {
    articleCount,
    drafts,
    scheduled,
    published,
    subscriberCount,
    activeSubscribers,
    lpCount,
    activeLps,
  };
}

export default async function AdminDashboardPage() {
  const editor = await getCurrentEditor();
  if (!editor) {
    redirect("/admin/signin");
  }

  const counts = await getCounts();

  return (
    <div>
      <header className="mb-8">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
          ✦ EDITORIAL DASHBOARD
        </p>
        <h1 className="font-serif italic text-3xl text-[#f0eff8]">
          The sanctuary, from above.
        </h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          href="/admin/articles"
          label="✦ ARTICLES"
          title={String(counts.articleCount)}
          body={`${counts.published} published · ${counts.scheduled} scheduled · ${counts.drafts} draft`}
        />
        <StatCard
          href="/admin/subscribers"
          label="✦ SUBSCRIBERS"
          title={String(counts.activeSubscribers)}
          body={`${counts.subscriberCount} total · ${
            counts.subscriberCount - counts.activeSubscribers
          } unsubscribed`}
        />
        <StatCard
          href="/admin/landing-pages"
          label="✦ LANDING PAGES"
          title={String(counts.activeLps)}
          body={`${counts.lpCount} total · ${counts.activeLps} active`}
        />
      </div>

      <section className="mt-12">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-4 text-[#c4a35a]">
          ✦ QUICK ACTIONS
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles/new"
            className="inline-block py-2.5 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
          >
            New article ✦
          </Link>
          <Link
            href="/admin/articles/import"
            className="inline-block py-2.5 px-5 rounded-full border border-[#c4a35a] text-[#c4a35a] font-sans text-sm hover:bg-[rgba(196,163,90,0.10)] transition-all"
          >
            Bulk import →
          </Link>
          <Link
            href="/admin/landing-pages"
            className="inline-block py-2.5 px-5 rounded-full border border-[rgba(255,255,255,0.10)] text-[#8f8daa] font-sans text-sm hover:text-[#f0eff8] hover:border-[#c4a35a] transition-all"
          >
            Landing pages →
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  href,
  label,
  title,
  body,
}: {
  href: string;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl p-6 border transition-all hover:-translate-y-1"
      style={{
        background: "rgba(26,26,53,0.85)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(196,163,90,0.20)",
      }}
    >
      <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
        {label}
      </p>
      <p className="font-mono text-4xl text-[#f0eff8] mb-2">{title}</p>
      <p className="font-sans text-xs text-[#8f8daa]">{body}</p>
    </Link>
  );
}
