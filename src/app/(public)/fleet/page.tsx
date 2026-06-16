import { SITE_FLEET, SITE_FLEET_HISTORIC } from "@/lib/site";

export const metadata = { title: "Fleet" };

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">The fleet</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">Six aircraft. One livery.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">A modern Airbus and Boeing fleet — narrowbody workhorses feed the Gulf and regional network while widebodies push to Asia, Africa, Europe and across the Atlantic.</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-6 text-sm">
        {[["Current aircraft", "6"], ["Longest range", "8,150 nm"], ["Hub", "OKKK"]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-obsidian bg-ink-900 px-5 py-3 lift">
            <p className="text-xs uppercase tracking-wide text-cream-faint">{k}</p>
            <p className="font-display text-xl font-semibold text-cream">{v}</p>
          </div>
        ))}
      </div>

      {/* ===================== CURRENT FLEET ===================== */}
      <div className="mt-12 flex items-center gap-3">
        <h2 className="font-display text-2xl font-semibold text-cream">Current fleet</h2>
        <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">{SITE_FLEET.length} active</span>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SITE_FLEET.map((a, i) => (
          <div key={a.type} className="rise overflow-hidden rounded-2xl border border-obsidian bg-ink-900 lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between border-b border-obsidian/70 px-5 py-3">
              <span className="rounded-full bg-gold/8 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-gold">{a.family}</span>
              <span className="font-mono text-xs text-cream-faint">{a.reg}</span>
            </div>
            <div className="px-5 py-5">
              <h3 className="font-display text-2xl font-semibold text-cream">{a.type}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">{a.role}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {[["PAX", a.pax], ["Range", `${a.rangeNm.toLocaleString()} nm`], ["Cruise alt", a.cruiseAlt], ["Cruise", a.cruiseSpeed], ["Engines", a.engines], ["Acquired", a.acquired]].map(([k, v]) => (
                  <div key={k as string} className="border-t border-obsidian/50 pt-2">
                    <dt className="text-[0.7rem] uppercase tracking-wide text-cream-faint">{k}</dt>
                    <dd className="text-cream">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== HISTORIC FLEET ===================== */}
      <div className="mt-14 flex items-center gap-3">
        <h2 className="font-display text-2xl font-semibold text-cream">Historic fleet</h2>
        <span className="rounded-full border border-obsidian bg-ink-850 px-2.5 py-0.5 text-xs font-semibold text-cream-faint">retired</span>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-cream-dim">Aircraft that shaped the airline&apos;s history and have since been retired from service.</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SITE_FLEET_HISTORIC.map((a, i) => (
          <div key={a.type} className="rise overflow-hidden rounded-2xl border border-dashed border-obsidian bg-ink-900/60 lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between border-b border-obsidian/60 px-5 py-3">
              <span className="rounded-full bg-ink-800 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-cream-faint">{a.family}</span>
              <span className="font-mono text-xs text-cream-faint">{a.reg}</span>
            </div>
            <div className="px-5 py-5">
              <h3 className="font-display text-xl font-semibold text-cream-dim">{a.type}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-faint">{a.role}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {[["PAX", a.pax], ["Engines", a.engines], ["In service", a.years]].map(([k, v]) => (
                  <div key={k as string} className="border-t border-obsidian/50 pt-2">
                    <dt className="text-[0.7rem] uppercase tracking-wide text-cream-faint">{k}</dt>
                    <dd className="text-cream-dim">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
