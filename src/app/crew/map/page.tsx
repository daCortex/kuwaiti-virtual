import { ROUTES } from "@/lib/routes";
import { AIRPORT_COORDS, AIRPORTS } from "@/lib/airports";
import { LiveMap } from "@/components/portal/LiveMap";

export const metadata = { title: "Live Map" };
export const dynamic = "force-dynamic";

export default function MapPage() {
  const hub = AIRPORT_COORDS.OKKK;
  const seen = new Set<string>();
  const legs: { to: [number, number]; code: string; city: string }[] = [];
  for (const r of ROUTES) {
    if (r.airline !== "Kuwaiti") continue;
    for (const code of [r.dep, r.arr]) {
      if (code === "OKKK" || seen.has(code)) continue;
      const to = AIRPORT_COORDS[code];
      if (!to) continue;
      seen.add(code);
      legs.push({ to, code, city: AIRPORTS[code]?.city ?? code });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Live map</h1>
          <p className="mt-2 max-w-xl text-cream-dim">The Kuwaiti Virtual network radiating from Kuwait City, with live Infinite Flight traffic overlaid in real time.</p>
        </div>
        <p className="text-sm text-cream-faint">{legs.length} destinations</p>
      </header>
      <div className="rise">
        <LiveMap hub={hub} legs={legs} />
      </div>
    </div>
  );
}
