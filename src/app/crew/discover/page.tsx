import Link from "next/link";
import { getPilotDashboard, fmtHours } from "@/lib/portal";
import { computeAp } from "@/lib/career";
import { firstFlightNo, allRoutes } from "@/lib/ops";
import { airportCity } from "@/lib/airports";
import { Locked } from "@/components/portal/Locked";

export const metadata = { title: "Alliance Discover" };
export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const d = await getPilotDashboard();
  if (!d) return null;
  if (!d.gates.discover) {
    return <Locked title="Alliance Discover" rank="Sovereign" hours={1000} current={d.totalHours} blurb="Explore the wider partner alliance — partner metal on codeshare sectors across the globe. Reserved for Sovereign aviators." accent="rose" />;
  }

  const routes = allRoutes().filter((r) => r.airline !== "Kuwaiti").map((r) => ({
    ...r,
    ap: computeAp(r.minutes, { rankMultiplier: d.rankMultiplier }).net,
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise">
        <p className="eyebrow" style={{ color: "var(--color-rose)" }}>Sovereign privilege</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Alliance Discover</h1>
        <p className="mt-2 max-w-xl text-cream-dim">Fly partner metal across the alliance network. {routes.length} codeshare sectors, AP credited to your Kuwaiti Virtual account.</p>
      </header>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((r, i) => (
          <div key={r.routeNumber} className="rise rounded-2xl border border-obsidian bg-ink-900 p-4 lift" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-rose/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase text-rose">{r.airline}</span>
              <span className="font-mono text-xs text-cream-faint">{firstFlightNo(r)}</span>
            </div>
            <p className="mt-2.5 font-display text-lg font-semibold text-cream">{airportCity(r.dep)} <span className="text-rose">→</span> {airportCity(r.arr)}</p>
            <p className="text-xs text-cream-faint">{r.aircraft.replace(/^[A-Za-z ]+Airlines? /, "")}</p>
            <div className="mt-3 flex items-center justify-between border-t border-obsidian/60 pt-3">
              <span className="text-xs text-cream-faint">{fmtHours(r.minutes)}</span>
              <span className="text-sm font-semibold text-cream">✦ {r.ap.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/crew/file" className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white">Log a Discover flight</Link>
      </div>
    </div>
  );
}
