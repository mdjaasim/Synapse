"use client";

import { useExperienceStore } from "../hooks/use-experience";

export default function HomePage() {
  const worldPhase = useExperienceStore((state) => state.worldPhase);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">Synapse</p>
      <p className="text-xs text-neutral-600">world phase: {worldPhase}</p>
    </main>
  );
}
