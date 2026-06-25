"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const input = "w-full rounded-xl border border-obsidian bg-ink-850 px-4 py-3 text-sm text-cream placeholder:text-cream-faint outline-none transition-colors focus:border-gold-soft focus:ring-1 focus:ring-gold-soft/40";

export function PilotLogin() {
  const router = useRouter();
  const [ifUsername, setIfUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/ifc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ifUsername: ifUsername.trim(), passcode }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setError(d.error || "Couldn't sign in."); return; }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[68vh] max-w-md flex-col justify-center px-6 py-20">
      <p className="eyebrow">Crew Center</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-cream">Pilot sign-in</h1>
      <p className="mt-3 text-sm text-cream-dim">
        Sign in with your Infinite Flight Community username. Your first sign-in sets your passcode.
      </p>
      <form onSubmit={submit} className="mt-7 space-y-3">
        <input value={ifUsername} onChange={(e) => setIfUsername(e.target.value)} placeholder="IFC username" autoFocus className={input} />
        <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" className={input} />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-white transition-all hover:brightness-125 disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-xs text-cream-faint">
        Not a pilot yet? <a href="/join" className="text-gold-soft hover:underline">Apply to fly</a>. Staff manage the airline from the <a href="/staff" className="text-gold-soft hover:underline">Crew Center</a>.
      </p>
    </section>
  );
}
