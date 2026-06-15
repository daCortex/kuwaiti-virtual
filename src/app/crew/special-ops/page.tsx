import Link from "next/link";
import { getPilotDashboard, fmtHours } from "@/lib/portal";
import { ROUTES } from "@/lib/routes";
import { firstFlightNo } from "@/lib/ops";
import { airportCity } from "@/lib/airports";
import { Locked } from "@/components/portal/Locked";

export const metadata = { title: "Special Operations" };
export const dynamic = "force-dynamic";

const MISSIONS = [
  { code: "SO-01", name: "Eastern Star", route: "KU415/KU416", brief: "Ultra-long-haul run to Manila. Endurance and precision required." },
  { code: "SO-02", name: "Desert Falcon", route: "KU117/KU118", brief: "Ultra-long-haul to New York — endurance and fuel discipline." },
  { code: "SO-03", name: "Silk Bridge", route: "KU417/KU418", brief: "The Bangkok–Manila 5th-freedom tag — a true test of stamina." },
  { code: "SO-04", name: "Desert Crown", route: "KU101/KU102", brief: "High-tempo widebody sprint to London Heathrow." },
];

export default async function SpecialOpsPage() {
  const d = await getPilotDashboard();
  if (!d) return null;
  if (!d.gates.specialOps) {
    return <Locked title="Special Operations" rank="BlueBird Captain" hours={550} current={d.totalHours} blurb="Classified high-yield missions for our most elite aviators. Clearance is granted at BlueBird Captain." />;
  }

  const missions = MISSIONS.map((m) => {
    const route = ROUTES.find((r) => r.routeNumber === m.route);
    return { ...m, route };
  }).filter((m) => m.route);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="rise overflow-hidden rounded-3xl border border-obsidian">
        <div className="aurora px-6 py-8 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/55">Clearance · BlueBird Captain +</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-white lg:text-5xl">Special Operations</h1>
          <p className="mt-3 max-w-xl text-white/70">Elite long-haul missions for our most experienced aviators. Fly with precision — these contracts are reserved for the best of Kuwaiti Virtual.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {missions.map((m, i) => (
          <div key={m.code} className="rise overflow-hidden rounded-2xl border border-obsidian bg-ink-900 lift" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="flex items-center justify-between border-b border-obsidian/70 px-5 py-3">
              <span className="font-mono text-xs text-gold">{m.code}</span>
              <span className="rounded-full bg-rose/12 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-rose">Elite mission</span>
            </div>
            <div className="px-5 py-5">
              <h2 className="font-display text-2xl font-semibold text-cream">{m.name}</h2>
              <p className="mt-1 text-sm text-cream-dim">{m.brief}</p>
              <p className="mt-3 font-medium text-cream">{airportCity(m.route!.dep)} <span className="text-gold">→</span> {airportCity(m.route!.arr)}</p>
              <p className="text-xs text-cream-faint">{firstFlightNo(m.route!)} · {m.route!.aircraft.replace(/^Kuwaiti /, "")} · {fmtHours(m.route!.minutes)}</p>
              <div className="mt-4 flex items-center justify-between border-t border-obsidian/70 pt-3.5">
                <span className="text-sm text-cream-dim">{fmtHours(m.route!.minutes)} sector</span>
                <Link href="/crew/file" className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-125">Accept mission</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
