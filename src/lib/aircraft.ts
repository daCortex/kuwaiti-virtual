/* ----------------------------------------------------------------
   Fileable aircraft — our own Kuwaiti fleet PLUS every aircraft flown
   across the codeshare network (derived from the route database). Used
   by the PIREP form, the filing API and the Discord bot so a pilot can
   log codeshare flights, not just the three Kuwaiti Airbus types.
------------------------------------------------------------------- */

import { ROUTES } from "./routes";
import { FLEET } from "./data";

/* Reduce a route's aircraft string to a clean model name
   ("Aegean Airlines Airbus A320" -> "Airbus A320"). */
export function aircraftModel(aircraft: string): string {
  const m = aircraft.match(/(Airbus|Boeing|Bombardier|Embraer|Cessna|ATR).*/);
  return (m ? m[0] : aircraft).trim();
}

/* Our own fleet, by Infinite Flight type name. */
export const KUWAITI_AIRCRAFT: string[] = FLEET.map((a) => a.type);

/* Distinct codeshare-partner aircraft models across the route network. */
export const CODESHARE_AIRCRAFT: string[] = (() => {
  const set = new Set<string>();
  for (const r of ROUTES) {
    if (r.airline === "Kuwaiti") continue;
    set.add(aircraftModel(r.aircraft));
  }
  return [...set].sort();
})();

/* Grouped options for an aircraft <select>. */
export const AIRCRAFT_GROUPS: { group: string; items: string[] }[] = [
  { group: "Kuwaiti fleet", items: KUWAITI_AIRCRAFT },
  { group: "Codeshare partners", items: CODESHARE_AIRCRAFT },
];

/* Every value that may be filed on a PIREP (validation). */
export const VALID_AIRCRAFT = new Set<string>([
  ...KUWAITI_AIRCRAFT,
  ...CODESHARE_AIRCRAFT,
]);

/* Best aircraft value to prefill when a route is chosen: the specific
   Kuwaiti fleet type for our own routes, the clean model for codeshares. */
export function fileableAircraftFor(route: { aircraft: string; airline: string }): string {
  const n = (route.aircraft || "").toUpperCase();
  if (route.airline === "Kuwaiti") {
    const t =
      (n.includes("A350") && KUWAITI_AIRCRAFT.find((x) => x.includes("A350"))) ||
      (n.includes("A330") && KUWAITI_AIRCRAFT.find((x) => x.includes("A330"))) ||
      (n.includes("A321") && KUWAITI_AIRCRAFT.find((x) => x.includes("A321")));
    if (t) return t;
  }
  return aircraftModel(route.aircraft);
}
