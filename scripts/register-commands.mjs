/* ----------------------------------------------------------------
   Registers Starlux Virtual's Discord slash commands.

   Run ONCE (and again whenever commands change) from the project root:

     DISCORD_APP_ID=...        \
     DISCORD_BOT_TOKEN=...      \
     DISCORD_GUILD_ID=...       \
     node scripts/register-commands.mjs

   Guild commands register instantly. Omit DISCORD_GUILD_ID to register
   them globally instead (can take up to ~1 hour to appear).
------------------------------------------------------------------- */

const APP_ID = process.env.DISCORD_APP_ID;
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!APP_ID || !TOKEN) {
  console.error("Missing DISCORD_APP_ID or DISCORD_BOT_TOKEN env vars.");
  process.exit(1);
}

// Option types: 3 = STRING, 4 = INTEGER, 6 = USER
const commands = [
  {
    name: "register",
    description: "Register yourself as a Starlux Virtual pilot",
    options: [
      {
        name: "callsign",
        description: "Your Starlux callsign, e.g. Starwalker 042JX",
        type: 3,
        required: true,
      },
      {
        name: "ifc",
        description: "Your Infinite Flight Community username",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "pirep",
    description: "File a pilot report for a completed flight",
    options: [
      { name: "flight", description: "Flight number, e.g. SJX001", type: 3, required: true },
      { name: "from", description: "Departure ICAO, e.g. RCTP", type: 3, required: true },
      { name: "to", description: "Arrival ICAO, e.g. KLAX", type: 3, required: true },
      {
        name: "aircraft",
        description: "Aircraft type",
        type: 3,
        required: true,
        // Starlux fleet + codeshare-partner aircraft (kept in sync with
        // src/lib/aircraft.ts → VALID_AIRCRAFT). Discord allows max 25 choices.
        choices: [
          { name: "A350-900 (Starlux)", value: "A350-900" },
          { name: "A330-900neo (Starlux)", value: "A330-900neo" },
          { name: "A321neo (Starlux)", value: "A321neo" },
          { name: "Codeshare · Airbus A319", value: "Airbus A319" },
          { name: "Codeshare · Airbus A320", value: "Airbus A320" },
          { name: "Codeshare · Airbus A321", value: "Airbus A321" },
          { name: "Codeshare · Airbus A350", value: "Airbus A350" },
          { name: "Codeshare · Boeing 737-800", value: "Boeing 737-800" },
          { name: "Codeshare · Boeing 737-8 MAX", value: "Boeing 737-8 MAX" },
          { name: "Codeshare · Boeing 747-200", value: "Boeing 747-200" },
          { name: "Codeshare · Boeing 777-200ER", value: "Boeing 777-200ER" },
          { name: "Codeshare · Boeing 777-300ER", value: "Boeing 777-300ER" },
          { name: "Codeshare · Boeing 787-8", value: "Boeing 787-8" },
          { name: "Codeshare · Bombardier Dash 8-Q400", value: "Bombardier Dash 8-Q400" },
        ],
      },
      { name: "hours", description: "Flight time — hours", type: 4, required: true, min_value: 0, max_value: 20 },
      { name: "minutes", description: "Flight time — minutes", type: 4, required: false, min_value: 0, max_value: 59 },
      {
        name: "multiplier",
        description: "Event multiplier code (optional)",
        type: 3,
        required: false,
        choices: [
          { name: "Haedus Program — 1.3x", value: "HAEDUS" },
          { name: "ROTW — 1.5x", value: "ROTW" },
          { name: "IF48 — 1.5x", value: "IF48" },
          { name: "ILLYRIAN Program — 1.6x", value: "ILLYRIAN" },
          { name: "JXEVENT2X — 2x", value: "JXEVENT2X" },
          { name: "GTR 1st Place — 2x", value: "GTR1ST" },
          { name: "POTM 3rd — 2.5x", value: "POTM3RD" },
          { name: "JXEVENT3X — 3x", value: "JXEVENT3X" },
          { name: "POTM 2nd — 3x", value: "POTM2ND" },
          { name: "NEW YEAR 2026 — 3x", value: "NEWYEAR2026" },
          { name: "POTM 1st — 4x", value: "POTM1ST" },
          { name: "JXEVENT5X — 5x", value: "JXEVENT5X" },
          { name: "Event — 5x", value: "EVENT" },
        ],
      },
      { name: "remarks", description: "Optional remarks", type: 3, required: false },
    ],
  },
  {
    name: "stats",
    description: "View any pilot's Starlux Virtual stats (shown publicly)",
    options: [
      { name: "callsign", description: "Pilot callsign, e.g. Starwalker 042JX", type: 3, required: false },
      { name: "pilot", description: "Or pick a Discord-linked pilot", type: 6, required: false },
    ],
  },
  {
    name: "aboutme",
    description: "View your own Starlux Virtual + Infinite Flight stats",
  },
  {
    name: "loa",
    description: "Apply for a Leave of Absence (max 1 month)",
    options: [
      { name: "days", description: "Length in days (1–31)", type: 4, required: true, min_value: 1, max_value: 31 },
      { name: "reason", description: "Why you need the leave", type: 3, required: true },
    ],
  },
  { name: "rank", description: "View the Starlux Virtual rank ladder" },
  { name: "leaderboard", description: "Top pilots by approved hours" },
  { name: "review", description: "Staff: review pending PIREPs" },
];

const url = GUILD_ID
  ? `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`
  : `https://discord.com/api/v10/applications/${APP_ID}/commands`;

const res = await fetch(url, {
  method: "PUT",
  headers: {
    Authorization: `Bot ${TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(commands),
});

if (res.ok) {
  const data = await res.json();
  console.log(
    `✓ Registered ${data.length} commands ${GUILD_ID ? `to guild ${GUILD_ID}` : "globally"}:`,
    data.map((c) => `/${c.name}`).join(" "),
  );
} else {
  console.error(`✗ Failed (${res.status}):`, await res.text());
  process.exit(1);
}
