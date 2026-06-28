"use client";

import type { ReactNode } from "react";
import { ErrorBoundary } from "../boundaries/ErrorBoundary";
import { AccessibilityLayer } from "./AccessibilityLayer";
import { AIInterface } from "./AIInterface";
import { CanvasSlot } from "./CanvasSlot";
import { Cursor } from "./Cursor";
import { DebugTools } from "./DebugTools";
import { Hud } from "./Hud";
import { Loader } from "./Loader";
import { OverlayManager } from "./OverlayManager";

/**
 * The permanently-mounted application shell. Each slot is isolated behind an
 * error boundary so a failure in one subsystem never breaks the others.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#scroll-stage"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:border focus:border-neutral-700 focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-xs focus:text-neutral-200"
      >
        Skip to narrative
      </a>
      <AccessibilityLayer />
      <ErrorBoundary name="canvas">
        <CanvasSlot />
      </ErrorBoundary>
      <ErrorBoundary name="hud">
        <Hud />
      </ErrorBoundary>
      <ErrorBoundary name="overlay">
        <OverlayManager>{children}</OverlayManager>
      </ErrorBoundary>
      <ErrorBoundary name="ai">
        <AIInterface />
      </ErrorBoundary>
      <ErrorBoundary name="cursor">
        <Cursor />
      </ErrorBoundary>
      <ErrorBoundary name="loader">
        <Loader />
      </ErrorBoundary>
      <ErrorBoundary name="debug">
        <DebugTools />
      </ErrorBoundary>
    </>
  );
}
