"use client";

import type { ReactNode } from "react";

/** Renders foreground overlay content (HTML UI) above the canvas layer. */
export function OverlayManager({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10" data-slot="overlay">
      {children}
    </div>
  );
}
