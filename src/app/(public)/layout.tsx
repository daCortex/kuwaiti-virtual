import Link from "next/link";
import Image from "next/image";
import { PublicNav } from "@/components/public/PublicNav";
import { PUBLIC_NAV, SITE } from "@/lib/site";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-obsidian bg-ink-900">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Image src="/brand/kuva-emblem-navy.svg" alt="" width={1050} height={590} className="logo-light-theme h-5 w-auto" />
                <Image src="/brand/kuva-emblem-white.svg" alt="" width={510} height={287} className="logo-dark-theme h-5 w-auto" />
                <span className="text-xl tracking-tight text-cream"><span className="font-semibold">Kuwaiti</span><span className="font-light text-cream-dim"> Virtual</span></span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-faint">{SITE.mission}</p>
              <Link href="/join" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-125">Apply to Kuwaiti Virtual <span aria-hidden>→</span></Link>
            </div>
            <div>
              <h3 className="eyebrow">Explore</h3>
              <ul className="mt-4 grid grid-cols-2 gap-2.5">
                {PUBLIC_NAV.map((item) => (
                  <li key={item.href}><Link href={item.href} className="text-sm text-cream-dim transition-colors hover:text-gold">{item.label}</Link></li>
                ))}
                <li><Link href="/crew" className="text-sm text-gold transition-colors hover:text-cream">Crew Centre →</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-obsidian/60 pt-6 text-xs text-cream-faint sm:flex-row sm:items-center sm:justify-between">
            <p>{SITE.copyright}</p>
            <p>{SITE.madeBy}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
