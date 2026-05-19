import { redirect } from "next/navigation";
import { getCurrentEditor } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase";
import { ExportCsvButton } from "./export-csv-button";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const editor = await getCurrentEditor();
  if (!editor) redirect("/admin/signin");

  const supabase = createSupabaseAdmin();
  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select(
      "id, email, phone, email_consent_at, sms_consent_at, source, unsubscribed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const total = subscribers?.length ?? 0;
  const active = (subscribers ?? []).filter((s) => !s.unsubscribed_at).length;
  const emailConsenting = (subscribers ?? []).filter(
    (s) => !!s.email_consent_at && !s.unsubscribed_at,
  ).length;
  const smsConsenting = (subscribers ?? []).filter(
    (s) => !!s.sms_consent_at && !s.unsubscribed_at,
  ).length;

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-2 text-[#c4a35a]">
            ✦ SUBSCRIBERS
          </p>
          <h1 className="font-serif italic text-3xl text-[#f0eff8]">
            The list.
          </h1>
          <p className="font-sans text-sm text-[#8f8daa] mt-2">
            {active} active · {total - active} unsubscribed · {emailConsenting}{" "}
            email · {smsConsenting} SMS
          </p>
        </div>
        <ExportCsvButton />
      </header>

      {error && (
        <p className="font-sans text-sm text-[#ef4444]" role="alert">
          Could not load subscribers: {error.message}
        </p>
      )}

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(26,26,53,0.85)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(196,163,90,0.15)",
        }}
      >
        <table className="w-full font-sans text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(196,163,90,0.10)" }}>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Email consent</Th>
              <Th>SMS consent</Th>
              <Th>Source</Th>
              <Th>Joined</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {(subscribers ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center font-serif italic text-[#8f8daa]"
                >
                  No subscribers yet.
                </td>
              </tr>
            )}
            {(subscribers ?? []).map((s) => (
              <tr
                key={s.id}
                className="border-b last:border-0 hover:bg-[rgba(196,163,90,0.04)] transition-colors"
                style={{ borderColor: "rgba(196,163,90,0.06)" }}
              >
                <Td>
                  <span className="text-[#f0eff8]">{s.email}</span>
                </Td>
                <Td>
                  <span className="font-mono text-xs text-[#8f8daa]">
                    {s.phone ?? "—"}
                  </span>
                </Td>
                <Td>
                  <ConsentDate iso={s.email_consent_at} />
                </Td>
                <Td>
                  <ConsentDate iso={s.sms_consent_at} />
                </Td>
                <Td>
                  <span className="font-mono text-xs text-[#8f8daa]">
                    {s.source ?? "—"}
                  </span>
                </Td>
                <Td>
                  <span className="font-mono text-xs text-[#8f8daa]">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </Td>
                <Td>
                  {s.unsubscribed_at ? (
                    <span className="font-mono text-xs text-[#8f8daa]">
                      Unsubscribed
                    </span>
                  ) : (
                    <span
                      className="inline-block px-2 py-0.5 rounded-full font-display text-[10px] uppercase tracking-[0.1em]"
                      style={{
                        background: "rgba(107,204,158,0.18)",
                        color: "#6bcc9e",
                      }}
                    >
                      Active
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 font-mono text-[11px] text-[#4a4866]">
        Showing {total} subscriber{total === 1 ? "" : "s"} (latest 500).
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}

function ConsentDate({ iso }: { iso: string | null }) {
  if (!iso) return <span className="font-mono text-xs text-[#4a4866]">—</span>;
  return (
    <span className="font-mono text-xs text-[#c4a35a]">
      ✦ {new Date(iso).toLocaleDateString()}
    </span>
  );
}
