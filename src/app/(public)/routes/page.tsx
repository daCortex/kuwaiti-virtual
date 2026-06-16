import { ROUTES } from "@/lib/routes";
import { AIRPORT_COORDS, AIRPORTS, airportCity } from "@/lib/airports";
import { SITE } from "@/lib/site";
import { LiveMap } from "@/components/portal/LiveMap";

export const metadata = { title: "Routes" };

function fmt(min: number) {
  return `${Math.floor(min / 60)}h ${(min % 60).toString().padStart(2, "0")}m`;
}

export default function RoutesPage() {
  const hub = AIRPORT_COORDS.OKKK;
  const seen = new Set<string>();
  const out: { to: [number, number]; code: string; city: string }[] = [];
  for (const r of ROUTES) {
    if (r.airline !== "Kuwaiti") continue;
    for (const code of [r.dep, r.arr]) {
      if (code === "OKKK" || seen.has(code) || !AIRPORT_COORDS[code]) continue;
      seen.add(code);
      out.push({ to: AIRPORT_COORDS[code], code, city: AIRPORTS[code]?.city ?? code });
    }
  }
  const sorted = [...ROUTES].sort((a, b) => a.minutes - b.minutes);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">The route database</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">From Kuwait City, to the world.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">{SITE.network.routes} routes. One search. Three runways at Kuwait International form one bridge between Europe and Asia.</p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["Total routes", SITE.network.routes], ["Destinations", SITE.network.airports], ["Longest sector", SITE.longestSector], ["Average sector", SITE.avgSector]].map(([k, v]) => (
          <div key={k as string} className="rounded-2xl border border-obsidian bg-ink-900 p-4 lift">
            <p className="text-xs uppercase tracking-wide text-cream-faint">{k}</p>
            <p className="mt-1 font-display text-xl font-semibold text-cream">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8"><LiveMap hub={hub} legs={out} /></div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-obsidian bg-ink-900">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-obsidian/60 text-xs uppercase tracking-wide text-cream-faint">
              <th className="px-5 py-3 font-normal">Flight #</th><th className="px-5 py-3 font-normal">Departure</th><th className="px-5 py-3 font-normal">Arrival</th><th className="px-5 py-3 font-normal">Aircraft</th><th className="px-5 py-3 font-normal text-right">Flight time</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.routeNumber} className="border-t border-obsidian/40 hover:bg-ink-850">
                <td className="px-5 py-3 font-mono text-cream">{r.routeNumber.split("/")[0]}</td>
                <td className="px-5 py-3 text-cream-dim">{airportCity(r.dep)} <span className="text-cream-faint">({r.dep})</span></td>
                <td className="px-5 py-3 text-cream-dim">{airportCity(r.arr)} <span className="text-cream-faint">({r.arr})</span></td>
                <td className="px-5 py-3 text-cream-dim">{r.aircraft.replace(/^Kuwaiti |^Kuwaiti /, "")}</td>
                <td className="px-5 py-3 text-right text-cream-dim">{fmt(r.minutes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-cream-faint">Showing {sorted.length} published sectors. Pilots can search and filter the full database in the Crew Centre.</p>
    </div>
  );
}
