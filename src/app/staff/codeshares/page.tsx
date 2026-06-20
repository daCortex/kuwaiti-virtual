import { getExtraRoutes, refreshExtraRoutes } from "@/lib/ops";
import { PARTNERS } from "@/lib/data";
import { CodeshareManager } from "@/components/CodeshareManager";

export const dynamic = "force-dynamic";

export default async function CrewCodesharesPage() {
  await refreshExtraRoutes();
  const routes = getExtraRoutes();
  // "Kuwaiti" first so staff can add mainline KU routes, then codeshare partners.
  const partners = ["Kuwaiti", ...PARTNERS.map((p) => p.name.replace(/ Virtual$/, ""))];

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <h2 className="font-display text-2xl font-semibold text-cream">Route management</h2>
      <p className="mt-1 text-sm text-cream-dim">Add routes to the network — type <span className="font-medium text-cream">Kuwaiti</span> as the airline for a mainline KU route, or pick a partner for a codeshare. New routes flow into the pilot route database, the flight finder, the live map and Alliance Discover.</p>
      <div className="mt-6">
        <CodeshareManager routes={routes} partners={partners} />
      </div>
    </section>
  );
}
