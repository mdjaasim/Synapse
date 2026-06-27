"use client";

import { createSafeContext, useReducedMotion } from "@synapse/hooks";
import { useEffect, type ReactNode } from "react";
import { useStore } from "zustand";
import { useStoresContext } from "./StoresProvider";

export interface AccessibilityValue {
  readonly reducedMotion: boolean;
}

const [AccessibilityContext, useAccessibilityContext] =
  createSafeContext<AccessibilityValue>("AccessibilityProvider");

export { useAccessibilityContext };

/**
 * Bridges the OS reduced-motion preference into the persisted settings store
 * and reflects it on the document root. Must be nested within StoresProvider.
 */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const { settings } = useStoresContext();
  const setReducedMotion = useStore(settings, (state) => state.setReducedMotion);
  const reducedMotion = useStore(settings, (state) => state.reducedMotion);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion, setReducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  return (
    <AccessibilityContext.Provider value={{ reducedMotion }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
