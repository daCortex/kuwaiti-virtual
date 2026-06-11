import { listNews } from "@/lib/db";
import { getRotw, rotwOptions, getSpotlightRoutes, firstFlightNo } from "@/lib/ops";
import { airportCity } from "@/lib/airports";
import { fmtHours } from "@/lib/portal";
import { RotwManager } from "@/components/RotwManager";
import { EventsAdmin } from "@/components/EventsAdmin";

export const dynamic = "force-dynamic";

export default async function CrewEventsPage() {
  const [posts] = await Promise.all([listNews()]);
  const current = getRotw();
  const spotlights = getSpotlightRoutes();
  const options = rotwOptions().map((r) => ({
    routeNumber: r.routeNumber,
    label: `${firstFlightNo(r)} · ${airportCity(r.dep)} → ${airportCity(r.arr)} (${fmtHours(r.minutes)})`,
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <h2 className="font-display text-2xl font-semibold text-cream">Events Planner</h2>
      <p className="mt-1 text-sm text-cream-dim">Set the Route of the Week, schedule group flights, and publish events — all surfaced on the pilot dashboard.</p>

      {/* ROTW + spotlight */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">✦ Route of the Week</p>
          <p className="mt-2 font-display text-2xl font-semibold text-cream">{airportCity(current.dep)} → {airportCity(current.arr)}</p>
          <p className="text-sm text-cream-faint">{firstFlightNo(current)} · {current.aircraft} · {fmtHours(current.minutes)}</p>
          <div className="mt-4"><RotwManager current={current.routeNumber} options={options} /></div>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">2× Spotlight · this week</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {spotlights.map((s) => <li key={s.routeNumber} className="rounded-full bg-rose/10 px-3 py-1 text-sm text-rose">{airportCity(s.dep)} → {airportCity(s.arr)}</li>)}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Auto-rotated 1–3× per week. Double BlueBird Miles on these sectors.</p>
        </div>
      </div>

      <div className="mt-8 border-t border-obsidian/60 pt-8">
        <EventsAdmin posts={posts} />
      </div>
    </section>
  );
}
