/* ----------------------------------------------------------------
   Kuwaiti Virtual — staff-managed fleet & ops.
   Aircraft (fileable types) and PIREP multipliers added by staff in the
   Crew Center. Persisted in the database when one is connected; otherwise
   held in-memory for the session (mirrors the route store in ops.ts).
------------------------------------------------------------------- */

import {
  dbConfigured,
  listAircraftDb,
  addAircraftDb,
  removeAircraftDb,
  listMultipliersDb,
  addMultiplierDb,
  removeMultiplierDb,
  type DbMultiplier,
} from "./db";

export type Mult = DbMultiplier;

const g = globalThis as unknown as { __kuvaFleet?: { aircraft: string[]; multipliers: Mult[] } };
const store = (g.__kuvaFleet ??= { aircraft: [], multipliers: [] });

/* Refresh the in-memory cache from the database. Call at the start of any
   async page/handler that reads staff aircraft or multipliers. */
export async function refreshFleetOps(): Promise<void> {
  if (!dbConfigured) return;
  try {
    const [ac, mu] = await Promise.all([listAircraftDb(), listMultipliersDb()]);
    store.aircraft = ac;
    store.multipliers = mu;
  } catch {
    /* keep cache on read failure */
  }
}

export function getStaffAircraft(): string[] {
  return [...store.aircraft];
}
export function getStaffMultipliers(): Mult[] {
  return [...store.multipliers];
}

/* ---- Aircraft ---- */
export async function addAircraft(name: string): Promise<{ ok: boolean; error?: string }> {
  const n = name.trim();
  if (n.length < 2) return { ok: false, error: "Enter an aircraft name." };
  await refreshFleetOps();
  if (store.aircraft.some((a) => a.toLowerCase() === n.toLowerCase())) {
    return { ok: false, error: "That aircraft already exists." };
  }
  if (dbConfigured) await addAircraftDb(n);
  store.aircraft.push(n);
  return { ok: true };
}
export async function removeAircraft(name: string): Promise<boolean> {
  let removed = false;
  if (dbConfigured) removed = await removeAircraftDb(name);
  const before = store.aircraft.length;
  store.aircraft = store.aircraft.filter((a) => a !== name);
  return removed || store.aircraft.length < before;
}

/* ---- Multipliers ---- */
export async function addMultiplier(input: { code: string; value: number; label: string }): Promise<{ ok: boolean; error?: string }> {
  const code = input.code.trim().toUpperCase();
  const value = Number(input.value);
  const label = input.label.trim() || `${code} — ${value}×`;
  if (!code) return { ok: false, error: "Enter a multiplier code." };
  if (!Number.isFinite(value) || value <= 0) return { ok: false, error: "Multiplier value must be greater than zero." };
  await refreshFleetOps();
  if (store.multipliers.some((m) => m.code === code)) return { ok: false, error: "That code already exists." };
  const m: Mult = { code, value, label };
  if (dbConfigured) await addMultiplierDb(m);
  store.multipliers.push(m);
  return { ok: true };
}
export async function removeMultiplier(code: string): Promise<boolean> {
  let removed = false;
  if (dbConfigured) removed = await removeMultiplierDb(code);
  const before = store.multipliers.length;
  store.multipliers = store.multipliers.filter((m) => m.code !== code);
  return removed || store.multipliers.length < before;
}
