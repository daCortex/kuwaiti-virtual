/* ----------------------------------------------------------------
   Kuwaiti Virtual — public marketing site content.
   Mirrors kuwaitivirtual.my.canva.site (the airline's own site).
------------------------------------------------------------------- */

export const SITE = {
  network: { airports: 40, routes: 70, hub: "OKBK" },
  fleetCount: 6,
  longestRangeNm: 8150,
  longestSector: "13h 05m",
  avgSector: "4h 10m",
  mission:
    "A Middle-Eastern Infinite Flight virtual airline nestled in the hot Middle East of breathtaking mountains and deserts. Join a community of pilots committed to professionalism, realism and true Arabian hospitality.",
  copyright: "© 2026 Kuwaiti Virtual. All rights reserved. Not affiliated with the real-world Kuwait Airways.",
  madeBy: "Built with pride by the Kuwaiti Virtual team.",
} as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/fleet", label: "Fleet" },
  { href: "/hubs", label: "Hubs" },
  { href: "/routes", label: "Routes" },
  { href: "/career", label: "Career" },
  { href: "/ranks", label: "Ranks" },
  { href: "/modes", label: "Modes" },
  { href: "/plus", label: "BlueBird" },
] as const;

export type SiteAircraft = {
  type: string;
  pax: number;
  cruiseAlt: string;
  cruiseSpeed: string;
  rangeNm: number;
  reg: string;
  engines: string;
  acquired: number;
  role: string;
  routesFlown: number;
  family: "Regional" | "Narrowbody" | "Widebody";
};

