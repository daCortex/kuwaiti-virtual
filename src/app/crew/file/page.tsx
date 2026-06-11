import Link from "next/link";
import { AIRCRAFT_GROUPS } from "@/lib/aircraft";
import { MULTIPLIERS } from "@/lib/data";
import { getPilotDashboard } from "@/lib/portal";
import { FilePirep } from "@/components/portal/FilePirep";

export const metadata = { title: "File a PIREP" };
export const dynamic = "force-dynamic";

export default async function FilePage() {
  const d = await getPilotDashboard();
  if (!d) {
    return (
      <section className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold text-cream">Sign in to file a PIREP</h1>
        <Link href="/api/auth/discord" className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white">Sign in</Link>
      </section>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <header className="rise mb-6">
        <p className="eyebrow">Pilot report</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">File a PIREP</h1>
        <p className="mt-3 max-w-2xl text-cream-dim">Log a completed flight. Approved reports credit toward your hours, rank and BlueBird Miles balance.</p>
      </header>
      <FilePirep groups={AIRCRAFT_GROUPS} multipliers={MULTIPLIERS} rankMultiplier={d.rankMultiplier} />
    </div>
  );
}
