/* ----------------------------------------------------------------
   Kuwaiti Virtual — career economy
   The single source of truth for the rank ladder, pilot licenses,
   BlueBird Miles, the BlueBird Rewards tiers, the Cargo (Logistics
   Command) track, and auto-dispatch generation.

   Mirrors the Kuwaiti Virtual Operations Handbook ("Arabian Excellence").
------------------------------------------------------------------- */

/* ======================= RANK LADDER ======================= */

export type Rank = {
  n: number; // ladder position 1..9
  name: string;
  hours: number; // hour threshold to reach it
  blurb: string;
  group: "core" | "exclusive";
  apMultiplier?: number; // rank-based Miles bonus (BlueBird ranks)
  callsignRange?: string; // unlocked custom callsign range
  perks?: string[]; // aircraft unlocked at this rank (no region locks)
  // legacy/manual fields kept for the staff Crew Center
  note?: string;
  manual?: boolean;
  symbol?: string;
};

export const RANKS: Rank[] = [
  { n: 1, name: "Cadet", hours: 0, group: "core", blurb: "Welcome aboard. Your career begins here.", perks: ["A320 Family", "737 Family", "A220-300"] },
  { n: 2, name: "Junior Co-Pilot", hours: 15, group: "core", blurb: "Stepping up to widebody operations.", perks: ["A330 Family", "787 Family"] },
  { n: 3, name: "Senior Co-Pilot", hours: 65, group: "core", blurb: "Long-haul widebody command experience.", perks: ["777 Family", "A350 Family"] },
  { n: 4, name: "Captain", hours: 115, group: "core", blurb: "In command of the heavies — the full fleet opens up.", perks: ["747 Family", "A380", "DC-10"] },
  { n: 5, name: "Senior Captain", hours: 225, group: "core", blurb: "A seasoned commander with the whole fleet at your hands.", perks: ["Full fleet unlocked"] },
  // ---- Exclusive BlueBird ranks ----
  { n: 6, name: "BlueBird Captain", hours: 550, group: "exclusive", apMultiplier: 1.2, blurb: "An elite aviator. Special Operations clearance granted.", perks: ["Special Ops access", "BlueBird Captain badge"] },
  { n: 7, name: "BlueBird Senior Captain", hours: 1000, group: "exclusive", apMultiplier: 1.3, blurb: "A pillar of the airline.", perks: ["Alliance Discover", "BlueBird Senior Captain badge"] },
  { n: 8, name: "BlueBird Fleet Captain", hours: 2000, group: "exclusive", apMultiplier: 1.4, blurb: "Among our most decorated aviators.", perks: ["BlueBird Fleet Captain badge"] },
  { n: 9, name: "BlueBird Commander", hours: 3000, group: "exclusive", apMultiplier: 1.5, blurb: "A living legend of Kuwaiti Virtual.", perks: ["BlueBird Commander badge"] },
];

export type RankProgress = {
  current: Rank;
  next: Rank | null;
  pct: number; // 0–100 toward next
  totalHours: number;
  hoursToNext: number | null;
};

export function rankForHours(totalHours: number): RankProgress {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (totalHours >= RANKS[i].hours) idx = i;
  const current = RANKS[idx];
  const next = RANKS[idx + 1] ?? null;
  if (!next) return { current, next: null, pct: 100, totalHours, hoursToNext: null };
  const span = next.hours - current.hours;
  const into = totalHours - current.hours;
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return { current, next, pct, totalHours, hoursToNext: Math.max(0, next.hours - totalHours) };
}

export function rankByName(name: string): Rank | null {
  return RANKS.find((r) => r.name.toLowerCase() === name.toLowerCase()) ?? null;
}

/* True if a pilot's hours meet or exceed a named rank (for feature-gating). */
export function hasRankAtLeast(totalHours: number, rankName: string): boolean {
  const r = rankByName(rankName);
  return !!r && totalHours >= r.hours;
}

/* ======================= PILOT LICENSES ======================= */

