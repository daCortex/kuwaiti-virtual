import { getPilotDashboard } from "@/lib/portal";
import { RANKS, LICENSES, TIERS } from "@/lib/career";

export const metadata = { title: "Rank Ladder" };
export const dynamic = "force-dynamic";

export default async function RanksPage() {
  const d = await getPilotDashboard();
  const currentN = d?.rank.current.n ?? 0;
  const hours = d?.totalHours ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <header className="rise">
        <p className="eyebrow">Progression</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">The rank ladder</h1>
        <p className="mt-3 max-w-2xl text-cream-dim">
          Seven ranks from <span className="text-cream">Starter</span> to <span className="text-cream">Sovereign</span>. Every verified hour
          banks toward the next. The final three are exclusive ranks with BlueBird Bank access and AP multipliers.
        </p>
      </header>

      {/* ladder */}
      <ol className="mt-8 space-y-3">
        {RANKS.map((r, i) => {
          const reached = hours >= r.hours;
          const isCurrent = r.n === currentN;
          return (
            <li key={r.name} className="rise" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`flex items-stretch gap-4 rounded-2xl border p-4 transition-colors lift ${isCurrent ? "border-gold bg-gold/5" : reached ? "border-obsidian bg-ink-900" : "border-dashed border-obsidian bg-ink-900/60"}`}>
                <RankBadge n={r.n} group={r.group} dimmed={!reached} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className={`font-display text-xl font-semibold ${reached ? "text-cream" : "text-cream-faint"}`}>{r.name}</h2>
                    <span className="rounded-full bg-ink-800 px-2 py-0.5 text-xs text-cream-dim">{r.hours.toLocaleString()}h+</span>
                    {r.group === "exclusive" && <span className="rounded-full bg-rose/10 px-2 py-0.5 text-xs text-rose">Exclusive</span>}
                    {r.apMultiplier && <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">{r.apMultiplier}× AP</span>}
                    {isCurrent && <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-white">You are here</span>}
                  </div>
                  <p className="mt-1 text-sm text-cream-dim">{r.blurb}</p>
                  {r.perks && (
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
                      {r.perks.map((p) => <li key={p} className="flex items-center gap-1.5"><span className="text-gold">•</span>{p}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* licences + tiers reference */}
      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h2 className="font-display text-lg font-semibold text-cream">Pilot licences</h2>
          <p className="mt-1 text-sm text-cream-dim">Fleet access scales with experience.</p>
          <ul className="mt-4 space-y-2.5">
            {LICENSES.map((l) => (
              <li key={l.short} className="flex items-start justify-between gap-3 border-t border-obsidian/60 pt-2.5 text-sm">
                <div>
                  <span className="font-semibold text-cream">{l.short}</span>
                  <span className="ml-2 text-xs text-cream-faint">{l.hours}h+</span>
                  <p className="text-xs text-cream-faint">{l.fleet.join(" · ")}</p>
                </div>
                {hours >= l.hours && <span className="text-xs text-gold">✓</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h2 className="font-display text-lg font-semibold text-cream">BlueBird Rewards tiers</h2>
          <p className="mt-1 text-sm text-cream-dim">Cosmetic status from your BlueBird Miles balance.</p>
          <ul className="mt-4 space-y-2.5">
            {TIERS.map((t) => (
              <li key={t.name} className="flex items-center justify-between border-t border-obsidian/60 pt-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: t.accent }} />
                  <span className="font-semibold text-cream">{t.name}</span>
                </span>
                <span className="text-xs text-cream-faint">{t.min.toLocaleString()}+ AP</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function RankBadge({ n, group, dimmed }: { n: number; group: string; dimmed: boolean }) {
  const grad = group === "exclusive" ? "linear-gradient(135deg,#24638e,#1f2c56)" : "linear-gradient(135deg,#1f2c56,#24638e)";
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: dimmed ? "var(--color-ink-800)" : grad, opacity: dimmed ? 0.5 : 1 }}>
      <span className="font-display text-xl font-semibold">{n}</span>
      {group === "exclusive" && <span className="absolute -right-1 -top-1 text-sm">✦</span>}
    </div>
  );
}
