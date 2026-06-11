import { SITE_LEADERS, SITE_ORG } from "@/lib/site";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">About</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">A virtual airline built like a real one.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Kuwaiti Virtual operates inside Infinite Flight with real-world airline discipline and structure — a 70-route network from Kuwait City (OKBK), focus cities in Dubai and Jeddah, and a seven-rank path from Starter to Sovereign.</p>
      </header>

      {/* How we operate */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">How we operate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            ["Career Mode", "Unlocks at 75 flight hours (Oasis)."],
            ["Cargo operations", "Eligible from 300 hours (Mirage)."],
            ["Full fleet access", "Every aircraft unlocked at 600 hours (Mirage)."],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-obsidian bg-ink-900 p-5 lift">
              <p className="font-medium text-cream">{k}</p>
              <p className="mt-1 text-sm text-cream-dim">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership messages */}
      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {SITE_LEADERS.map((l) => (
          <div key={l.name} className="rounded-2xl border border-obsidian bg-ink-900 p-6 lift">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{l.role}</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-cream">{l.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream-dim">{l.message}</p>
            <p className="mt-4 text-sm font-medium text-cream">— {l.name}</p>
          </div>
        ))}
      </section>

      {/* Org chart */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">Organisation</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-gold/40 bg-gold/[0.03] p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-cream-faint">Founder & Chairman</p>
            <p className="font-display text-lg font-semibold text-cream">Ayaz Molla</p>
          </div>
          <div className="rounded-2xl border border-obsidian bg-ink-900 p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-cream-faint">Chief Executive Officer</p>
            <p className="font-display text-lg font-semibold text-cream">Lucian Y.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SITE_ORG.map((u) => (
              <div key={u.unit} className="rounded-2xl border border-obsidian bg-ink-900 p-5">
                <p className="font-display text-base font-semibold text-cream">{u.unit}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {u.roles.map((r, i) => (
                    <li key={i} className="flex items-center justify-between border-t border-obsidian/50 pt-2">
                      <span className="text-cream-dim">{r.role}</span>
                      <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[0.65rem] uppercase text-cream-faint">{r.who}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