export type License = {
  name: string; // "Private Pilot License"
  short: string; // "PPL"
  hours: number;
  fleet: string[];
};

export const LICENSES: License[] = [
  { name: "Private Pilot License", short: "PPL", hours: 0, fleet: ["A320 Family", "737 Family", "A220-300"] },
  { name: "Commercial Pilot License", short: "CPL", hours: 15, fleet: ["A330 Family", "787 Family"] },
  { name: "Command License", short: "Command", hours: 65, fleet: ["777 Family", "A350 Family"] },
  { name: "Captain", short: "Captain", hours: 115, fleet: ["747 Family", "A380", "DC-10"] },
];

export function licenseForHours(totalHours: number): {
  current: License;
  next: License | null;
  pct: number;
  hoursToNext: number | null;
} {
  let idx = 0;
  for (let i = 0; i < LICENSES.length; i++) if (totalHours >= LICENSES[i].hours) idx = i;
  const current = LICENSES[idx];
  const next = LICENSES[idx + 1] ?? null;
  if (!next) return { current, next: null, pct: 100, hoursToNext: null };
  const span = next.hours - current.hours;
  const into = totalHours - current.hours;
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return { current, next, pct, hoursToNext: Math.max(0, next.hours - totalHours) };
}

/* All fleet a pilot is authorised to fly at their hours. */
export function authorizedFleet(totalHours: number): string[] {
  return LICENSES.filter((l) => totalHours >= l.hours).flatMap((l) => l.fleet);
}

/* ======================= AURORA POINTS (AP) ======================= */

export type FlightCategory = "regional" | "continental" | "longhaul";

export const AP_TABLE: Record<
  FlightCategory,
  { label: string; maxHours: number | null; gross: number; overhead: number; net: number }
> = {
  regional: { label: "Regional (<2h)", maxHours: 2, gross: 350, overhead: 50, net: 300 },
  continental: { label: "Continental (2–6h)", maxHours: 6, gross: 1440, overhead: 200, net: 1240 },
  longhaul: { label: "Long-Haul (>6h)", maxHours: null, gross: 4200, overhead: 500, net: 3700 },
};

export const PUNCTUALITY_MULTIPLIER = 1.25;
export const SPOTLIGHT_MULTIPLIER = 2;

export function categoryForMinutes(minutes: number): FlightCategory {
  const h = minutes / 60;
  if (h < 2) return "regional";
  if (h <= 6) return "continental";
  return "longhaul";
}

export type ApBreakdown = {
  category: FlightCategory;
  gross: number;
  overhead: number;
  base: number;
  punctual: boolean;
  spotlight: boolean;
  rankMultiplier: number;
  multiplier: number; // combined applied multiplier
  net: number; // final AP awarded
};

/* Compute AP for a flight. Multipliers stack: punctuality (1.25×), spotlight
   (2×) and the pilot's rank multiplier (BlueBird Commander 1.2× / BlueBird Commander 1.5×). */
export function computeAp(
  minutes: number,
  opts: { punctual?: boolean; spotlight?: boolean; rankMultiplier?: number } = {},
): ApBreakdown {
  const category = categoryForMinutes(minutes);
  const row = AP_TABLE[category];
  const punctual = !!opts.punctual;
  const spotlight = !!opts.spotlight;
  const rankMultiplier = opts.rankMultiplier ?? 1;
  const multiplier =
    (punctual ? PUNCTUALITY_MULTIPLIER : 1) *
    (spotlight ? SPOTLIGHT_MULTIPLIER : 1) *
    rankMultiplier;
  const net = Math.round(row.net * multiplier);
  return {
    category,
    gross: row.gross,
    overhead: row.overhead,
    base: row.net,
    punctual,
    spotlight,
    rankMultiplier,
    multiplier,
    net,
  };
}

/* Estimate a pilot's lifetime AP balance from their logged hours (demo model:
   historical hours are valued at the ~per-hour blend of the AP table). */
