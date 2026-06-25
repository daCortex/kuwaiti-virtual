import Link from "next/link";
import Image from "next/image";
import { PublicNav } from "@/components/public/PublicNav";
import { PUBLIC_NAV, SITE } from "@/lib/site";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>

      <footer className="aurora relative mt-20 overflow-hidden text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, #4f9bd1, transparent 70%)" }} />
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Image src="/brand/kuva-emblem-white.svg" alt="" width={510} height={287} className="h-5 w-auto" />
                <span className="text-xl tracking-tight text-white"><span className="font-semibold">Kuwaiti</span><span className="font-light text-white/70"> Virtual</span></span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">{SITE.mission}</p>
              <Link href="/join" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-fin-blue transition-transform hover:scale-[1.03]">Apply to Kuwaiti Virtual <span aria-hidden>→</span></Link>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">Explore</h3>
              <ul className="mt-4 grid grid-cols-2 gap-2.5">
                {PUBLIC_NAV.map((item) => (
                  <li key={item.href}><Link href={item.href} className="text-sm text-white/70 transition-colors hover:text-white">{item.label}</Link></li>
                ))}
                <li><Link href="/crew" className="text-sm font-medium text-white transition-colors hover:text-white/80">Crew Centre →</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>{SITE.copyright}</p>
            <p>{SITE.madeBy}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
