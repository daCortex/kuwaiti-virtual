import { getSession } from "@/lib/auth";
import { getPilotById, listPirepsByPilot } from "@/lib/db";
import { ifConfigured, getRecentKuwaitiFlights } from "@/lib/infiniteflight";
import { FLEET } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FLEET_TYPES = FLEET.map((a) => a.type); // ["B777-300ER","A330-900",...,"A320neo"]
const has = (kw: string) => FLEET_TYPES.find((t) => t.toUpperCase().includes(kw)) ?? "";

/* Map an IF aircraft name to one of our current fleet types, else "". */
function toFleetType(ifName: string | null): string {
  if (!ifName) return "";
  const n = ifName.toUpperCase();
  if (n.includes("777")) return has("777");
  if (n.includes("A330-900") || n.includes("A330NEO")) return has("A330-900");
  if (n.includes("A330-800")) return has("A330-800");
  if (n.includes("A330")) return has("A330-300");
  if (n.includes("A321")) return has("A321");
  if (n.includes("A320")) return has("A320");
  return "";
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ configured: false, reason: "auth", flights: [] }, { status: 401 });
  }
  if (!ifConfigured) {
    return Response.json({ configured: false, reason: "no-api", flights: [] });
  }

  const pilot = await getPilotById(session.pilotId);
  if (!pilot?.ifUserId) {
    return Response.json({ configured: false, reason: "no-if", flights: [] });
  }

  const [recent, myPireps] = await Promise.all([
    getRecentKuwaitiFlights(pilot.ifUserId, 8),
    listPirepsByPilot(session.pilotId),
  ]);

  const flights = recent.slice(0, 5).map((f) => {
    // Already filed if a PIREP matches the same route and ~duration.
    const alreadyFiled = myPireps.some(
      (p) =>
        (p.dep ?? "").toUpperCase() === (f.origin ?? "").toUpperCase() &&
        (p.arr ?? "").toUpperCase() === (f.destination ?? "").toUpperCase() &&
        Math.abs((p.rawMinutes ?? p.minutes) - f.minutes) <= 3,
    );
    return {
      flightNo: f.callsign ?? "",
      dep: f.origin ?? "",
      arr: f.destination ?? "",
      aircraft: toFleetType(f.aircraftName),
      aircraftName: f.aircraftName,
      hours: Math.floor(f.minutes / 60),
      minutes: f.minutes % 60,
      totalMinutes: f.minutes,
      server: f.server,
      created: f.created,
      landingCount: f.landingCount,
      fuelKg: f.fuelKg,
      alreadyFiled,
    };
  });

  return Response.json({ configured: true, flights });
}
