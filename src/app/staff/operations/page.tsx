import { LICENSES } from "@/lib/career";
import { RANKS } from "@/lib/data";

export const dynamic = "force-dynamic";

const PLANNED = [
  { title: "Override the Route of the Week", body: "Pin or swap the featured route and the weekly spotlight sectors from here." },
  { title: "Roster & rank tools", body: "Promote pilots, set manual ranks, and manage leave-of-absence requests." },
  { title: "Network expansion", body: "Add mainline and codeshare routes from Route management — they flow straight to the live map." },
];

export default function CrewOperationsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-semibold text-cream">Operations</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-cream-dim">
        The pilot career runs on verified flight hours — every approved PIREP advances a pilot through the seven-rank
        ladder. Use the panels below as a reference for the progression structure.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Rank ladder</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {RANKS.map((r) => (
              <li key={r.name} className="flex items-center justify-between border-t border-obsidian/60 pt-2">
                <span className="text-cream-dim">{r.n}. {r.name}</span>
                <span className="font-semibold text-cream">{r.hours.toLocaleString()}h+</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Licences &amp; fleet access</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LICENSES.map((l) => (
              <li key={l.short} className="border-t border-obsidian/60 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-cream-dim">{l.name}</span>
                  <span className="font-semibold text-cream">{l.hours}h+</span>
                </div>
                <p className="mt-0.5 text-xs text-cream-faint">{l.fleet.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mt-9 font-display text-lg font-semibold text-cream">Staff tools</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {PLANNED.map((p) => (
          <div key={p.title} className="rounded-2xl border border-obsidian bg-ink-900 p-5">
            <p className="flex items-center gap-2 font-medium text-cream"><span className="text-gold">✦</span> {p.title}</p>
            <p className="mt-1 text-sm text-cream-dim">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
