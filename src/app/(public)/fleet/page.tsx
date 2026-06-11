import { SITE_FLEET } from "@/lib/site";

export const metadata = { title: "Fleet" };

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">The fleet</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">Six aircraft. One livery.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">From regional Embraers to the long-haul A350-900, every aircraft in our fleet earns its place — short-haul workhorses feed the trunk network while widebodies push to Asia and across the Atlantic.</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-6 text-sm">
        {[["Aircraft", "6"], ["Destinations", "200+"], ["Longest range", "8,100 nm"]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-obsidian bg-ink-900 px-5 py-3 lift">
            <p className="text-xs uppercase tracking-wide text-cream-faint">{k}</p>
            <p className="font-display text-xl font-semibold text-cream">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SITE_FLEET.map((a, i) => (
          <div key={a.type} className="rise overflow-hidden rounded-2xl border border-obsidian bg-ink-900 lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between border-b border-obsidian/70 px-5 py-3">
              <span className="rounded-full bg-gold/8 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-gold">{a.family}</span>
              <span className="font-mono text-xs text-cream-faint">{a.reg}</span>
            </div>
            <div className="px-5 py-5">
              <h2 className="font-display text-2xl font-semibold text-cream">{a.type}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">{a.role}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {[["PAX", a.pax], ["Range", `${a.rangeNm.toLocaleString()} nm`], ["Cruise alt", a.cruiseAlt], ["Cruise", a.cruiseSpeed], ["Engines", a.engines], ["Acquired", a.acquired]].map(([k, v]) => (
                  <div key={k as string} className="border-t border-obsidian/50 pt-2">
                    <dt className="text-[0.7rem] uppercase tracking-wide text-cream-faint">{k}</dt>
                    <dd className="text-cream">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-obsidian/50 pt-3 text-xs text-cream-faint">{a.routesFlown} routes flown</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
