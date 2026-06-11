import { SITE_HUBS } from "@/lib/site";

export const metadata = { title: "Hubs" };

export default function HubsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">Operating bases</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">One main hub. A Arabian network.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Kuwaiti Virtual is built around Kuwait International, with focus cities that feed the trunk network and extend reach across the Gulf.</p>
      </header>

      <div className="mt-10 space-y-5">
        {SITE_HUBS.map((h, i) => (
          <div key={h.icao} className={`rise overflow-hidden rounded-2xl border lift ${h.role === "Main Hub" ? "border-gold/40 bg-gold/[0.03]" : "border-obsidian bg-ink-900"}`} style={{ animationDelay: `${i * 70}ms` }}>
            <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${h.role === "Main Hub" ? "bg-gold text-white" : "bg-ink-800 text-cream-dim"}`}>{h.role}</span>
                  <span className="font-mono text-xs text-cream-faint">{h.icao} · {h.iata}</span>
                </div>
                <h2 className="mt-2.5 font-display text-2xl font-semibold text-cream">{h.name}</h2>
                <p className="text-sm text-cream-faint">{h.city}, {h.country} · {h.coords}</p>
                <p className="mt-3 text-sm leading-relaxed text-cream-dim">{h.blurb}</p>
              </div>
              {h.careerCount != null && (
                <div className="shrink-0 rounded-2xl border border-obsidian bg-ink-900 px-5 py-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-cream-faint">Career routes</p>
                  <p className="font-display text-3xl font-semibold text-cream">{h.careerCount}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
