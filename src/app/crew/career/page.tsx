import Link from "next/link";
import { getPilotDashboard, fmtHours } from "@/lib/portal";
import { getDispatches } from "@/lib/ops";
import { AP_TABLE, LICENSES } from "@/lib/career";
import { airportCity } from "@/lib/airports";
import { Locked } from "@/components/portal/Locked";

export const metadata = { title: "Career Mode" };
export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const d = await getPilotDashboard();
  if (!d) return null;
  if (!d.gates.career) {
    return <Locked title="Career Mode" rank="Oasis" hours={115} current={d.totalHours} blurb="Auto-dispatched assignments, the BlueBird Miles economy and licence progression open up once you reach Oasis." />;
  }

  const board = getDispatches(d.session.pilotId, { authorizedFleet: d.fleet, rankMultiplier: d.rankMultiplier });

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">BlueBird Track</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Career Mode</h1>
          <p className="mt-2 max-w-xl text-cream-dim">Fly your dispatched assignments to bank BlueBird Miles. Complete within the window for a 1.25× premium; spotlight sectors pay 2×.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 px-5 py-3 text-right">
          <p className="text-xs uppercase tracking-wide text-cream-faint">Licence</p>
          <p className="font-display text-xl font-semibold text-cream">{d.license.current.short}</p>
          <p className="text-xs text-cream-faint">{d.fleet.length} aircraft authorised</p>
        </div>
      </header>

      {/* dispatch board */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-cream">Dispatch board</h2>
        <span className="text-xs text-cream-faint">Refreshes daily · {board.length} open contracts</span>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {board.map((dp, i) => (
          <div key={dp.id} className="rise flex flex-col rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${dp.spotlight ? "bg-rose/12 text-rose" : dp.priority === "priority" ? "bg-gold/10 text-gold" : "bg-ink-800 text-cream-faint"}`}>{dp.spotlight ? "2× Spotlight" : dp.priority}</span>
              <span className="text-xs text-cream-faint">due {dp.dueInHours}h</span>
            </div>
            <p className="mt-3 font-display text-xl font-semibold text-cream">{airportCity(dp.dep)} <span className="text-gold">→</span> {airportCity(dp.arr)}</p>
            <p className="mt-0.5 text-xs text-cream-faint">{dp.flightNo} · {dp.dep}–{dp.arr} · {dp.aircraft} · {fmtHours(dp.minutes)}</p>
            <div className="mt-auto flex items-center justify-between border-t border-obsidian/70 pt-3.5">
              <div>
                <p className="text-xs text-cream-faint">reward up to</p>
                <p className="font-display text-lg font-semibold text-cream">✦ {dp.maxAp.toLocaleString()}</p>
              </div>
              <Link href="/crew/file" className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-125">Accept & fly</Link>
            </div>
          </div>
        ))}
      </div>

      {/* references */}
      <section className="mt-9 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">AP earnings (net, after overhead)</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(["regional", "continental", "longhaul"] as const).map((c) => (
              <li key={c} className="flex items-center justify-between border-t border-obsidian/60 pt-2">
                <span className="text-cream-dim">{AP_TABLE[c].label}</span>
                <span className="font-semibold text-cream">✦ {AP_TABLE[c].net.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Multipliers stack — punctuality ×1.25, spotlight ×2{d.rankMultiplier > 1 ? `, your ${d.rank.current.name} rank ×${d.rankMultiplier}` : ""}.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Licence & fleet access</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LICENSES.map((l) => {
              const have = d.totalHours >= l.hours;
              return (
                <li key={l.short} className="flex items-start justify-between gap-3 border-t border-obsidian/60 pt-2">
                  <div><span className={`font-semibold ${have ? "text-cream" : "text-cream-faint"}`}>{l.short}</span> <span className="text-xs text-cream-faint">· {l.hours}h+</span><p className="text-xs text-cream-faint">{l.fleet.join(" · ")}</p></div>
                  {have && <span className="text-xs text-gold">✓</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
