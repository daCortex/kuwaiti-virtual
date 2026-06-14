"use client";

import { useState } from "react";

const input =
  "w-full rounded-xl border border-obsidian bg-ink-850 px-4 py-2.5 text-sm text-cream placeholder:text-cream-faint focus:border-gold/60 focus:outline-none";
const label = "block text-xs font-medium uppercase tracking-wide text-cream-faint";

export function ApplyForm() {
  const [f, setF] = useState({ displayName: "", ifUsername: "", age: "", experience: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-gold/40 bg-gold/5 px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold text-2xl text-white">✓</div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-cream">Application received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-cream-dim">
          Thank you, {f.displayName.split(" ")[0]}. Our team will review your application and reach out via
          Infinite Flight Community. Welcome aboard — and blue skies. ✦
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-obsidian bg-ink-900 px-6 py-8 sm:px-8">
      <h2 className="font-display text-2xl font-semibold text-cream">Apply to fly with us</h2>
      <p className="mt-1 text-sm text-cream-dim">Submit your application right here — no Discord required to start.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Full name</label>
          <input className={`mt-1.5 ${input}`} value={f.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="Your name" maxLength={60} required />
        </div>
        <div>
          <label className={label}>IFC username</label>
          <input className={`mt-1.5 ${input}`} value={f.ifUsername} onChange={(e) => set("ifUsername", e.target.value)} placeholder="Infinite Flight Community username" maxLength={40} required />
        </div>
        <div>
          <label className={label}>Age</label>
          <input className={`mt-1.5 ${input}`} value={f.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 16" inputMode="numeric" maxLength={3} />
        </div>
        <div className="sm:col-span-1">
          <label className={label}>Grade / experience</label>
          <input className={`mt-1.5 ${input}`} value={f.experience} onChange={(e) => set("experience", e.target.value)} placeholder="e.g. Grade 3, 120 hours" maxLength={120} />
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>}

      <button type="submit" disabled={busy} className="mt-6 w-full rounded-full bg-gold px-7 py-3 text-sm font-semibold text-white transition-all hover:brightness-125 disabled:opacity-60 sm:w-auto">
        {busy ? "Submitting…" : "Submit application"}
      </button>
      <p className="mt-3 text-xs text-cream-faint">By applying you confirm you meet the pilot requirements above.</p>
    </form>
  );
}
