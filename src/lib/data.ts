/* ----------------------------------------------------------------
   Kuwaiti Virtual — shared content/data (single source of truth)
   An independent, fan-made Middle-Eastern virtual airline inspired by
   Kuwait Airways. Items marked TODO need real values (Discord invite,
   application form URLs).
------------------------------------------------------------------- */

export const BRAND = {
  name: "Kuwaiti Virtual",
  group: "Kuwaiti Virtual",
  tagline: "True Arabian Hospitality in the Virtual Skies",
  welcome: "Your Journey Across the Skies Starts Here.",
  intro:
    "Welcome to Kuwaiti Virtual — a Middle-Eastern virtual airline nestled in the hot Middle East of breathtaking mountains and deserts, with true Arabian hospitality. Our goal is to be as professional as possible in the virtual skies while having fun along the way.",
  disclaimer:
    "Kuwaiti Virtual is an independent virtual organisation for flight simulation. It is not affiliated with, endorsed by, or sponsored by the real-world airline Kuwait Airways, or by Infinite Flight.",
  // The Discord invite is shared privately with applicants once accepted —
  // it is intentionally NOT published anywhere on the public site.
} as const;

// External integrations (application forms / route database).
export const LINKS = {
  pilotApplication: "#", // TODO: pilot application form
  staffApplication: "#", // TODO: staff application form
  routeDatabase: "#", // TODO: published route database
  credits: "#", // TODO: credits page
  // Application review (form editors / responses) — set when configured.
  pilotApplicationReview: "#",
  staffApplicationReview: "#",
  pilotResponsesSheetId: "",
  staffResponsesSheetId: "",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/staff", label: "Staff" },
  { href: "/ranks", label: "Ranks" },
  { href: "/operations", label: "Operations" },
  { href: "/news", label: "News" },
  { href: "/codeshares", label: "Codeshares" },
] as const;

export const STATS = [
  { value: 6, suffix: "", label: "Aircraft types", note: "modern Airbus & Boeing fleet" },
  { value: 70, suffix: "+", label: "Routes", note: "spanning five continents" },
  { value: 40, suffix: "+", label: "Destinations", note: "Middle East, Asia, Africa, Europe & North America" },
] as const;

export const PILLARS = [
  {
    title: "Professionalism",
    body: "We carry ourselves with discipline and pride in the virtual skies — realistic operations, clean procedures and a sharp standard from gate to gate.",
  },
  {
    title: "Realism",
    body: "Real routes, real aircraft and a structured career path. Every PIREP is reviewed and every hour counts toward your progression.",
  },
  {
    title: "Arabian Hospitality",
    body: "True Arabian warmth runs through everything we do — a welcoming community where new pilots are guided and every member is family.",
  },
  {
    title: "Fun Along the Way",
    body: "We take the flying seriously, but never ourselves. Events, group flights and friendly competition keep the hangar lively.",
  },
] as const;

export type Aircraft = {
  type: string;
  variant: string;
  reg: string;
  tagline: string;
  slogan: string;
  family: string;
  seats: number;
  range_nm: number;
  role: string;
  note?: string;
  engines: string; // e.g. "2 × GE90-115B"
  thrust: string; // e.g. "115,300 lbf each"
  mtow: string; // max take-off weight, e.g. "351 t"
  cruise: string; // typical cruise, e.g. "Mach 0.84"
  recommended: { route: string; flightNo: string }[]; // 1–2 signature routes
};

