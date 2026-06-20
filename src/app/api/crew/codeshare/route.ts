import { hasCrewAccess } from "@/lib/auth";
import { addCodeshareRoute, removeCodeshareRoute } from "@/lib/ops";

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
  const action = String(body.action ?? "add");

  if (action === "delete") {
    const ok = await removeCodeshareRoute(String(body.routeNumber ?? ""));
    return ok ? Response.json({ ok: true }) : Response.json({ error: "Not found." }, { status: 400 });
  }

  const res = await addCodeshareRoute({
    routeNumber: String(body.routeNumber ?? ""),
    dep: String(body.dep ?? ""),
    arr: String(body.arr ?? ""),
    aircraft: String(body.aircraft ?? ""),
    minutes: Number(body.minutes),
    airline: String(body.airline ?? ""),
  });
  if (!res.ok) return Response.json({ error: res.error }, { status: 400 });
  return Response.json({ ok: true });
}
