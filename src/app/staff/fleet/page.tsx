import { refreshFleetOps, getStaffAircraft, getStaffMultipliers } from "@/lib/fleetops";
import { FleetManager } from "@/components/FleetManager";

export const dynamic = "force-dynamic";

export default async function CrewFleetPage() {
  await refreshFleetOps();
  const aircraft = getStaffAircraft();
  const multipliers = getStaffMultipliers();

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <h2 className="font-display text-2xl font-semibold text-cream">Aircraft &amp; multipliers</h2>
      <p className="mt-1 text-sm text-cream-dim">Add the aircraft pilots can file and the event multipliers they can apply. New entries appear instantly in the File PIREP form.</p>
      <div className="mt-6">
        <FleetManager aircraft={aircraft} multipliers={multipliers} />
      </div>
    </section>
  );
}