export const AP_PER_HOUR_ESTIMATE = 300;
export function estimateApFromHours(totalHours: number): number {
  return Math.round(totalHours * AP_PER_HOUR_ESTIMATE);
}

/* ======================= BLUEBIRD REWARDS TIERS ======================= */

export type Tier = {
  name: string;
  min: number; // Miles threshold (for the dashboard badge)
  accent: string; // hex for the tier badge
  blurb: string;
  hoursReq?: number; // flight hours required (BlueBird Rewards)
  eventsReq?: number; // events attended required
  multiplier?: number; // event Miles multiplier at this tier
};

/* BlueBird Rewards — mirrors the original site's programme:
   Lite 1000h / 5 events / 2.0× · Silver 2500h / 15 events / 2.5× ·
   Gold 3500h / 20 events / 3.0×. `min` (Miles ≈ hours × 300) drives the
   dashboard badge so the loyalty badge tracks the same progression. */
export const TIERS: Tier[] = [
  { name: "Member", min: 0, accent: "#AFAFAF", blurb: "Every journey starts here." },
  { name: "BlueBird Lite", min: 300000, accent: "#24638E", blurb: "A recognised regular of the network.", hoursReq: 1000, eventsReq: 5, multiplier: 2.0 },
  { name: "BlueBird Silver", min: 750000, accent: "#1C285B", blurb: "A pillar of Kuwaiti Virtual.", hoursReq: 2500, eventsReq: 15, multiplier: 2.5 },
  { name: "BlueBird Gold", min: 1050000, accent: "#C9A24B", blurb: "Among our most decorated aviators.", hoursReq: 3500, eventsReq: 20, multiplier: 3.0 },
];

export function tierForAp(ap: number): { current: Tier; next: Tier | null; pct: number; apToNext: number | null } {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) if (ap >= TIERS[i].min) idx = i;
  const current = TIERS[idx];
  const next = TIERS[idx + 1] ?? null;
  if (!next) return { current, next: null, pct: 100, apToNext: null };
  const span = next.min - current.min;
  const into = ap - current.min;
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return { current, next, pct, apToNext: Math.max(0, next.min - ap) };
}

/* ======================= CARGO — LOGISTICS COMMAND ======================= */

export type CargoCert = { name: string; hours: number; fleet: string[] };

export const CARGO_CERTS: CargoCert[] = [
  { name: "Handler", hours: 0, fleet: ["E190-F"] },
  { name: "Loadmaster", hours: 250, fleet: ["A321-F"] },
  { name: "Freight Architect", hours: 750, fleet: ["B777-F", "B747-8F"] },
];

export type CargoRisk = "low" | "medium" | "high";

export const CARGO_TABLE: Record<
  CargoRisk,
  { label: string; net: number; adjustment: number; incentive: number }
> = {
  low: { label: "Low · Standard", net: 1400, adjustment: 0, incentive: 1.0 },
  medium: { label: "Medium · Perishable", net: 3000, adjustment: -0.1, incentive: 1.25 },
  high: { label: "High · Specialized", net: 5500, adjustment: -0.2, incentive: 1.3 },
};

export function cargoCertForHours(cargoHours: number): CargoCert {
  let c = CARGO_CERTS[0];
  for (const cert of CARGO_CERTS) if (cargoHours >= cert.hours) c = cert;
  return c;
}

/* Logistics Credits for a cargo contract, with variance + incentive applied. */
export function computeLc(risk: CargoRisk, performance = true): { base: number; adjusted: number; net: number } {
  const row = CARGO_TABLE[risk];
  const adjusted = Math.round(row.net * (1 + row.adjustment));
  const net = Math.round(adjusted * (performance ? row.incentive : 1));
  return { base: row.net, adjusted, net };
}

/* ======================= GATES ======================= */

export const GATES = {
  careerMode: "Captain", // 115h+
  cargoMode: "Senior Captain", // 225h+
  specialOps: "BlueBird Captain", // 550h+
  blueBird: "BlueBird Senior Captain", // 1000h+
} as const;
