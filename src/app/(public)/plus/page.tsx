import { TIERS } from "@/lib/career";
import { PLUS_EARN } from "@/lib/site";

export const metadata = { title: "BlueBird Rewards" };

export default function PlusPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">BlueBird Banking</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">The currency of your career.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">BlueBird Rewards is a private economy for our pilots. Earn BlueBird Miles (AP) with every flight and climb five tiers — each milestone a recognition of your dedication to the airline.</p>
      </header>

      {/* Tiers */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TIERS.map((t, i) => (
          <div key={t.name} className="rise rounded-2xl border border-obsidian bg-ink-900 p-5 text-center lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="mx-auto h-10 w-10 rounded-full" style={{ background: t.accent }} />
            <h2 className="mt-3 font-display text-lg font-semibold text-cream">{t.name}</h2>
            <p className="mt-1 text-sm font-medium text-cream-dim">{t.min.toLocaleString()}+ AP</p>
            <p className="mt-2 text-xs text-cream-faint">{t.blurb}</p>
          </div>
        ))}
      </section>

      {/* Earning */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">How you earn</h2>
        <p className="mt-1 text-sm text-cream-dim">BlueBird Miles are granted automatically based on flight duration.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {PLUS_EARN.map((e) => (
            <div key={e.label} className="rounded-2xl border border-obsidian bg-ink-900 p-5 lift">
              <p className="text-sm font-medium text-cream">{e.label}</p>
              <p className="text-xs text-cream-faint">{e.note}</p>
              <p className="mt-3 font-display text-3xl font-semibold text-cream">✦ {e.ap}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-cream-faint">A private economy for our pilots — keep flying to advance through the tiers.</p>
      </section>
    </div>
  );
}
