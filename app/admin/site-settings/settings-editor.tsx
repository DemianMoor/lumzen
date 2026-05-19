"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Setting = {
  key: string;
  value: unknown;
  updated_at: string;
};

export function SettingsEditor({ initial }: { initial: Setting[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Setting[]>(initial);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin/site-settings");
    if (res.ok) {
      const data = await res.json();
      setItems(data.settings ?? []);
      router.refresh();
    }
  }

  async function save(key: string, value: string) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setMessage(`Saved ${key}.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(key: string) {
    if (!confirm(`Delete setting "${key}"?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/site-settings?key=${encodeURIComponent(key)}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setMessage(`Deleted ${key}.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border p-6"
        style={{
          background: "rgba(26,26,53,0.85)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(196,163,90,0.20)",
        }}
      >
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-4 text-[#c4a35a]">
          ✦ NEW SETTING
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newKey.trim()) return;
            void save(newKey.trim(), newValue);
            setNewKey("");
            setNewValue("");
          }}
          className="grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-end"
        >
          <label>
            <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
              Key
            </span>
            <input
              type="text"
              required
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="welcome_banner"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
            />
          </label>
          <label>
            <span className="block font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa] mb-2">
              Value (JSON or plain string)
            </span>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder='"Hello world" or {"enabled":true}'
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2.5 px-3 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="py-2.5 px-5 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </form>
      </div>

      {message && (
        <p className="font-mono text-xs text-[#6bcc9e]" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="font-mono text-xs text-[#ef4444]" role="alert">
          {error}
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
              <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Key
              </th>
              <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Value
              </th>
              <th className="text-left px-4 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-[#8f8daa]">
                Updated
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center font-serif italic text-[#8f8daa]"
                >
                  No settings yet.
                </td>
              </tr>
            )}
            {items.map((s) => (
              <SettingRow
                key={s.key}
                setting={s}
                busy={busy}
                onSave={save}
                onDelete={remove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingRow({
  setting,
  busy,
  onSave,
  onDelete,
}: {
  setting: Setting;
  busy: boolean;
  onSave: (key: string, value: string) => void;
  onDelete: (key: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(
    typeof setting.value === "string"
      ? setting.value
      : JSON.stringify(setting.value, null, 2),
  );
  return (
    <tr className="border-b last:border-0 align-top" style={{ borderColor: "rgba(196,163,90,0.06)" }}>
      <td className="px-4 py-3 font-mono text-xs text-[#c4a35a]">
        {setting.key}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-[#f0eff8]">
        {editing ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={Math.max(2, value.split("\n").length)}
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg py-2 px-2 font-mono text-xs text-[#f0eff8] focus:outline-none focus:border-[#c4a35a]"
          />
        ) : (
          <pre className="whitespace-pre-wrap text-xs">{value}</pre>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-[11px] text-[#8f8daa]">
        {new Date(setting.updated_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        {editing ? (
          <>
            <button
              type="button"
              onClick={() => {
                onSave(setting.key, value);
                setEditing(false);
              }}
              disabled={busy}
              className="font-sans text-xs text-[#c4a35a] hover:underline mr-3"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="font-sans text-xs text-[#8f8daa] hover:text-[#f0eff8]"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-sans text-xs text-[#c4a35a] hover:underline mr-3"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(setting.key)}
              className="font-sans text-xs text-[#8f8daa] hover:text-[#ef4444]"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
