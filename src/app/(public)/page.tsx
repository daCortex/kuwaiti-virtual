import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { AIRPORT_COORDS, AIRPORTS } from "@/lib/airports";
import { SITE } from "@/lib/site";
import { LiveMap } from "@/components/portal/LiveMap";

export const metadata = { title: "Kuwaiti Virtual — Elevating Virtual Aviation" };

function legs() {
  const hub = AIRPORT_COORDS.OKKK;
  const seen = new Set<string>();
  const out: { to: [number, number]; code: string; city: string }[] = [];
  for (const r of ROUTES) {
    if (r.airline !== "Kuwaiti") continue;
    for (const code of [r.dep, r.arr]) {
      if (code === "OKKK" || seen.has(code) || !AIRPORT_COORDS[code]) continue;
      seen.add(code);
      out.push({ to: AIRPORT_COORDS[code], code, city: AIRPORTS[code]?.city ?? code });
    }
  }
  return { hub, out };
}

const VALUES = [
  { tag: "Career Ranks", title: "Seven ranks. One ascent.", body: "Climb from Cadet to BlueBird Commander across 1,000 hours of structured progression.", href: "/ranks" },
  { tag: "Your Logbook", title: "Every flight, credited.", body: "File a PIREP for each flight and climb the ranks — your record follows you.", href: "/career" },
  { tag: "Leadership", title: "A crew built on precision.", body: "A real org structure — Founder, CEO, Board and four staff units.", href: "/about" },
  { tag: "The Fleet", title: "Six aircraft, one livery.", body: "A modern Airbus & Boeing fleet — from the A320neo to the 777-300ER flagship.", href: "/fleet" },
];

export default function Home() {
  const { hub, out } = legs();
  return (
    <div>
      {/* HERO */}
      <section className="aurora relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle,#4f9bd1,transparent 70%)" }} />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <p className="reveal text-xs uppercase tracking-[0.32em] text-white/55">Kuwaiti Virtual · Infinite Flight</p>
          <h1 className="reveal mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white lg:text-7xl" style={{ animationDelay: "80ms" }}>
            Elevating virtual aviation.
          </h1>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-white/70" style={{ animationDelay: "160ms" }}>
            Experience the skies with a community dedicated to simulated realism and excellence — Arabian precision, from your first Cadet flight to the BlueBird Commander command seat.
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <Link href="/join" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-fin-blue transition-transform hover:scale-[1.03]">Apply Now</Link>
            <Link href="/crew" className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10">Crew Centre</Link>
            <Link href="/ranks" className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:text-white">View Ranks</Link>
            <Link href="/fleet" className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:text-white">Explore Fleet</Link>
          </div>
        </div>
      </section>

      {/* GLOBAL NETWORK */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The network</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-cream lg:text-4xl">A global network from Kuwait City.</h2>
          </div>
          <p className="text-sm text-cream-dim"><span className="font-semibold text-cream">{SITE.network.airports} airports</span> across <span className="font-semibold text-cream">{SITE.network.routes} scheduled flights</span> · hub {SITE.network.hub}</p>
        </div>
        <LiveMap hub={hub} legs={out} />
      </section>

      {/* VALUE PROP */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-cream lg:text-4xl">More than a flight log — a career in the sky.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Link key={v.tag} href={v.href} className="rise group rounded-2xl border border-obsidian bg-ink-900 p-6 lift" style={{ animationDelay: `${i * 70}ms` }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{v.tag}</p>
              <h3 className="mt-3 font-display text-lg font-semibold text-cream">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{v.body}</p>
              <span className="mt-4 inline-block text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="aurora flex flex-col items-center gap-5 rounded-3xl px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-semibold text-white lg:text-4xl">Your career starts at Cadet.</h2>
          <p className="max-w-md text-white/70">Join a community of pilots committed to professionalism, realism, and true Arabian hospitality.</p>
          <Link href="/join" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-fin-blue transition-transform hover:scale-[1.03]">Apply to Kuwaiti Virtual</Link>
        </div>
      </section>

      {/* CLOSING AIRCRAFT BAND
          Drop a real photo at public/brand/aircraft.jpg and it appears behind
          the overlay automatically (the gradient shows until then). */}
      <section className="relative mt-4 flex min-h-[320px] items-end overflow-hidden lg:min-h-[440px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(28,40,91,0.15) 0%, rgba(28,40,91,0.75) 100%), linear-gradient(135deg, #1c285b 0%, #20406d 55%, #24638e 100%), url('/brand/aircraft.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 lg:px-8 lg:pb-16">
          <p className="text-xs uppercase tracking-[0.32em] text-white/60">Kuwaiti Virtual</p>
          <p className="mt-2 max-w-xl font-display text-3xl font-semibold text-white lg:text-4xl">True Arabian hospitality, in the virtual skies.</p>
        </div>
      </section>
    </div>
  );
}
