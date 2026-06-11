import { getExtraRoutes } from "@/lib/ops";
import { PARTNERS } from "@/lib/data";
import { CodeshareManager } from "@/components/CodeshareManager";

export const dynamic = "force-dynamic";

export default function CrewCodesharesPage() {
  const routes = getExtraRoutes();
  const partners = PARTNERS.map((p) => p.name.replace(/ Virtual$/, ""));

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <h2 className="font-display text-2xl font-semibold text-cream">Codeshare management</h2>
      <p className="mt-1 text-sm text-cream-dim">Add partner routes to the network. They flow straight into the pilot route database, the flight finder and Alliance Discover.</p>
      <div className="mt-6">
        <CodeshareManager routes={routes} partners={partners} />
      </div>
    </section>
  );
}
