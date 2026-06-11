import Link from "next/link";
import { getPilotDashboard, fmtHours, fmtDate, timeAgo } from "@/lib/portal";
import { computeAp } from "@/lib/career";
import { getRotw, getSpotlightRoutes, getDispatches, isSpotlight, firstFlightNo } from "@/lib/ops";
import { listNews } from "@/lib/db";
import { airportCity } from "@/lib/airports";
import { CountUp } from "@/components/portal/CountUp";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const d = await getPilotDashboard();
  if (!d) {
    return (
      <section className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold text-cream">Pilot sign-in required</h1>
        <p className="mt-3 text-cream-dim">Sign in to access your Kuwaiti Virtual flight deck.</p>
        <Link href="/api/auth/discord" className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white">Sign in</Link>
      </section>
    );
  }

  const { rank, tier, license } = d;
  const rotw = getRotw();
  const spotlights = getSpotlightRoutes();
  const dispatches = d.gates.career
    ? getDispatches(d.session.pilotId, { authorizedFleet: d.fleet, rankMultiplier: d.rankMultiplier })
    : [];
  const rotwAp = computeAp(rotw.minutes, { spotlight: isSpotlight(rotw.routeNumber), rankMultiplier: d.rankMultiplier }).net;
  const firstName = d.session.displayName.split(" ")[0];
  const events = (await listNews(4)).filter((e) => e.category !== "Route of the Week").slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-10">
      {/* ============ HERO ============ */}
      <section className="rise overflow-hidden rounded-3xl border border-obsidian">
        <div className="aurora relative px-6 py-8 lg:px-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #4f9bd1, transparent 70%)" }} />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Welcome back, captain</p>
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white lg:text-5xl">{firstName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-sm font-medium text-white">
                  <span className="h-2 w-2 rounded-full" style={{ background: tier.current.accent }} />
                  Rank {rank.current.n} · {rank.current.name}
                </span>
                <span className="rounded-full border border-white/25 px-3 py-1 text-sm text-white/80">{license.current.short} licence</span>
              </div>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/8 px-6 py-5 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">BlueBird Miles · {tier.current.name}</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl text-rose-soft">✦</span>
                <CountUp value={d.apBalance} className="tnum font-display text-4xl font-semibold text-white lg:text-5xl" />
              </p>
              <p className="mt-1 text-xs text-white/60">{tier.next ? `${tier.apToNext!.toLocaleString()} AP to ${tier.next.name}` : "Top tier achieved ✦"}</p>
            </div>
          </div>
          {/* rank progress */}
          <div className="relative mt-7">
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>{rank.current.name}</span>
              <span>{rank.next ? <>{Math.round(rank.hoursToNext!).toLocaleString()}h to <span className="font-semibold text-white">{rank.next.name}</span></> : "Highest rank attained"}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
              <div className="bar-fill h-full rounded-full" style={{ ["--to" as string]: `${rank.pct}%`, background: "linear-gradient(90deg,#a99cff,#4f9bd1)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ KPI ROW ============ */}
      <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Flight time", value: fmtHours(d.totalMinutes) },
          { label: "PIREPs filed", value: d.totalPireps.toLocaleString() },
          { label: "Last PIREP", value: timeAgo(d.lastPirepAt), sub: fmtDate(d.lastPirepAt) },
          { label: "Next rank", value: rank.next ? rank.next.name : "Maxed", sub: rank.next ? `${Math.round(rank.hoursToNext!)}h to go` : "Sovereign" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-obsidian bg-ink-900 p-4">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-cream-faint">{c.label}</p>
            <p className="mt-1.5 font-display text-xl font-semibold text-cream">{c.value}</p>
            {c.sub && <p className="text-xs text-cream-faint">{c.sub}</p>}
          </div>
        ))}
      </section>

      {/* ============ TODAY: featured route + dispatch ============ */}
      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Route of the week */}
        <div className="rise overflow-hidden rounded-2xl border border-obsidian bg-ink-900 lift lg:col-span-2">
          <div className="flex items-center justify-between border-b border-obsidian/70 px-6 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">✦ Route of the Week</p>
            {spotlights.length > 0 && <span className="text-xs text-cream-faint">2× spotlight: {spotlights.map((s) => `${s.dep}→${s.arr}`).join(", ")}</span>}
          </div>
          <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-display text-2xl font-semibold text-cream sm:text-3xl">{airportCity(rotw.dep)} <span className="text-gold">→</span> {airportCity(rotw.arr)}</div>
              <p className="mt-1.5 text-sm text-cream-faint">{firstFlightNo(rotw)} · {rotw.aircraft.replace(/^Kuwaiti |^Kuwaiti /, "")} · {fmtHours(rotw.minutes)}</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-cream-faint">Reward</p>
                <p className="font-display text-xl font-semibold text-cream">✦ {rotwAp.toLocaleString()}</p>
              </div>
              <Link href="/crew/file" className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-125">Fly it</Link>
            </div>
          </div>
        </div>

        {/* Today's dispatch (compact) */}
        <div className="rise rounded-2xl border border-obsidian bg-ink-900 lift">
          <div className="flex items-center justify-between border-b border-obsidian/70 px-5 py-3">
            <p className="text-sm font-semibold text-cream">Today’s dispatch</p>
            <Link href="/crew/career" className="text-xs text-gold hover:underline">All →</Link>
          </div>
          {d.gates.career ? (
            <ul className="divide-y divide-obsidian/60">
              {dispatches.map((dp) => (
                <li key={dp.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cream">{airportCity(dp.dep)} → {airportCity(dp.arr)}</p>
                    <p className="text-xs text-cream-faint">{dp.flightNo} · {fmtHours(dp.minutes)}{dp.spotlight ? " · 2×" : ""}</p>
                  </div>
                  <span className="shrink-0 pl-3 text-sm font-semibold text-cream">✦ {dp.maxAp.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-cream-dim">Career Mode unlocks at <span className="font-medium text-cream">Oasis</span></p>
              <p className="mt-1 text-xs text-cream-faint">{Math.max(0, Math.ceil(115 - d.totalHours))} flight hours to go</p>
            </div>
          )}
        </div>
      </section>

      {/* ============ EVENTS (thin) ============ */}
      {events.length > 0 && (
        <section className="mt-4 rounded-2xl border border-obsidian bg-ink-900 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-cream">Events & group flights</p>
            <Link href="/crew/routes" className="text-xs text-cream-faint hover:text-cream">View all</Link>
          </div>
          <ul className="mt-2.5 space-y-2">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-3 text-sm">
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase ${e.category === "Group Flight" ? "bg-rose/10 text-rose" : "bg-ink-800 text-cream-faint"}`}>{e.category}</span>
                <span className="truncate text-cream-dim">{e.title}</span>
                {e.eventAt && <span className="ml-auto shrink-0 text-xs text-cream-faint">{new Date(e.eventAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============ EXPLORE (slim pills) ============ */}
      <section className="mt-4">
        <div className="flex flex-wrap gap-2">
          <Pill href="/crew/routes" label="Route database" />
          <Pill href="/crew/map" label="Live map" />
          <Pill href="/crew/logbook" label="Logbook" />
          <Pill href="/crew/cargo" label="Cargo" locked={!d.gates.cargo} />
          <Pill href="/crew/special-ops" label="Special Ops" locked={!d.gates.specialOps} />
          <Pill href="/crew/discover" label="Alliance Discover" locked={!d.gates.discover} />
        </div>
      </section>
    </div>
  );
}

function Pill({ href, label, locked }: { href: string; label: string; locked?: boolean }) {
  return (
    <Link href={href}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors lift ${
        locked ? "border-dashed border-obsidian bg-ink-900/60 text-cream-faint" : "border-obsidian bg-ink-900 text-cream-dim hover:text-cream"
      }`}>
      {label}
      {locked ? <span className="text-xs">🔒</span> : <span className="text-cream-faint">→</span>}
    </Link>
  );
}
