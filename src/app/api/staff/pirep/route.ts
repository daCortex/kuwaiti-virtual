import { getSession, hasCrewAccess } from "@/lib/auth";
import { updatePirepStatus } from "@/lib/db";
import { announceReviewedPirep } from "@/lib/pireplog";

export async function POST(request: Request) {
  if (!(await hasCrewAccess())) {
    return Response.json({ error: "Staff access required." }, { status: 403 });
  }
  const session = await getSession();
  const reviewer = session?.callsign ?? "Admin";

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = Number(body.id);
  const action = body.action;
  if (!Number.isInteger(id) || (action !== "approve" && action !== "reject")) {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  await updatePirepStatus(
    id,
    action === "approve" ? "approved" : "rejected",
    reviewer,
  );
  await announceReviewedPirep(id);

  return Response.json({ ok: true });
}
