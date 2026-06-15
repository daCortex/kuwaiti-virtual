import { SITE_MODES } from "@/lib/site";

export const metadata = { title: "Modes" };

export default function ModesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">How you fly</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">How you fly matters.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Pick the mode that fits how you fly, and switch between them as your rank and availability change — your hours carry across.</p>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {SITE_MODES.map((m, i) => (
          <div key={m.name} className="rise flex flex-col rounded-2xl border border-obsidian bg-ink-900 p-6 lift" style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{m.unlock}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-cream">{m.name}</h2>
            <p className="mt-1 text-sm font-medium text-cream-dim">{m.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-cream-dim">{m.desc}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-cream-faint">Best for</p>
            <p className="text-sm text-cream-dim">{m.bestFor}</p>
            <ul className="mt-4 space-y-1.5 border-t border-obsidian/60 pt-4 text-sm">
              {m.pros.map((p) => <li key={p} className="flex items-start gap-2 text-cream-dim"><span className="text-gold">✓</span>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-cream">At a glance</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-obsidian bg-ink-900">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-obsidian/60 text-xs uppercase tracking-wide text-cream-faint">
                <th className="px-5 py-3 font-normal">Mode</th><th className="px-5 py-3 font-normal">Unlock</th><th className="px-5 py-3 font-normal">Schedule</th><th className="px-5 py-3 font-normal">Rank progress</th><th className="px-5 py-3 font-normal">Aircraft scope</th>
              </tr>
            </thead>
            <tbody>
              {SITE_MODES.map((m) => (
                <tr key={m.name} className="border-t border-obsidian/40">
                  <td className="px-5 py-3 font-medium text-cream">{m.name}</td>
                  <td className="px-5 py-3 text-cream-dim">{m.unlock}</td>
                  <td className="px-5 py-3 text-cream-dim">{m.name === "Casual Mode" ? "Flexible" : m.name === "Career Mode" ? "Rostered" : "Contract"}</td>
                  <td className="px-5 py-3 text-cream-dim">{m.multiplier}</td>
                  <td className="px-5 py-3 text-cream-dim">{m.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
