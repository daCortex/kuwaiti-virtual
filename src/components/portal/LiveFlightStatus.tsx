"use client";

import { useEffect, useState } from "react";

type LiveFlight = {
  callsign: string | null;
  altitude: number;
  speed: number;
  heading: number;
  server: string | null;
  aircraft: string | null;
};

/* Polls the IF Live API (via /api/crew/live-self) and shows a live ACARS
   banner while the signed-in pilot is airborne. Renders nothing otherwise. */
export function LiveFlightStatus() {
  const [flight, setFlight] = useState<LiveFlight | null>(null);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/crew/live-self");
        const d = await res.json();
        if (active) setFlight(d.airborne ? d.flight : null);
      } catch {
        if (active) setFlight(null);
      }
    };
    poll();
    const id = setInterval(poll, 30_000);
    return () => { active = false; clearInterval(id); };
  }, []);

  if (!flight) return null;

  return (
    <div className="rise mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-gold/40 bg-gold/5 px-5 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-gold">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
        </span>
        Airborne now
      </span>
      <span className="text-sm text-cream">
        <span className="font-mono font-medium">{flight.callsign ?? "—"}</span>
        {flight.aircraft ? ` · ${flight.aircraft}` : ""}
      </span>
      <span className="text-sm text-cream-dim tnum">FL{Math.round(flight.altitude / 100)} · {flight.speed} kts GS</span>
      {flight.server && <span className="ml-auto rounded-full bg-ink-800 px-2.5 py-0.5 text-xs text-cream-faint">{flight.server}</span>}
    </div>
  );
}
