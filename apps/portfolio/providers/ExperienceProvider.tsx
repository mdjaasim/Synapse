"use client";

import { createExperienceEngine, type ExperienceEngine } from "@synapse/engine";
import { createSafeContext } from "@synapse/hooks";
import { useEffect, useState, type ReactNode } from "react";

const [ExperienceContext, useExperienceContext] =
  createSafeContext<ExperienceEngine>("ExperienceProvider");

export { useExperienceContext };

/**
 * Instantiates the Experience Engine (Event Bus + experience/performance
 * stores) via dependency injection and manages its lifecycle.
 */
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [engine] = useState(() => createExperienceEngine());

  useEffect(() => {
    engine.init();
    engine.start();
    return () => engine.dispose();
  }, [engine]);

  return <ExperienceContext.Provider value={engine}>{children}</ExperienceContext.Provider>;
}