export const SITE_FLEET: SiteAircraft[] = [
  { type: "Airbus A320neo", pax: 174, cruiseAlt: "36,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 3400, reg: "9K-AKD", engines: "2 × CFM LEAP-1A", acquired: 2019, role: "Short-haul workhorse across the Middle East — the first aircraft every new pilot flies", routesFlown: 30, family: "Narrowbody" },
  { type: "Airbus A321neo", pax: 198, cruiseAlt: "36,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 4000, reg: "9K-AKM", engines: "2 × CFM LEAP-1A", acquired: 2020, role: "High-capacity narrowbody for the busiest Gulf and regional trunk routes", routesFlown: 24, family: "Narrowbody" },
  { type: "Airbus A330-300", pax: 290, cruiseAlt: "39,000 ft", cruiseSpeed: "Mach 0.82", rangeNm: 5800, reg: "9K-APE", engines: "2 × Rolls-Royce Trent 772B", acquired: 2014, role: "Regional widebody for high-demand medium-haul routes", routesFlown: 12, family: "Widebody" },
  { type: "Airbus A330-800neo", pax: 235, cruiseAlt: "41,000 ft", cruiseSpeed: "Mach 0.82", rangeNm: 8150, reg: "9K-CAA", engines: "2 × Rolls-Royce Trent 7000", acquired: 2022, role: "Ultra-efficient neo for thinner long-haul and high-yield routes", routesFlown: 8, family: "Widebody" },
  { type: "Airbus A330-900neo", pax: 260, cruiseAlt: "40,000 ft", cruiseSpeed: "Mach 0.82", rangeNm: 7200, reg: "9K-APA", engines: "2 × Rolls-Royce Trent 7000", acquired: 2021, role: "Next-generation widebody for our Asia and Africa long-haul network", routesFlown: 10, family: "Widebody" },
  { type: "Boeing 777-300ER", pax: 348, cruiseAlt: "35,000 ft", cruiseSpeed: "Mach 0.84", rangeNm: 7370, reg: "9K-AOC", engines: "2 × GE90-115B", acquired: 2016, role: "Long-haul flagship to Europe and North America", routesFlown: 14, family: "Widebody" },
];

export type SiteHub = {
  name: string;
  icao: string;
  iata: string;
  city: string;
  country: string;
  role: "Main Hub" | "Cargo Ops";
  coords: string;
  careerCount?: number;
  blurb: string;
};

export const SITE_HUBS: SiteHub[] = [
  { name: "Kuwait International", icao: "OKBK", iata: "KWI", city: "Kuwait City", country: "Kuwait", role: "Main Hub", coords: "29.2266° N · 47.9689° E", careerCount: 70, blurb: "Primary operating base at Terminal 4. Every long-haul rotation and most regional rotations originate or terminate here — the gateway between the Gulf, Asia, Africa and the West." },
  { name: "Dubai International", icao: "OMDB", iata: "DXB", city: "Dubai", country: "United Arab Emirates", role: "Cargo Ops", coords: "25.2532° N · 55.3657° E", blurb: "Gulf cargo gateway and high-frequency focus city — freighter turnarounds and belly-cargo feeders." },
  { name: "King Abdulaziz Int'l", icao: "OEJN", iata: "JED", city: "Jeddah", country: "Saudi Arabia", role: "Cargo Ops", coords: "21.6796° N · 39.1565° E", blurb: "Regional cargo interchange for high-value freight across the Arabian peninsula." },
];

export const SITE_MODES = [
  {
    name: "Casual Mode",
    unlock: "Cadet · 0h",
    tagline: "Fly the line at your own pace",
    desc: "The default experience for new pilots. File any unlocked route, log the PIREP, and earn BlueBird Miles without rigid scheduling.",
    bestFor: "Pilots who fly when they can and want progression without pressure",
    pros: ["No schedule windows", "Any unlocked aircraft / route", "Counts toward rank progression"],
    multiplier: "1.0×",
    scope: "Any unlocked",
  },
  {
    name: "Career Mode",
    unlock: "Captain · 115h",
    tagline: "A structured, simulated career",
    desc: "Bid for monthly rotations, follow a fixed roster, and operate under realistic airline constraints — fatigue, rest and reserve duty all apply.",
    bestFor: "Pilots who want a real-world airline rhythm and faster progression",
    pros: ["Higher Miles earn rate", "Counts double toward rank", "Eligible for command upgrade pathway"],
    multiplier: "1.25×",
    scope: "Rostered",
  },
  {
    name: "Cargo Mode",
    unlock: "Senior Captain · 225h · application",
    tagline: "Freight, ferry and charter ops",
    desc: "Operate dedicated cargo routes on the A330 and 777 plus freighter ferry legs. Cargo ops run alongside Casual or Career mode, not as a replacement.",
    bestFor: "Senior pilots who want long, technical sectors and unusual routings",
    pros: ["Exclusive long-haul cargo network", "Bonus Miles on tech-stop / ferry legs", "Higher the risk, higher the reward!"],
    multiplier: "Bonus",
    scope: "Freight network",
  },
] as const;

export const PLUS_EARN = [
  { label: "Short-haul", note: "under 2 hours", ap: 300 },
  { label: "Medium-haul", note: "2–6 hours", ap: 1240 },
  { label: "Long-haul", note: "over 6 hours", ap: 3700 },
] as const;

/* About — leadership & org */
export const SITE_LEADERS = [
  {
    role: "Founder & Chief Executive Officer",
    name: "Abif12",
    title: "When we started this journey",
    message:
      "I am dedicated to promoting an environment of growth with professionalism and realism. We offer a wide range of routes and training opportunities. Our network spans from the hot Middle East to Africa, innovative Asia and bustling North America. Our dedicated staff and pilots are here to support you every step of the way, ensuring your experience with us is enjoyable and rewarding.",
  },
] as const;

export const SITE_ORG = [
  { unit: "Executive", roles: [{ role: "CEO", who: "Abif12" }, { role: "COO", who: "Vacant" }] },
  { unit: "Operations", roles: [{ role: "Routes Manager", who: "Vacant" }, { role: "Event Manager", who: "Vacant" }] },
  { unit: "Marketing", roles: [{ role: "CMO", who: "Vacant" }] },
] as const;
