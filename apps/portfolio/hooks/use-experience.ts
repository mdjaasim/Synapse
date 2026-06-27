"use client";

import type {
  ExperienceEngine,
  ExperienceStoreState,
  PerformanceStoreState,
} from "@synapse/engine";
import { useStore } from "zustand";
import { useExperienceContext } from "../providers/ExperienceProvider";
import { usePerformanceContext } from "../providers/PerformanceProvider";

/** Returns the active Experience Engine instance. */
export function useExperience(): ExperienceEngine {
  return useExperienceContext();
}

/** Subscribes to a slice of experience state. */
export function useExperienceStore<T>(selector: (state: ExperienceStoreState) => T): T {
  const engine = useExperienceContext();
  return useStore(engine.stores.experience, selector);
}

/** Subscribes to a slice of performance state. */
export function usePerformanceStore<T>(selector: (state: PerformanceStoreState) => T): T {
  const store = usePerformanceContext();
  return useStore(store, selector);
}
