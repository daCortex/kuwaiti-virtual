import { upsertManualPilot, getPilotByIfUsername } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Public pilot application — submitted from the website (no Discord required).
   Creates a PENDING pilot that staff review & accept in the Crew Center
   (Applications → Pending pilots). Persists when DATABASE_URL is configured. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const displayName = String(body.displayName ?? "").trim();
  const ifUsername = String(body.ifUsername ?? "").trim();
  const age = String(body.age ?? "").trim();
  const experience = String(body.experience ?? "").trim();

  if (displayName.length < 2) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (ifUsername.length < 2) {
    return Response.json({ error: "Please enter your Infinite Flight Community username." }, { status: 400 });
  }

  // Already applied / already a pilot with this IFC username?
  const existing = await getPilotByIfUsername(ifUsername).catch(() => null);
  if (existing) {
    return Response.json(
      { error: "An application or pilot with that IFC username already exists." },
      { status: 409 },
    );
  }

  const noteParts = [
    age ? `Age: ${age}` : null,
    experience ? `Experience: ${experience}` : null,
  ].filter(Boolean);

  try {
    await upsertManualPilot({
      // Temporary callsign — staff assign a real "Kuwaiti ###" on acceptance.
      callsign: ifUsername,
      displayName,
      ifUsername,
      status: "pending",
      notes: noteParts.length ? noteParts.join(" · ") : null,
    });
  } catch {
    return Response.json({ error: "Could not submit your application. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
