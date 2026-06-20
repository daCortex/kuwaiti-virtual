/* ----------------------------------------------------------------
   Kuwaiti Virtual — operations: Route of the Week, Spotlight routes
   (2× AP), and Career-mode auto-dispatch.

   ROTW is staff-settable (in-memory demo store). Spotlights and dispatch
   assignments are generated deterministically from the day so they stay
   stable across refreshes and only roll over on a new day/week.
------------------------------------------------------------------- */

import { ROUTES, type Route } from "./routes";
import { dbConfigured, listRoutesDb, addRouteDb, removeRouteDb } from "./db";
import {
  computeAp,
  categoryForMinutes,
  computeLc,
  cargoCertForHours,
  type FlightCategory,
  type CargoRisk,
} from "./career";

/* ---- deterministic RNG (so dispatch/spotlight are stable per period) ---- */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function dayIndex(d = new Date()): number {
  return Math.floor(d.getTime() / 86_400_000);
}
function weekIndex(d = new Date()): number {
  return Math.floor(dayIndex(d) / 7);
}

export function firstFlightNo(r: Route): string {
  return r.routeNumber.split("/")[0];
}

/* ---- Ops store (demo): Route of the Week + staff-added codeshare routes ---- */
const g = globalThis as unknown as { __fnrOps?: { rotwNo: string; extra: Route[] } };
const store = (g.__fnrOps ??= {
  // default ROTW: the flagship long-haul to New York
  rotwNo: "KU117/KU118",
  extra: [], // codeshare routes added by staff in the Crew Center
});
store.extra ??= [];

/* All routes = the static network + staff-added routes (Crew Center). */
export function allRoutes(): Route[] {
  return [...ROUTES, ...store.extra];
}

/* Live Kuwaiti mainline routes — base network plus anything staff have added.
   Drives Route of the Week, spotlights, dispatch and cargo, so the routes
   added in the Crew Center immediately power the whole portal. */
function kuwaitiRoutes(): Route[] {
  return allRoutes().filter((r) => r.airline === "Kuwaiti");
}
export function getExtraRoutes(): Route[] {
  return [...store.extra];
}

/* Load staff-added routes from the database into the in-memory cache so the
   synchronous accessors (allRoutes, getRotw, …) stay current. Call this at the
   start of any async route-facing page/handler. No-op without a database. */
export async function refreshExtraRoutes(): Promise<void> {
  if (!dbConfigured) return;
  try {
    store.extra = await listRoutesDb();
  } catch {
    /* keep whatever cache we have if the DB read fails */
  }
}
export function allAirlines(): string[] {
  return [...new Set(allRoutes().map((r) => r.airline))];
}

/* Staff: add a route to the network. Persists to the database when one is
   connected; otherwise held in the in-memory store for the session. */
export async function addCodeshareRoute(input: {
  routeNumber: string;
  dep: string;
  arr: string;
  aircraft: string;
  minutes: number;
  airline: string;
}): Promise<{ ok: boolean; error?: string }> {
  const routeNumber = input.routeNumber.trim().toUpperCase();
  const dep = input.dep.trim().toUpperCase();
  const arr = input.arr.trim().toUpperCase();
  const airline = input.airline.trim();
  const minutes = Math.round(Number(input.minutes));
  if (!routeNumber || dep.length < 3 || arr.length < 3) return { ok: false, error: "Flight number and valid ICAO airports are required." };
  if (!airline) return { ok: false, error: "Airline is required." };
  if (!Number.isFinite(minutes) || minutes <= 0) return { ok: false, error: "Block time must be greater than zero." };
  await refreshExtraRoutes();
  if (allRoutes().some((r) => r.routeNumber === routeNumber)) return { ok: false, error: "That flight number already exists." };
  const route: Route = { routeNumber, dep, arr, aircraft: input.aircraft.trim() || `${airline} aircraft`, minutes, airline };
  if (dbConfigured) await addRouteDb(route);
  store.extra.push(route);
  return { ok: true };
}
export async function removeCodeshareRoute(routeNumber: string): Promise<boolean> {
  let removed = false;
  if (dbConfigured) removed = await removeRouteDb(routeNumber);
  const before = store.extra.length;
  store.extra = store.extra.filter((r) => r.routeNumber !== routeNumber);
  return removed || store.extra.length < before;
}

export function getRotw(): Route | null {
  const routes = kuwaitiRoutes();
  return (
    routes.find((r) => r.routeNumber === store.rotwNo) ??
    routes[0] ??
    null
  );
}
export function setRotw(routeNumber: string): boolean {
  const ok = kuwaitiRoutes().some((r) => r.routeNumber === routeNumber);
  if (ok) store.rotwNo = routeNumber;
  return ok;
}
export function rotwOptions(): Route[] {
  return kuwaitiRoutes();
}

/* ---- Spotlight routes (2× AP), 1–3 per week ---- */
export function getSpotlightRoutes(d = new Date()): Route[] {
  const r = rng(weekIndex(d) * 7919 + 13);
  const count = 1 + Math.floor(r() * 3); // 1–3
  const pool = [...kuwaitiRoutes()];
  const picks: Route[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    picks.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  }
  return picks;
}
export function isSpotlight(routeNumber: string, d = new Date()): boolean {
  return getSpotlightRoutes(d).some((r) => r.routeNumber === routeNumber);
}

