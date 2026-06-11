/* Kuwaiti Virtual — roster seed.
   The airline is launching fresh: there are NO placeholder pilots. The only
   seeded account is the CEO. New pilots populate the roster as they are
   accepted through the application process. */
import type { Pilot, Pirep } from "./db";

/* No demo flights — the logbook starts empty. */
export const SEED_PIREPS: Pirep[] = [];

/* The founding account: the CEO. Everyone else joins via applications. */
export const SEED_PILOTS: Pilot[] = [
  {
    id: 1,
    discordId: "ceo:Abif12",
    callsign: "Kuwaiti 001",
    displayName: "Abif12",
    avatar: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    status: "active",
    ifUsername: "Abif12",
    ifUserId: null,
    acceptedAt: "2026-01-01T00:00:00.000Z",
    notes: "Founder & Chief Executive Officer.",
    rankLabel: "Sovereign",
    linked: false,
    baseMinutes: 0,
    basePireps: 0,
    isStaff: true,
  },
];
