import Link from "next/link";
import { APPLY } from "@/lib/data";

export const metadata = { title: "Apply" };

const STEPS = [
  { n: 1, title: "Check the requirements", body: "Make sure you meet the criteria below before applying." },
  { n: 2, title: "Submit your application", body: "Tell us your IFC username and a little about your flying." },
  { n: 3, title: "Fly your first sector", body: "Once accepted, file your first PIREP as an Starter pilot and start climbing." },
];

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal text-center">
        <p className="eyebrow">Join the airline</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">Your career starts at Starter.</h1>
        <p className="mx-auto mt-4 max-w-xl text-cream-dim">Apply to Kuwaiti Virtual and join a community of pilots committed to realism, excellence, and Arabian precision.</p>
      </header>

      {/* Steps */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rise rounded-2xl border border-obsidian bg-ink-900 p-6 lift" style={{ animationDelay: `${s.n * 70}ms` }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm font-semibold text-white">{s.n}</span>
            <h3 className="mt-3 font-display text-base font-semibold text-cream">{s.title}</h3>
            <p className="mt-1 text-sm text-cream-dim">{s.body}</p>
          </div>
        ))}
      </section>

      {/* Requirements */}
      <section className="mt-10 rounded-2xl border border-obsidian bg-ink-900 p-7">
        <h2 className="font-display text-xl font-semibold text-cream">Pilot requirements</h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {APPLY.pilot.requirements.map((r) => (
            <li key={r} className="flex items-start gap-2.5 text-sm text-cream-dim"><span className="mt-0.5 text-gold">✓</span>{r}</li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-obsidian bg-ink-900 px-6 py-12 text-center">
        <h2 className="font-display text-2xl font-semibold text-cream">Ready for the flight deck?</h2>
        <p className="max-w-md text-sm text-cream-dim">Join our Discord to submit your application and meet the crew. Already a pilot? Head to the Crew Centre.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-white transition-all hover:brightness-125">Apply on Discord</a>
          <Link href="/crew" className="rounded-full border border-gold/40 px-7 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/8">Crew Centre</Link>
        </div>
      </section>
    </div>
  );
}
