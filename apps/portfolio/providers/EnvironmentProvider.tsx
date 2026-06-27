"use client";

import { createEnvironmentSimulator, type EnvironmentSimulator } from "@synapse/world";
import { createSafeContext } from "@synapse/hooks";
import type { EnvironmentStateSource } from "@synapse/types";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useExperienceContext } from "./ExperienceProvider";
import { useStoresContext } from "./StoresProvider";

const [EnvironmentContext, useEnvironmentContext] =
  createSafeContext<EnvironmentStateSource>("EnvironmentProvider");

export { useEnvironmentContext };

/**
 * Owns Layer 4 environmental simulation. Ticks deterministically on rAF,
 * independent of React renders. Exposes read-only snapshots via context.
 */
export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const experienceEngine = useExperienceContext();
  const { settings } = useStoresContext();

  const [simulator] = useState<EnvironmentSimulator>(() => createEnvironmentSimulator());
  const simulatorRef = useRef(simulator);
  simulatorRef.current = simulator;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number): void => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      const scroll = experienceEngine.stores.experience.getState().storyProgress;
      const reducedMotion = settings.getState().reducedMotion;
      simulatorRef.current.tick({ delta, scroll, reducedMotion });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      simulatorRef.current.dispose();
    };
  }, [experienceEngine, settings]);

  const source = useMemo<EnvironmentStateSource>(
    () => ({
      read() {
        return simulatorRef.current.read();
      },
    }),
    [],
  );

  return <EnvironmentContext.Provider value={source}>{children}</EnvironmentContext.Provider>;
}
