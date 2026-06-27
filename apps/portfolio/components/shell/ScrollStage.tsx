"use client";

/**
 * Tall scrollable content that drives the Origin Void camera choreography.
 * Each section represents a narrative beat; scroll progress scrubs the
 * registered camera timeline via ScrollTrigger.
 */
export function ScrollStage() {
  return (
    <div className="relative w-full" data-slot="scroll-stage">
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-600">Origin</p>
        <h1 className="mt-4 text-3xl font-light tracking-tight text-neutral-200 md:text-5xl">
          Synapse
        </h1>
        <p className="mt-6 max-w-md text-center text-sm text-neutral-500">
          Scroll to explore the void. Every movement is choreographed.
        </p>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-600">Awakening</p>
        <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-neutral-400">
          The luminous core breathes. Camera drifts closer as narrative progress advances through
          the scroll timeline.
        </p>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-600">Depth</p>
        <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-neutral-400">
          Pull back to observe the full void — atmosphere, dust, and the living center of the
          universe.
        </p>
      </section>

      <section className="flex min-h-[50vh] flex-col items-center justify-end px-6 pb-24">
        <p className="text-xs text-neutral-700">End of Origin Void sequence</p>
      </section>
    </div>
  );
}
