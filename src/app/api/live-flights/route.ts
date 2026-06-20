import {
  ifConfigured,
  getFlightsByCallsignSuffix,
  getLiveryMap,
  getFlightRoute,
  getFlightTrack,
} from "@/lib/infiniteflight";
import { allRoutes, refreshExtraRoutes } from "@/lib/ops";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Normalise any aircraft string to a fleet token (A350 / A330 / A321). */
function fleetTok(name: string | null | undefined): string {
  const n = (name ?? "").toUpperCase();
  if (n.includes("A350")) return "A350";
  if (n.includes("A330")) return "A330";
  if (n.includes("A321")) return "A321";
  return "";
}

/* Kuwaiti route pairs ("DEP|ARR") → the aircraft tokens flown on them. Built
   per request from the live database (static network + staff-added routes); a
   live flight must match one to be shown. */
function buildKuwaitiRoutes(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const r of allRoutes()) {
    if (r.airline !== "Kuwaiti") continue;
    const key = `${r.dep.toUpperCase()}|${r.arr.toUpperCase()}`;
    if (!map.has(key)) map.set(key, new Set());
    const tok = fleetTok(r.aircraft);
    if (tok) map.get(key)!.add(tok);
  }
  return map;
}

// Kuwaiti Virtual flights airborne right now (callsign contains "Kuwaiti"),
// limited to flights whose route is in our database (Expert server only).
export async function GET() {
  if (!ifConfigured) {
    return Response.json({ configured: false, flights: [] });
  }

  await refreshExtraRoutes();
  const KUWAITI_ROUTES = buildKuwaitiRoutes();

  const [flights, liveries] = await Promise.all([
    getFlightsByCallsignSuffix("KUWAITI"),
    getLiveryMap(),
  ]);

  // Per-flight: filed route (origin/dest + planned path) and the real track.
  const details = await Promise.all(
    flights.map(async (f) => {
      const [route, track] = await Promise.all([
        getFlightRoute(f.sessionId, f.flightId).catch(() => null),
        getFlightTrack(f.sessionId, f.flightId).catch(() => []),
      ]);
      return { route, track };
    }),
  );

  // When the route database is empty (routes managed in the Crew Center),
  // show every Kuwaiti-callsign flight so the live map still comes alive.
  const noRouteFilter = KUWAITI_ROUTES.size === 0;

  const out = flights
    .map((f, i) => {
      const liv = f.liveryId ? liveries.get(f.liveryId) : undefined;
      const { route, track } = details[i];

      if (!noRouteFilter) {
        // Must fly a route in our database, with an appropriate aircraft.
        const origin = (route?.origin ?? "").toUpperCase();
        const dest = (route?.destination ?? "").toUpperCase();
        if (!origin || !dest) return null;
        const allowed = KUWAITI_ROUTES.get(`${origin}|${dest}`);
        if (!allowed) return null; // route not in our database → skip
        const acTok = fleetTok(liv?.aircraftName);
        if (acTok && allowed.size > 0 && !allowed.has(acTok)) return null; // wrong aircraft
      }

      return {
        id: f.flightId,
        callsign: f.callsign,
        lat: f.latitude,
        lon: f.longitude,
        altitude: Math.round(f.altitude),
        speed: Math.round(f.speed),
        heading: Math.round(f.heading ?? f.track ?? 0),
        server: f.sessionName,
        aircraft: liv?.aircraftName ?? null,
        livery: liv?.liveryName ?? null,
        origin: route?.origin ?? null,
        destination: route?.destination ?? null,
        originLoc: route?.originLoc ?? null,
        destinationLoc: route?.destinationLoc ?? null,
        plannedPath: route?.plannedPath ?? [],
        track, // actual flown path (downsampled lat/lon)
      };
    })
    .filter((f) => f !== null);

  return Response.json({ configured: true, flights: out });
}
