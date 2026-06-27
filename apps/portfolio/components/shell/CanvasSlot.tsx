"use client";

/**
 * Mount point for the React Three Fiber canvas. Phase 2 replaces this with the
 * actual renderer; for now it reserves the full-viewport background layer.
 */
export function CanvasSlot() {
  return <div aria-hidden className="fixed inset-0 -z-10" data-slot="canvas" />;
}
