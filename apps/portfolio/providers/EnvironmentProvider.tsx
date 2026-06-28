"use client";

import { createEnvironmentSimulator, type EnvironmentSimulator } from "@synapse/world";
import { createSafeContext } from "@synapse/hooks";
import type { EnvironmentStateSource } from "@synapse/types";
import { useMemo, useRef, useState, type ReactNode } from "react";

const [EnvironmentContext, useEnvironmentContext] =
  createSafeContext<EnvironmentStateSource>("EnvironmentProvider");

export { useEnvironmentContext };

/**
 * Owns Layer 4 environmental simulation. Ticked from FrameDriver (single rAF).
 */
export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [simulator] = useState<EnvironmentSimulator>(() => createEnvironmentSimulator());
  const simulatorRef = useRef(simulator);
  simulatorRef.current = simulator;

  const source = useMemo<EnvironmentStateSource>(
    () => ({
      read() {
        return simulatorRef.current.read();
      },
      tick(input) {
        simulatorRef.current.tick(input);
      },
    }),
    [],
  );

  return <EnvironmentContext.Provider value={source}>{children}</EnvironmentContext.Provider>;
}
