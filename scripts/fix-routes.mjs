/* ----------------------------------------------------------------
   Regenerate src/lib/routes.ts from data/routes.csv.

   The airline (and the aircraft brand) is derived from the flight-number
   prefix — the authoritative operator — NOT the CSV's aircraft text, which
   was unreliable (e.g. SQ flights were labelled "American Airlines …").

   Run:  node scripts/fix-routes.mjs
------------------------------------------------------------------- */
import fs from "node:fs";

const lines = fs.readFileSync("data/routes.csv", "utf8").split(/\r?\n/).filter(Boolean);
lines.shift(); // header

function parseCsv(line) {
  const out = [];
  let cur = "",
    q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

// Flight-number prefix → airline. Unknown prefixes (incl. the old "SP"
// placeholder) are dropped — those aren't real operators.
const PREFIX = {
  JX: "Starlux", JXXX: "Starlux",
  // Olympic Air is part of the Aegean group → both map to Aegean.
  A: "Aegean", OA: "Aegean", AA: "American", BW: "Caribbean",
  EY: "Etihad", FJ: "Fiji", KE: "Korean", LAN: "LATAM", LA: "LATAM",
  WY: "Oman", QR: "Qatar", SQ: "Singapore", JBU: "JetBlue", B6: "JetBlue",
};
const BRAND = {
  Starlux: "Starlux Airlines", Aegean: "Aegean Airlines",
  American: "American Airlines", Caribbean: "Caribbean Airlines", Etihad: "Etihad Airways",
  Fiji: "Fiji Airways", Korean: "Korean Air", LATAM: "LATAM", Oman: "Oman Air",
  Qatar: "Qatar Airways", Singapore: "Singapore Airlines", JetBlue: "JetBlue",
};

const airlineFor = (rn) => {
  const m = (rn || "").match(/^[A-Za-z]+/);
  return (m && PREFIX[m[0].toUpperCase()]) || null; // null → dropped
};
const modelOf = (ac) => {
  const m = (ac || "").match(/(Airbus|Boeing|Embraer|Bombardier|ATR|Cessna|McDonnell)[^,]*/);
  if (m) return m[0].trim();
  return (ac || "").replace(/^Generic\s*/i, "").trim() || "Unknown";
};

const routes = lines
  .map(parseCsv)
  .map((r) => {
    const airline = airlineFor(r[0]);
    if (!airline) return null; // unknown / SP placeholder → drop
    return {
      routeNumber: r[0],
      dep: r[1],
      arr: r[2],
      aircraft: `${BRAND[airline]} ${modelOf(r[3])}`.trim(),
      minutes: Number(r[6]) || 0,
      airline,
    };
  })
  .filter(Boolean);

const airlines = [...new Set(routes.map((r) => r.airline))].sort((a, b) =>
  a === "Starlux" ? -1 : b === "Starlux" ? 1 : a.localeCompare(b),
);

fs.writeFileSync(
  "src/lib/routes.ts",
  `/* AUTO-GENERATED from data/routes.csv — Starlux Virtual route network.
   Airline + aircraft brand derived from the flight-number prefix (authoritative),
   not the CSV aircraft text. Regenerate via scripts/fix-routes.mjs. */

export type Route = {
  routeNumber: string;
  dep: string;
  arr: string;
  aircraft: string;
  minutes: number;
  airline: string;
};

export const ROUTES: Route[] = ${JSON.stringify(routes, null, 2)};

export const ROUTE_AIRLINES = ${JSON.stringify(airlines)} as const;
`,
);
console.log(`Regenerated ${routes.length} routes across ${airlines.length} airlines.`);
