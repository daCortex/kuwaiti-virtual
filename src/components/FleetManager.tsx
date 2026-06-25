"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mult = { code: string; value: number; label: string };

const input = "w-full rounded-xl border border-obsidian bg-ink-850 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream-faint outline-none focus:border-gold";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-cream-faint";
const chip = "flex items-center justify-between gap-3 rounded-xl border border-obsidian bg-ink-900 px-4 py-2.5";

export function FleetManager({ aircraft, multipliers }: { aircraft: string[]; multipliers: Mult[] }) {
  const router = useRouter();

  // ---- aircraft ----
  const [acName, setAcName] = useState("");
  const [acBusy, setAcBusy] = useState(false);
  const [acErr, setAcErr] = useState("");

  async function addAc(e: React.FormEvent) {
    e.preventDefault();
    setAcErr("");
    setAcBusy(true);
    const res = await fetch("/api/crew/aircraft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", name: acName }) });
    setAcBusy(false);
    if (res.ok) { setAcName(""); router.refresh(); }
    else { const j = await res.json().catch(() => ({})); setAcErr(j.error || "Could not add aircraft."); }
  }
  async function delAc(name: string) {
    if (!confirm(`Remove ${name}?`)) return;
    const res = await fetch("/api/crew/aircraft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", name }) });
    if (res.ok) router.refresh();
  }

  // ---- multipliers ----
  const [m, setM] = useState({ code: "", value: "", label: "" });
  const [mBusy, setMBusy] = useState(false);
  const [mErr, setMErr] = useState("");
  const setMf = (k: string, v: string) => setM((s) => ({ ...s, [k]: v }));

  async function addM(e: React.FormEvent) {
    e.preventDefault();
    setMErr("");
    setMBusy(true);
    const res = await fetch("/api/crew/multiplier", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", code: m.code, value: Number(m.value), label: m.label }) });
    setMBusy(false);
    if (res.ok) { setM({ code: "", value: "", label: "" }); router.refresh(); }
    else { const j = await res.json().catch(() => ({})); setMErr(j.error || "Could not add multiplier."); }
  }
  async function delM(code: string) {
    if (!confirm(`Remove ${code}?`)) return;
    const res = await fetch("/api/crew/multiplier", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", code }) });
    if (res.ok) router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ===== Aircraft ===== */}
      <div>
        <form onSubmit={addAc} className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h2 className="font-display text-xl font-semibold text-cream">Add aircraft</h2>
          <p className="mt-1 text-sm text-cream-dim">Make a new aircraft type fileable on PIREPs. Use the Infinite Flight name, e.g. <span className="font-mono text-cream">Boeing 787-9</span>.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input className={input} value={acName} onChange={(e) => setAcName(e.target.value)} placeholder="Airbus A350-900" />
            <button type="submit" disabled={acBusy} className="shrink-0 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-125 disabled:opacity-50">{acBusy ? "Adding…" : "Add"}</button>
          </div>
          {acErr && <p className="mt-2 text-sm text-rose-500">{acErr}</p>}
        </form>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-cream">Staff-added aircraft <span className="ml-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">{aircraft.length}</span></h3>
          <div className="mt-3 space-y-2">
            {aircraft.length === 0 && <p className="rounded-xl border border-dashed border-obsidian bg-ink-900 p-6 text-center text-sm text-cream-faint">No staff-added aircraft yet. The base fleet is always fileable.</p>}
            {aircraft.map((a) => (
              <div key={a} className={chip}>
                <span className="text-sm text-cream">{a}</span>
                <button onClick={() => delAc(a)} className="rounded-full border border-obsidian px-3 py-1.5 text-xs text-cream-faint hover:border-rose/50 hover:text-rose">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Multipliers ===== */}
      <div>
        <form onSubmit={addM} className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h2 className="font-display text-xl font-semibold text-cream">Add multiplier</h2>
          <p className="mt-1 text-sm text-cream-dim">Event codes a pilot can apply when filing (multiplies credited flight time).</p>
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={label}>Code</label><input className={`${input} font-mono uppercase`} value={m.code} onChange={(e) => setMf("code", e.target.value)} placeholder="GROUPFLIGHT" /></div>
              <div><label className={label}>Value (×)</label><input type="number" step="0.1" min="1" className={input} value={m.value} onChange={(e) => setMf("value", e.target.value)} placeholder="2" /></div>
            </div>
            <div><label className={label}>Label</label><input className={input} value={m.label} onChange={(e) => setMf("label", e.target.value)} placeholder="Group Flight — 2×" /></div>
            {mErr && <p className="text-sm text-rose-500">{mErr}</p>}
            <button type="submit" disabled={mBusy} className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-125 disabled:opacity-50">{mBusy ? "Adding…" : "Add multiplier"}</button>
          </div>
        </form>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-cream">Staff-added multipliers <span className="ml-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">{multipliers.length}</span></h3>
          <div className="mt-3 space-y-2">
            {multipliers.length === 0 && <p className="rounded-xl border border-dashed border-obsidian bg-ink-900 p-6 text-center text-sm text-cream-faint">No staff-added multipliers yet.</p>}
            {multipliers.map((x) => (
              <div key={x.code} className={chip}>
                <span className="text-sm text-cream"><span className="font-mono">{x.code}</span> · {x.value}× <span className="text-cream-faint">— {x.label}</span></span>
                <button onClick={() => delM(x.code)} className="rounded-full border border-obsidian px-3 py-1.5 text-xs text-cream-faint hover:border-rose/50 hover:text-rose">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
