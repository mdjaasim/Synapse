"use client";

import type { PerformanceStore } from "@synapse/engine";
import { createSafeContext } from "@synapse/hooks";
import type { ReactNode } from "react";
import { useExperienceContext } from "./ExperienceProvider";

const [PerformanceContext, usePerformanceContext] =
  createSafeContext<PerformanceStore>("PerformanceProvider");

export { usePerformanceContext };

/**
 * Surfaces the engine's performance store as the access point for adaptive
 * quality. FPS sampling and GPU-tier detection arrive in the optimization
 * phase. Must be nested within ExperienceProvider.
 */
export function PerformanceProvider({ children }: { children: ReactNode }) {
  const engine = useExperienceContext();

  return (
    <PerformanceContext.Provider value={engine.stores.performance}>
      {children}
    </PerformanceContext.Provider>
  );
}
