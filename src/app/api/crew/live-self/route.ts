import { getSession } from "@/lib/auth";
import { getPilotById } from "@/lib/db";
import { ifConfigured, getLiveFlightsForUsers, getLiveryMap } from "@/lib/infiniteflight";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Is the signed-in pilot airborne in Infinite Flight right now?
   Powers the live ACARS banner on the crew dashboard. */
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ airborne: false }, { status: 401 });
  if (!ifConfigured) return Response.json({ airborne: false, configured: false });

  const pilot = await getPilotById(session.pilotId).catch(() => null);
  if (!pilot?.ifUserId) return Response.json({ airborne: false, linked: false });

  const flights = await getLiveFlightsForUsers(new Set([pilot.ifUserId])).catch(() => []);
  const fl = flights[0];
  if (!fl) return Response.json({ airborne: false, linked: true });

  const liveries = await getLiveryMap().catch(() => new Map());
  const liv = fl.liveryId ? liveries.get(fl.liveryId) : undefined;

  return Response.json({
    airborne: true,
    linked: true,
    flight: {
      callsign: fl.callsign,
      altitude: Math.round(fl.altitude),
      speed: Math.round(fl.speed),
      heading: Math.round(fl.heading ?? fl.track ?? 0),
      server: fl.sessionName,
      aircraft: liv?.aircraftName ?? null,
    },
  });
}