/* ---- Career-mode auto-dispatch ----
   Each pilot gets a small board of assigned flights with a deadline and an AP
   reward. Completing within the window earns the 1.25× punctuality premium;
   spotlight sectors carry 2×. Deterministic per pilot per day. */
export type Dispatch = {
  id: string;
  flightNo: string;
  dep: string;
  arr: string;
  aircraft: string;
  minutes: number;
  category: FlightCategory;
  baseAp: number;
  spotlight: boolean;
  maxAp: number; // with punctuality + spotlight + rank multiplier
  dueInHours: number; // window from "now"
  priority: "standard" | "priority";
};

export function getDispatches(
  pilotId: number,
  opts: { authorizedFleet?: string[]; rankMultiplier?: number; maxCodeshareHours?: number } = {},
  d = new Date(),
): Dispatch[] {
  const r = rng((pilotId + 1) * 2654435761 + dayIndex(d));
  const spotlights = new Set(getSpotlightRoutes(d).map((x) => x.routeNumber));
  const rankMult = opts.rankMultiplier ?? 1;

  // Eligible routes: any route in the network the pilot can fly (Kuwaiti
  // mainline, codeshares, and imported packs like Jet Airways).
  let pool = allRoutes().slice();
  if (opts.authorizedFleet?.length) {
    const ok = pool.filter((rt) =>
      opts.authorizedFleet!.some((f) =>
        rt.aircraft.toLowerCase().includes(f.toLowerCase().replace("-", " ").slice(0, 4)),
      ),
    );
    if (ok.length >= 4) pool = ok;
  }

  const board: Dispatch[] = [];
  const used = new Set<string>();
  const target = 3; // 3 auto-dispatched flights per pilot per day
  let guard = 0;
  while (board.length < target && guard++ < 200 && pool.length) {
    const rt = pool[Math.floor(r() * pool.length)];
    if (used.has(rt.routeNumber)) continue;
    used.add(rt.routeNumber);
    const minutes = rt.minutes;
    const spotlight = spotlights.has(rt.routeNumber);
    const base = computeAp(minutes, { rankMultiplier: rankMult }).net;
    const max = computeAp(minutes, { punctual: true, spotlight, rankMultiplier: rankMult }).net;
    board.push({
      id: `${rt.routeNumber}-${dayIndex(d)}`,
      flightNo: firstFlightNo(rt),
      dep: rt.dep,
      arr: rt.arr,
      aircraft: rt.aircraft,
      minutes,
      category: categoryForMinutes(minutes),
      baseAp: base,
      spotlight,
      maxAp: max,
      dueInHours: 24 + Math.floor(r() * 48), // 24–72h window
      priority: spotlight || r() > 0.7 ? "priority" : "standard",
    });
  }
  // priority/spotlight first, then by reward
  return board.sort(
    (a, b) =>
      Number(b.spotlight) - Number(a.spotlight) ||
      (a.priority === "priority" ? -1 : 0) - (b.priority === "priority" ? -1 : 0) ||
      b.maxAp - a.maxAp,
  );
}

/* ---- Cargo (Logistics Command) — contract generation ---- */
export type CargoContract = {
  id: string;
  flightNo: string;
  dep: string;
  arr: string;
  aircraft: string;
  minutes: number;
  risk: CargoRisk;
  riskLabel: string;
  lc: number;
  cert: string;
};

const CARGO_TYPES = ["E190-F", "A321-F", "B777-F", "B747-8F"];

export function getCargoContracts(pilotId: number, cargoHours = 0, d = new Date()): CargoContract[] {
  const r = rng((pilotId + 7) * 40503 + dayIndex(d));
  const cert = cargoCertForHours(cargoHours).name;
  const pool = allRoutes().filter((rt) => rt.minutes >= 90); // freight = meaningful sectors
  const risks: CargoRisk[] = ["low", "low", "medium", "medium", "high"];
  const out: CargoContract[] = [];
  const used = new Set<string>();
  let guard = 0;
  while (out.length < 3 && guard++ < 200 && pool.length) {
    const rt = pool[Math.floor(r() * pool.length)];
    if (used.has(rt.routeNumber)) continue;
    used.add(rt.routeNumber);
    const risk = risks[Math.floor(r() * risks.length)];
    const ac = CARGO_TYPES[Math.min(CARGO_TYPES.length - 1, Math.floor((rt.minutes / 600) * CARGO_TYPES.length))];
    out.push({
      id: `C-${rt.routeNumber}-${dayIndex(d)}`,
      flightNo: "KU8" + firstFlightNo(rt).replace(/\D/g, "").padStart(3, "0").slice(-3),
      dep: rt.dep,
      arr: rt.arr,
      aircraft: ac,
      minutes: rt.minutes,
      risk,
      riskLabel: risk === "low" ? "Standard" : risk === "medium" ? "Perishable" : "Specialized",
      lc: computeLc(risk).net,
      cert,
    });
  }
  return out.sort((a, b) => b.lc - a.lc);
}
