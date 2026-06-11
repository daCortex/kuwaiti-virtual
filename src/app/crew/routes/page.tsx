import { computeAp, categoryForMinutes } from "@/lib/career";
import { getRotw, getSpotlightRoutes, firstFlightNo, allRoutes, allAirlines } from "@/lib/ops";
import { getPilotDashboard } from "@/lib/portal";
import { airportCity } from "@/lib/airports";
import { RouteFinder, type EnrichedRoute } from "@/components/portal/RouteFinder";

export const metadata = { title: "Route Database" };
export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const d = await getPilotDashboard();
  const rankMult = d?.rankMultiplier ?? 1;
  const rotwNo = getRotw().routeNumber;
  const spotlightNos = new Set(getSpotlightRoutes().map((r) => r.routeNumber));

  const ALL = allRoutes();
  const routes: EnrichedRoute[] = ALL.map((r) => {
    const spotlight = spotlightNos.has(r.routeNumber);
    const ap = computeAp(r.minutes, { spotlight, rankMultiplier: rankMult }).net;
    return {
      routeNumber: r.routeNumber,
      flightNo: firstFlightNo(r),
      dep: r.dep,
      arr: r.arr,
      depCity: airportCity(r.dep),
      arrCity: airportCity(r.arr),
      aircraft: r.aircraft.replace(/^Kuwaiti |^Kuwaiti /, ""),
      minutes: r.minutes,
      airline: r.airline,
      category: categoryForMinutes(r.minutes),
      ap,
      spotlight,
      rotw: r.routeNumber === rotwNo,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise mb-6">
        <p className="eyebrow">Network</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Route database</h1>
        <p className="mt-3 max-w-2xl text-cream-dim">
          {ALL.length} routes across the Kuwaiti Virtual network and alliance codeshares. Search by flight number, city or ICAO —
          each card shows the BlueBird Miles you’d earn{rankMult > 1 ? ` at your ${d?.rank.current.name} rank` : ""}.
        </p>
      </header>
      <RouteFinder routes={routes} airlines={["All", ...allAirlines()]} />
    </div>
  );
}