export const FLEET: Aircraft[] = [
  {
    type: "B777-300ER",
    variant: "Boeing 777-369ER",
    reg: "9K-AOC",
    tagline: "The Flagship",
    slogan: "The Long Arm of the Network",
    family: "Widebody",
    seats: 348,
    range_nm: 7370,
    role: "Long-haul flagship — our backbone to Europe and North America.",
    engines: "2 × GE90-115B",
    thrust: "115,300 lbf each",
    mtow: "351 t",
    cruise: "Mach 0.84 · FL350",
    recommended: [
      { route: "OKBK → KJFK", flightNo: "KU117" },
      { route: "OKBK → EGLL", flightNo: "KU101" },
    ],
  },
  {
    type: "A330-900",
    variant: "A330-941neo",
    reg: "9K-APA",
    tagline: "The Modern Workhorse",
    slogan: "Efficiency Across Continents",
    family: "Widebody",
    seats: 260,
    range_nm: 7200,
    role: "Next-generation widebody for our Asia and Africa long-haul network.",
    engines: "2 × Rolls-Royce Trent 7000",
    thrust: "72,000 lbf each",
    mtow: "251 t",
    cruise: "Mach 0.82 · FL400",
    recommended: [
      { route: "OKBK → VIDP", flightNo: "KU383" },
      { route: "OKBK → HECA", flightNo: "KU541" },
    ],
  },
  {
    type: "A330-800",
    variant: "A330-841neo",
    reg: "9K-CAA",
    tagline: "The Long Thin Specialist",
    slogan: "Range Without Compromise",
    family: "Widebody",
    seats: 235,
    range_nm: 8150,
    role: "Ultra-efficient neo for thinner long-haul and high-yield routes.",
    engines: "2 × Rolls-Royce Trent 7000",
    thrust: "72,000 lbf each",
    mtow: "251 t",
    cruise: "Mach 0.82 · FL410",
    recommended: [
      { route: "OKBK → WSSS", flightNo: "KU417" },
      { route: "OKBK → LFPG", flightNo: "KU175" },
    ],
  },
  {
    type: "A330-300",
    variant: "A330-343",
    reg: "9K-APE",
    tagline: "The Regional Widebody",
    slogan: "High Capacity, Proven Reliability",
    family: "Widebody",
    seats: 290,
    range_nm: 5800,
    role: "Workhorse widebody for high-demand regional and medium-haul routes.",
    engines: "2 × Rolls-Royce Trent 772B",
    thrust: "71,100 lbf each",
    mtow: "233 t",
    cruise: "Mach 0.82 · FL390",
    recommended: [
      { route: "OKBK → OERK", flightNo: "KU611" },
      { route: "OKBK → VABB", flightNo: "KU301" },
    ],
  },
  {
    type: "A321neo",
    variant: "A321-251NX",
    reg: "9K-AKM",
    tagline: "The Continental Connector",
    slogan: "Precision on Every Sector",
    family: "Narrowbody",
    seats: 198,
    range_nm: 4000,
    role: "High-capacity narrowbody for the busiest Gulf and regional trunk routes.",
    engines: "2 × CFM LEAP-1A",
    thrust: "32,160 lbf each",
    mtow: "97 t",
    cruise: "Mach 0.78 · FL360",
    recommended: [
      { route: "OKBK → OEJN", flightNo: "KU643" },
      { route: "OKBK → OTHH", flightNo: "KU671" },
    ],
  },
  {
    type: "A320neo",
    variant: "A320-251N",
    reg: "9K-AKD",
    tagline: "The All-Rounder",
    slogan: "Where Every Career Begins",
    family: "Narrowbody",
    seats: 174,
    range_nm: 3400,
    role: "Short-haul workhorse linking Kuwait across the Middle East — the first aircraft every new pilot flies.",
    engines: "2 × CFM LEAP-1A",
    thrust: "27,120 lbf each",
    mtow: "79 t",
    cruise: "Mach 0.78 · FL360",
    recommended: [
      { route: "OKBK → OMDB", flightNo: "KU671" },
      { route: "OKBK → OBBI", flightNo: "KU205" },
    ],
  },
];

/* Engine/thrust specs for codeshare aircraft, looked up by model keyword.
   Keeps the codeshare detail view informative without a full per-type table. */
export const AIRCRAFT_SPECS: { match: string; engines: string; thrust: string }[] = [
  { match: "A350", engines: "2 × Rolls-Royce Trent XWB", thrust: "~84,000 lbf" },
  { match: "A330", engines: "2 × Trent 700 / Trent 7000 / GE CF6", thrust: "~72,000 lbf" },
  { match: "A321", engines: "2 × CFM LEAP-1A / PW1100G", thrust: "~32,000 lbf" },
  { match: "A320", engines: "2 × CFM56 / LEAP-1A", thrust: "~27,000 lbf" },
  { match: "A319", engines: "2 × CFM56 / IAE V2500", thrust: "~23,000 lbf" },
  { match: "A318", engines: "2 × CFM56 / PW6000", thrust: "~23,000 lbf" },
  { match: "A220", engines: "2 × Pratt & Whitney PW1500G", thrust: "~23,300 lbf" },
  { match: "A380", engines: "4 × Trent 900 / GP7200", thrust: "~70,000 lbf" },
  { match: "747", engines: "4 × GE CF6 / PW4000 / RB211", thrust: "~62,000 lbf" },
  { match: "777", engines: "2 × GE90 / PW4000 / Trent 800", thrust: "~110,000 lbf" },
  { match: "787", engines: "2 × GEnx / Trent 1000", thrust: "~74,000 lbf" },
  { match: "767", engines: "2 × GE CF6 / PW4000", thrust: "~60,000 lbf" },
  { match: "757", engines: "2 × RB211 / PW2000", thrust: "~40,000 lbf" },
  { match: "737", engines: "2 × CFM56 / LEAP-1B", thrust: "~27,000 lbf" },
  { match: "E19", engines: "2 × GE CF34", thrust: "~18,500 lbf" },
  { match: "E17", engines: "2 × GE CF34", thrust: "~14,200 lbf" },
  { match: "ATR", engines: "2 × Pratt & Whitney PW127", thrust: "Turboprop" },
];

