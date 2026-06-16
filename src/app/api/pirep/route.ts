import { getSession } from "@/lib/auth";
import { createPirep, getPilotById, updatePirepStatus } from "@/lib/db";
import { announceFiledPirep } from "@/lib/pireplog";
import { multiplierFor } from "@/lib/data";
import { VALID_AIRCRAFT } from "@/lib/aircraft";
import { ifConfigured, findLogbookFlight } from "@/lib/infiniteflight";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const num = (k: string) => {
    const n = Number(body[k]);
    return Number.isFinite(n) ? n : 0;
  };

  const flightNo = str("flightNo").toUpperCase();
  const dep = str("dep").toUpperCase();
  const arr = str("arr").toUpperCase();
  const aircraft = str("aircraft");
  const rawMinutes = num("hours") * 60 + num("minutes");
  const multiplierCode = str("multiplier").toUpperCase() || null;
  const multiplier = multiplierFor(multiplierCode);
  const minutes = Math.round(rawMinutes * multiplier);
  const server = str("server") || null;
  const remarks = str("remarks") || null;
  const fuelKg = body.fuelKg != null && body.fuelKg !== "" ? num("fuelKg") : null;
  const landingRate =
    body.landingRate != null && body.landingRate !== "" ? num("landingRate") : null;

  if (!flightNo || dep.length < 3 || arr.length < 3) {
    return Response.json(
      { error: "Flight number and valid ICAO airports are required." },
      { status: 400 },
    );
  }
  if (!VALID_AIRCRAFT.has(aircraft)) {
    return Response.json({ error: "Unknown aircraft." }, { status: 400 });
  }
  if (rawMinutes <= 0) {
    return Response.json({ error: "Flight time must be greater than zero." }, { status: 400 });
  }

  // ACARS verification — match the filed flight against the pilot's real
  // Infinite Flight logbook (when their IF account is linked + the API is on).
  let verified = false;
  if (ifConfigured) {
    const pilot = await getPilotById(session.pilotId).catch(() => null);
    if (pilot?.ifUserId) {
      const match = await findLogbookFlight(pilot.ifUserId, dep, arr).catch(() => null);
      verified = !!match;
    }
  }

  const pirep = await createPirep({
    pilotId: session.pilotId,
    flightNo,
    dep,
    arr,
    aircraft,
    minutes,
    rawMinutes,
    multiplier,
    multiplierCode,
    fuelKg,
    landingRate,
    server,
    remarks,
    verified,
  });

  // Verified flights are trusted — auto-approve and credit immediately.
  if (verified) {
    await updatePirepStatus(pirep.id, "approved", "ACARS ✦ verified").catch(() => {});
    pirep.status = "approved";
    pirep.reviewer = "ACARS ✦ verified";
  }

  await announceFiledPirep(pirep.id);

  return Response.json({ ok: true, pirep, verified });
}
