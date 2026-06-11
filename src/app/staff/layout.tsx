import type { Metadata } from "next";
import { getSession, hasCrewAccess } from "@/lib/auth";
import { CrewTabs } from "@/components/CrewTabs";
import { CrewLogin } from "@/components/CrewLogin";
import { CrewSearch } from "@/components/CrewSearch";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Crew Center",
  robots: { index: false },
};

export default async function CrewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await hasCrewAccess();
  if (!access) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">
          <CrewLogin />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const session = await getSession();
  const who = session?.callsign ?? "Admin";

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <div className="min-h-[70vh]">
      <div className="border-b border-obsidian/40 bg-ink-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 pb-0 pt-10 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="eyebrow">Crew Center</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-cream">
              Operations
            </h1>
            <p className="mt-1 text-sm text-cream-faint">
              Signed in as {who}
              {session?.demo && " · demo mode"}
            </p>
          </div>
          <CrewSearch />
        </div>
        <div className="mx-auto mt-6 max-w-7xl">
          <CrewTabs />
        </div>
      </div>
      {children}
      </div>
      <SiteFooter />
    </div>
  );
}
