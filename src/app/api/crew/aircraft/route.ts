import { hasCrewAccess } from "@/lib/auth";
import { addAircraft, removeAircraft } from "@/lib/fleetops";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasCrewAccess())) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (String(body.action ?? "add") === "delete") {
    const ok = await removeAircraft(String(body.name ?? ""));
    return ok ? Response.json({ ok: true }) : Response.json({ error: "Not found." }, { status: 400 });
  }

  const res = await addAircraft(String(body.name ?? ""));
  if (!res.ok) return Response.json({ error: res.error }, { status: 400 });
  return Response.json({ ok: true });
}