export function specFor(model: string): { engines: string; thrust: string } | null {
  const m = model.toUpperCase();
  return AIRCRAFT_SPECS.find((s) => m.includes(s.match)) ?? null;
}

export type Hub = {
  city: string;
  iata: string;
  icao: string;
  primary?: boolean;
  region: string;
  /* normalized 0–100 coords on an equirectangular world map */
  x: number;
  y: number;
  blurb?: string;
  departuresPerDay?: number;
  destinations?: number;
  facts?: string[];
};

/* General Kuwaiti Virtual fun facts, mixed into each hub's fact pool. */
export const AIRLINE_FACTS: string[] = [
  "Kuwait International Airport (OKBK) is the home base of Kuwaiti Virtual, handling over 10 million passengers a year.",
  "Our network reaches from the hot Middle East to Africa, innovative Asia and bustling North America.",
  "Kuwaiti Virtual operates a modern fleet of Airbus and Boeing aircraft for true global reach.",
  "Every Kuwaiti Virtual flight wears the KU flight code and the callsign “KUWAITI”.",
  "Our flagship is the long-range Boeing 777-300ER, opening Europe and North America from Kuwait.",
  "Kuwaiti Virtual's colours are Classic Dark Blue and Deep Sea Blue, a nod to the Arabian Gulf.",
];

// Kuwaiti Virtual's hub & focus cities.
export const HUBS: Hub[] = [
  {
    city: "Kuwait International",
    iata: "KWI",
    icao: "OKBK",
    primary: true,
    region: "Kuwait · Middle East",
    x: 63.32,
    y: 33.76,
    blurb: "Our headquarters at Terminal 4 — the gateway between the Gulf, Asia, Africa and the West.",
    departuresPerDay: 90,
    destinations: 40,
    facts: [
      "Kuwait International (OKBK) is Kuwait's main airport and Kuwaiti Virtual's home base.",
      "We operate from Terminal 4, handling over 10 million passengers a year.",
      "OKBK sits about 15 km south of Kuwait City.",
      "It is the launch point for every long-haul rotation in our network.",
    ],
  },
  {
    city: "Dubai International",
    iata: "DXB",
    icao: "OMDB",
    region: "UAE · Gulf focus city",
    x: 65.39,
    y: 35.97,
    blurb: "Our busiest Gulf focus city and a key connection point across the network.",
    departuresPerDay: 14,
    destinations: 8,
    facts: [
      "Dubai International (OMDB) is one of the world's busiest international airports.",
      "It anchors our high-frequency Gulf shuttle from Kuwait.",
      "A major interchange for onward connections across Asia and Africa.",
    ],
  },
];

// The 7-rank career ladder (Cadet → BlueBird Commander) lives in lib/career.ts — the
// single source of truth for the Miles economy, licenses and tiers. Re-exported
// here so existing imports (rank.ts, Crew Center) keep working.
export { RANKS, type Rank } from "./career";
import { RANKS as RANK_LIST } from "./career";

// A manual trainee tag staff can assign below the entry rank (not hours-based).
export const ACRUX_RANK = {
  name: "Trainee",
  hours: 0,
  note: "In training — assigned manually by staff before first solo.",
  manual: true,
} as const;

// The full ladder as displayed (Trainee sits below the entry rank Cadet).
export const RANK_LADDER = [ACRUX_RANK, ...RANK_LIST];

// Every rank label staff can assign in the Crew Center (career ranks + Cadet).
export const RANK_NAMES: readonly string[] = [
  ...RANK_LIST.map((r) => r.name),
  ACRUX_RANK.name,
];

export type StaffMember = {
  role: string;
  name?: string;
  handle?: string;
  bio?: string;
  vacant?: boolean;
  note?: string;
};

export type StaffGroup = {
  group: string;
  members: StaffMember[];
};

