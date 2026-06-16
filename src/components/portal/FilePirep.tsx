"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categoryForMinutes } from "@/lib/career";

const CAT_LABEL: Record<string, string> = {
  regional: "Regional (<2h)",
  continental: "Continental (2–6h)",
  longhaul: "Long-Haul (>6h)",
};

type Group = { group: string; items: string[] };
type Mult = { code: string; value: number; label: string };

type IfFlight = {
  flightNo: string;
  dep: string;
  arr: string;
  aircraft: string;
  aircraftName: string | null;
  hours: number;
  minutes: number;
  totalMinutes: number;
  server: string | null;
  landingCount: number;
  fuelKg: number;
  alreadyFiled: boolean;
};

const SERVERS = ["Expert", "Training", "Casual"];

export function FilePirep({
  groups,
  multipliers,
}: {
  groups: Group[];
  multipliers: Mult[];
}) {
  const router = useRouter();
  const [f, setF] = useState({
    flightNo: "", dep: "", arr: "", aircraft: "", hours: "", minutes: "",
    server: "Expert", landingRate: "", fuelKg: "", multiplier: "", remarks: "", punctual: true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // ---- Infinite Flight ACARS import ----
  const [ifState, setIfState] = useState<"loading" | "no-api" | "no-if" | "ready">("loading");
  const [flights, setFlights] = useState<IfFlight[]>([]);
  const [ifc, setIfc] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectErr, setConnectErr] = useState("");

  const set = (k: string, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  const loadIf = useCallback(async () => {
    try {
      const res = await fetch("/api/pirep/suggestions");
      const d = await res.json();
      if (!d.configured) {
        setIfState(d.reason === "no-if" ? "no-if" : "no-api");
        return;
      }
      setFlights(d.flights ?? []);
      setIfState("ready");
    } catch {
      setIfState("no-api");
    }
  }, []);

  useEffect(() => { loadIf(); }, [loadIf]);

  async function connect() {
    setConnectErr("");
    if (ifc.trim().length < 2) return setConnectErr("Enter your Infinite Flight Community username.");
    setConnecting(true);
    try {
      const res = await fetch("/api/pilot/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ifUsername: ifc.trim() }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setConnectErr(d.error || "Could not link that account."); return; }
      setIfState("loading");
      await loadIf();
    } finally {
      setConnecting(false);
    }
  }

  function useFlight(fl: IfFlight) {
    setF((s) => ({
      ...s,
      flightNo: fl.flightNo || s.flightNo,
      dep: fl.dep || s.dep,
      arr: fl.arr || s.arr,
      aircraft: fl.aircraft || s.aircraft,
      hours: String(fl.hours),
      minutes: String(fl.minutes),
      server: fl.server && SERVERS.includes(fl.server) ? fl.server : s.server,
      fuelKg: fl.fuelKg ? String(fl.fuelKg) : s.fuelKg,
    }));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const rawMin = (Number(f.hours) || 0) * 60 + (Number(f.minutes) || 0);
  const cat = useMemo(() => (rawMin > 0 ? categoryForMinutes(rawMin) : null), [rawMin]);
  const durLabel = rawMin > 0 ? `${Math.floor(rawMin / 60)}h ${(rawMin % 60).toString().padStart(2, "0")}m` : "—";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!f.flightNo || f.dep.length < 3 || f.arr.length < 3) return setError("Flight number and valid ICAO airports are required.");
    if (!f.aircraft) return setError("Select an aircraft.");
    if (rawMin <= 0) return setError("Flight time must be greater than zero.");
    setBusy(true);
    const res = await fetch("/api/pirep", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, fuelKg: f.fuelKg, landingRate: f.landingRate }),
    });
    setBusy(false);
    if (res.ok) { router.push("/logbook"); router.refresh(); }
    else { const j = await res.json().catch(() => ({})); setError(j.error || "Could not file PIREP."); }
  }

  const input = "w-full rounded-xl border border-obsidian bg-ink-850 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream-faint outline-none transition-colors focus:border-gold";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-cream-faint";

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* ===== Infinite Flight ACARS import ===== */}
      {ifState !== "no-api" && (
        <div className="overflow-hidden rounded-2xl border border-gold/30 bg-ink-900">
          <div className="flex items-center gap-2 border-b border-obsidian/70 bg-gold/5 px-5 py-3">
            <span className="text-gold">✈</span>
            <p className="text-sm font-semibold text-cream">Import from Infinite Flight</p>
            <span className="ml-auto rounded-full bg-gold/10 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-gold">ACARS</span>
          </div>

          {ifState === "loading" && (
            <p className="px-5 py-5 text-sm text-cream-faint">Checking your Infinite Flight logbook…</p>
          )}

          {ifState === "no-if" && (
            <div className="px-5 py-5">
              <p className="text-sm text-cream-dim">Link your Infinite Flight account once to auto-import flights and get <span className="font-medium text-cream">verified, auto-approved PIREPs</span>.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input value={ifc} onChange={(e) => setIfc(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); connect(); } }} placeholder="IFC username" className={input} />
                <button type="button" onClick={() => connect()} disabled={connecting} className="shrink-0 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-125 disabled:opacity-60">{connecting ? "Linking…" : "Connect"}</button>
              </div>
              {connectErr && <p className="mt-2 text-sm text-rose-500">{connectErr}</p>}
            </div>
          )}

          {ifState === "ready" && (
            flights.length === 0 ? (
              <p className="px-5 py-5 text-sm text-cream-faint">No recent Kuwaiti flights found in your IF logbook. Fly a KU callsign on the Expert/Training/Casual server and it&apos;ll appear here.</p>
            ) : (
              <ul className="divide-y divide-obsidian/60">
                {flights.map((fl, i) => (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-cream">{fl.dep || "—"} → {fl.arr || "—"} <span className="ml-1 font-mono text-xs text-cream-faint">{fl.flightNo}</span></p>
                      <p className="text-xs text-cream-faint">{fl.aircraftName ?? "—"} · {fl.hours}h {String(fl.minutes).padStart(2, "0")}m · {fl.server ?? "—"}</p>
                    </div>
                    {fl.alreadyFiled ? (
                      <span className="shrink-0 rounded-full bg-ink-800 px-3 py-1 text-xs text-cream-faint">Filed</span>
                    ) : (
                      <button type="button" onClick={() => useFlight(fl)} className="shrink-0 rounded-full border border-gold/40 px-3.5 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/10">Use ✓</button>
                    )}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* form */}
        <div className="space-y-5 rounded-2xl border border-obsidian bg-ink-900 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className={label}>Flight no.</label><input className={`${input} uppercase font-mono`} placeholder="KU117" value={f.flightNo} onChange={(e) => set("flightNo", e.target.value)} /></div>
            <div><label className={label}>From (ICAO)</label><input className={`${input} uppercase font-mono`} placeholder="OKKK" maxLength={4} value={f.dep} onChange={(e) => set("dep", e.target.value)} /></div>
            <div><label className={label}>To (ICAO)</label><input className={`${input} uppercase font-mono`} placeholder="KJFK" maxLength={4} value={f.arr} onChange={(e) => set("arr", e.target.value)} /></div>
          </div>
          <div><label className={label}>Aircraft</label>
            <select className={input} value={f.aircraft} onChange={(e) => set("aircraft", e.target.value)}>
              <option value="">Select aircraft…</option>
              {groups.map((g) => <optgroup key={g.group} label={g.group}>{g.items.map((it) => <option key={it} value={it}>{it}</option>)}</optgroup>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <div><label className={label}>Hours</label><input className={input} type="number" min={0} placeholder="9" value={f.hours} onChange={(e) => set("hours", e.target.value)} /></div>
            <div><label className={label}>Minutes</label><input className={input} type="number" min={0} max={59} placeholder="05" value={f.minutes} onChange={(e) => set("minutes", e.target.value)} /></div>
            <div><label className={label}>Server</label><select className={input} value={f.server} onChange={(e) => set("server", e.target.value)}>{SERVERS.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label className={label}>Landing (fpm)</label><input className={input} type="number" placeholder="-120" value={f.landingRate} onChange={(e) => set("landingRate", e.target.value)} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={label}>Fuel used (kg)</label><input className={input} type="number" placeholder="64800" value={f.fuelKg} onChange={(e) => set("fuelKg", e.target.value)} /></div>
            <div><label className={label}>Event code (optional)</label>
              <select className={input} value={f.multiplier} onChange={(e) => set("multiplier", e.target.value)}>
                <option value="">None</option>
                {multipliers.map((m) => <option key={m.code} value={m.code}>{m.label}</option>)}
              </select>
            </div>
          </div>
          <div><label className={label}>Remarks</label><textarea className={`${input} min-h-[80px]`} placeholder="Anything notable about the flight…" value={f.remarks} onChange={(e) => set("remarks", e.target.value)} /></div>
          <label className="flex items-center gap-2.5 text-sm text-cream-dim">
            <input type="checkbox" checked={f.punctual} onChange={(e) => set("punctual", e.target.checked)} className="h-4 w-4 accent-[var(--color-gold)]" />
            Filed within the punctuality window
          </label>
          {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{error}</p>}
        </div>

        {/* Flight summary */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-obsidian">
            <div className="aurora px-5 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Flight summary</p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {f.dep && f.arr ? `${f.dep.toUpperCase()} → ${f.arr.toUpperCase()}` : "—"}
              </p>
              <p className="mt-1 text-sm text-white/60">{f.flightNo ? f.flightNo.toUpperCase() : "Flight"} · {durLabel}</p>
            </div>
            <div className="space-y-2 bg-ink-900 px-5 py-4 text-sm">
              <Row k="Category" v={cat ? CAT_LABEL[cat] : "—"} />
              <Row k="Duration" v={durLabel} />
              <Row k="Aircraft" v={f.aircraft || "—"} />
              <Row k="Server" v={f.server} />
              <div className="mt-1 border-t border-obsidian/60 pt-2"><Row k="Counts toward rank" v={rawMin > 0 ? durLabel : "—"} strong /></div>
            </div>
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(31,44,86,0.9)] transition-all hover:brightness-125 disabled:opacity-60">
            {busy ? "Filing…" : "Submit PIREP"}
          </button>
          <p className="text-center text-xs text-cream-faint">Flights matched to your IF logbook are verified &amp; approved automatically.</p>
        </div>
      </div>
    </form>
  );
}

function Row({ k, v, dim, strong }: { k: string; v: string; dim?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={dim ? "text-cream-faint" : "text-cream-dim"}>{k}</span>
      <span className={strong ? "font-semibold text-cream" : dim ? "text-cream-faint" : "text-cream"}>{v}</span>
    </div>
  );
}
