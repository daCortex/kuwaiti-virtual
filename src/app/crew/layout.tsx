import Link from "next/link";
import { getPilotDashboard, fmtApCompact } from "@/lib/portal";
import { PortalNav, type NavSummary } from "@/components/portal/PortalNav";
import { BRAND } from "@/lib/data";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const d = await getPilotDashboard();
  const summary: NavSummary | null = d
    ? {
        callsign: d.session.callsign,
        displayName: d.session.displayName,
        rankName: d.rank.current.name,
        tierName: d.tier.current.name,
        tierAccent: d.tier.current.accent,
        apCompact: fmtApCompact(d.apBalance),
        gates: { specialOps: d.gates.specialOps, discover: d.gates.discover },
        isStaff: d.session.isStaff,
        demo: !!d.session.demo,
      }
    : null;

  return (
    <div className="flex min-h-full flex-col">
      <PortalNav summary={summary} />
      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-obsidian bg-ink-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-cream">Kuwaiti Virtual</span>
            <span className="hidden text-cream-faint sm:inline">·</span>
            <span className="hidden font-mono text-xs text-cream-faint sm:inline">{BRAND.tagline}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-cream-faint">
            <Link href="/crew/ranks" className="hover:text-cream">Ranks</Link>
            <Link href="/crew/routes" className="hover:text-cream">Routes</Link>
            <Link href="/crew/leaderboard" className="hover:text-cream">Leaderboard</Link>
            <Link href="/staff" className="hover:text-cream">Crew Center</Link>
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-5 pb-7 text-[0.7rem] leading-relaxed text-cream-faint lg:px-8">
          {BRAND.disclaimer}
        </p>
      </footer>
    </div>
  );
}