export const STAFF_GROUPS: StaffGroup[] = [
  {
    group: "Executive",
    members: [
      {
        role: "Chief Executive Officer",
        name: "Abif12",
        handle: "@Abif12",
        bio: "Founder and CEO of Kuwaiti Virtual. I am dedicated to promoting an environment of growth with professionalism and realism. We offer a wide range of routes and training opportunities — our dedicated team is here to support you every step of the way.",
      },
      {
        role: "Chief Operating Officer",
        vacant: true,
        note: "Open position — apply via the staff application form.",
      },
    ],
  },
  {
    group: "Operations",
    members: [
      {
        role: "Routes Manager",
        vacant: true,
        note: "Open position — apply via the staff application form.",
      },
      {
        role: "Event Manager",
        vacant: true,
        note: "Open position — apply via the staff application form.",
      },
    ],
  },
  {
    group: "Marketing",
    members: [
      {
        role: "Chief Marketing Officer",
        vacant: true,
        note: "Open position — apply via the staff application form.",
      },
    ],
  },
];

export type Partner = {
  name: string;
  kind: string;
};

export const PARTNERS: Partner[] = [
  { name: "Qatari Virtual", kind: "Qatar" },
  { name: "Emirates Virtual", kind: "United Arab Emirates" },
  { name: "Saudia Virtual", kind: "Saudi Arabia" },
  { name: "Oman Air Virtual", kind: "Oman" },
  { name: "Royal Jordanian Virtual", kind: "Jordan" },
  { name: "EgyptAir Virtual", kind: "Egypt" },
  { name: "Turkish Virtual", kind: "Türkiye" },
  { name: "British Airways Virtual", kind: "United Kingdom" },
  { name: "Japan Airlines Virtual", kind: "Japan" },
  { name: "American Virtual", kind: "United States" },
];

export type Requirement = string;

export const APPLY = {
  pilot: {
    title: "Pilot Application",
    minAge: 13,
    requirements: [
      "Infinite Flight Pro subscription",
      "At least Grade 3",
      "Active IFC account in good standing",
      "Discord access",
      "At least 13 years old",
      "Not on the IFVARB Blacklist or Watchlist",
      "File at least one PIREP every 2 weeks",
      "Constant Discord usage",
    ] as Requirement[],
  },
  staff: {
    title: "Staff Application",
    minAge: 16,
    requirements: [
      "Infinite Flight Pro subscription",
      "At least Grade 3",
      "Active IFC account in good standing",
      "Discord access",
      "At least 16 years old",
      "Not on the IFVARB Blacklist or Watchlist",
      "Able to work on a weekly basis",
      "Constant Discord usage",
    ] as Requirement[],
  },
} as const;

/* ---- PIREP multipliers ----
   A multiplier code multiplies the pilot's raw flight time when filing.
   Add/adjust codes here (e.g. for events). */
export type Multiplier = { code: string; value: number; label: string };

export const MULTIPLIERS: Multiplier[] = [
  // Ordered by value.
  { code: "GROUPFLIGHT", value: 1.3, label: "Group Flight — 1.3×" },
  { code: "ROTW", value: 1.5, label: "Route of the Week — 1.5×" },
  { code: "IF48", value: 1.5, label: "IF48 — 1.5×" },
  { code: "BLUEBIRDLITE", value: 2, label: "BlueBird Lite — 2.0×" },
  { code: "GTR1ST", value: 2, label: "GTR 1st Place — 2×" },
  { code: "POTM3RD", value: 2.5, label: "POTM 3rd — 2.5×" },
  { code: "BLUEBIRDSILVER", value: 2.5, label: "BlueBird Silver — 2.5×" },
  { code: "BLUEBIRDGOLD", value: 3, label: "BlueBird Gold — 3.0×" },
  { code: "POTM2ND", value: 3, label: "POTM 2nd — 3×" },
  { code: "NEWYEAR2026", value: 3, label: "NEW YEAR 2026 — 3×" },
  { code: "POTM1ST", value: 4, label: "POTM 1st — 4×" },
  { code: "MEGAEVENT", value: 5, label: "Mega Event — 5×" },
  { code: "EVENT", value: 5, label: "Event — 5×" },
];

/* Resolve a code to its multiplier value (1 if blank/unknown). */
export function multiplierFor(code: string | null | undefined): number {
  if (!code) return 1;
  const m = MULTIPLIERS.find(
    (x) => x.code.toUpperCase() === code.trim().toUpperCase(),
  );
  return m ? m.value : 1;
}
