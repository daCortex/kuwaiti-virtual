import Link from "next/link";
import { getPilotDashboard, fmtHours } from "@/lib/portal";
import { getCargoContracts } from "@/lib/ops";
import { CARGO_CERTS, CARGO_TABLE } from "@/lib/career";
import { airportCity } from "@/lib/airports";
import { Locked } from "@/components/portal/Locked";

export const metadata = { title: "Cargo · Logistics Command" };
export const dynamic = "force-dynamic";

const riskColor: Record<string, string> = {
  low: "bg-ink-800 text-cream-dim",
  medium: "bg-amber-500/12 text-amber-600",
  high: "bg-rose/12 text-rose",
};

export default async function CargoPage() {
  const d = await getPilotDashboard();
  if (!d) return null;
  if (!d.gates.cargo) {
    return <Locked title="Logistics Command" rank="Senior Captain" hours={225} current={d.totalHours} blurb="The Cargo track — freight contracts paid in Logistics Credits (LC) — opens at Senior Captain, the peak of the core ladder." accent="rose" />;
  }

  const cargoHours = 0; // fresh track for this pilot in demo
  const contracts = getCargoContracts(d.session.pilotId, cargoHours);
  const cert = CARGO_CERTS[0];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow" style={{ color: "var(--color-rose)" }}>Logistics Command · Cargo Track</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Freight operations</h1>
          <p className="mt-2 max-w-xl text-cream-dim"><span className="italic">Tarkkuus</span> — precision. Move freight to earn Logistics Credits (LC). Payouts vary with contract risk and your performance incentive.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 px-5 py-3 text-right">
          <p className="text-xs uppercase tracking-wide text-cream-faint">Certification</p>
          <p className="font-display text-xl font-semibold text-cream">{cert.name}</p>
          <p className="text-xs text-cream-faint">{cert.fleet.join(" · ")}</p>
        </div>
      </header>

      {/* contracts */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-cream">Open contracts</h2>
        <span className="text-xs text-cream-faint">Operational audit on submission</span>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contracts.map((c, i) => (
          <div key={c.id} className="rise flex flex-col rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${riskColor[c.risk]}`}>{c.riskLabel}</span>
              <span className="font-mono text-xs text-cream-faint">{c.flightNo}</span>
            </div>
            <p className="mt-3 font-display text-xl font-semibold text-cream">{airportCity(c.dep)} <span className="text-rose">→</span> {airportCity(c.arr)}</p>
            <p className="mt-0.5 text-xs text-cream-faint">{c.dep}–{c.arr} · {c.aircraft} · {fmtHours(c.minutes)}</p>
            <div className="mt-auto flex items-center justify-between border-t border-obsidian/70 pt-3.5">
              <div><p className="text-xs text-cream-faint">payout</p><p className="font-display text-lg font-semibold text-cream">◆ {c.lc.toLocaleString()} LC</p></div>
              <Link href="/crew/file" className="rounded-full px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-125" style={{ background: "var(--color-rose)" }}>Accept</Link>
            </div>
          </div>
        ))}
      </div>

      {/* references */}
      <section className="mt-9 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Contract payouts</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(["low", "medium", "high"] as const).map((r) => (
              <li key={r} className="flex items-center justify-between border-t border-obsidian/60 pt-2">
                <span className="text-cream-dim">{CARGO_TABLE[r].label}</span>
                <span className="text-cream-faint">◆ {CARGO_TABLE[r].net.toLocaleString()} base · ×{CARGO_TABLE[r].incentive}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Higher risk carries an operational adjustment (−10% / −20%) but a stronger performance incentive.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Logistics certifications</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {CARGO_CERTS.map((c) => (
              <li key={c.name} className="flex items-start justify-between gap-3 border-t border-obsidian/60 pt-2">
                <div><span className="font-semibold text-cream">{c.name}</span> <span className="text-xs text-cream-faint">· {c.hours}h cargo</span><p className="text-xs text-cream-faint">{c.fleet.join(" · ")}</p></div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Plus periodic “Delivery Ferry” assignments — high-yield aircraft deliveries from the manufacturer.</p>
        </div>
      </section>
    </div>
  );
}
