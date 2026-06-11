/* ----------------------------------------------------------------
   Kuwaiti Virtual — pilot portal aggregation.
   Builds the dashboard model for the signed-in pilot: hours, PIREPs,
   rank + licence progression, BlueBird Miles balance, BlueBird Rewards tier
   and the feature gates (Career / Cargo / Special Ops / Alliance Discover).
------------------------------------------------------------------- */

import { getSession, type Session } from "./auth";
import {
  getPilotById,
  approvedMinutesForPilot,
  listPirepsByPilot,
  type Pilot,
  type Pirep,
} from "./db";
import {
  rankForHours,
  licenseForHours,
  authorizedFleet,
  estimateApFromHours,
  computeAp,
  tierForAp,
  hasRankAtLeast,
  GATES,
  type RankProgress,
} from "./career";

export type Gates = {
  career: boolean;
  cargo: boolean;
  specialOps: boolean;
  discover: boolean;
};

export type PilotDashboard = {
  session: Session;
  pilot: Pilot | null;
  totalMinutes: number;
  totalHours: number;
  totalPireps: number;
  filedPireps: Pirep[]; // newest first
  lastPirepAt: string | null;
  rank: RankProgress;
  rankMultiplier: number;
  license: ReturnType<typeof licenseForHours>;
  fleet: string[];
  apBalance: number;
  tier: ReturnType<typeof tierForAp>;
  gates: Gates;
};

export async function getPilotDashboard(): Promise<PilotDashboard | null> {
  const session = await getSession();
  if (!session) return null;

  const pilot = await getPilotById(session.pilotId).catch(() => null);
  // approvedMinutesForPilot already includes the pilot's historical baseMinutes.
  const totalMinutes = await approvedMinutesForPilot(session.pilotId).catch(() => 0);
  const baseMin = pilot?.baseMinutes ?? 0;
  const totalHours = totalMinutes / 60;

  const filed = (await listPirepsByPilot(session.pilotId).catch(() => [])).sort(
    (a, b) => +new Date(b.filedAt) - +new Date(a.filedAt),
  );
  const totalPireps = (pilot?.basePireps ?? 0) + filed.length;
  const lastPirepAt = filed[0]?.filedAt ?? null;

  const rank = rankForHours(totalHours);
  const rankMultiplier = rank.current.apMultiplier ?? 1;
  const license = licenseForHours(totalHours);
  const fleet = authorizedFleet(totalHours);

  // AP = estimate from historical hours + AP from approved filed flights.
  const earned = filed
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + computeAp(p.minutes, { rankMultiplier }).net, 0);
  const apBalance = estimateApFromHours(baseMin / 60) + earned;
  const tier = tierForAp(apBalance);

  const gates: Gates = {
    career: hasRankAtLeast(totalHours, GATES.careerMode),
    cargo: hasRankAtLeast(totalHours, GATES.cargoMode),
    specialOps: hasRankAtLeast(totalHours, GATES.specialOps),
    discover: hasRankAtLeast(totalHours, GATES.blueBird),
  };

  return {
    session,
    pilot,
    totalMinutes,
    totalHours,
    totalPireps,
    filedPireps: filed,
    lastPirepAt,
    rank,
    rankMultiplier,
    license,
    fleet,
    apBalance,
    tier,
    gates,
  };
}

/* ---- formatting helpers ---- */
export function fmtHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h.toLocaleString()}h ${m.toString().padStart(2, "0")}m`;
}
export function fmtAp(ap: number): string {
  return ap.toLocaleString("en-US");
}
export function fmtApCompact(ap: number): string {
  if (ap >= 1_000_000) return (ap / 1_000_000).toFixed(ap % 1_000_000 === 0 ? 0 : 1) + "M";
  if (ap >= 1_000) return (ap / 1_000).toFixed(ap % 1_000 === 0 ? 0 : 1) + "K";
  return String(ap);
}
export function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
export function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}
