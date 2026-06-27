import { createStore, type StoreApi } from "zustand/vanilla";
import type { GpuTier, PerformanceState, QualityPreset } from "@synapse/types";
import { clamp } from "@synapse/utils";

export interface PerformanceActions {
  setFps(fps: number): void;
  setGpuTier(tier: GpuTier): void;
  setQualityPreset(preset: QualityPreset): void;
  setLodBias(bias: number): void;
  setMemoryBudget(megabytes: number | null): void;
  reset(): void;
}

export type PerformanceStoreState = PerformanceState & PerformanceActions;

export type PerformanceStore = StoreApi<PerformanceStoreState>;

const INITIAL_STATE: PerformanceState = {
  fps: 60,
  gpuTier: "unknown",
  qualityPreset: "high",
  lodBias: 0,
  memoryBudgetMB: null,
};

/** Factory for a fresh performance store. Never a module-scope singleton. */
export function createPerformanceStore(): PerformanceStore {
  return createStore<PerformanceStoreState>((set) => ({
    ...INITIAL_STATE,
    setFps: (fps) => set({ fps: Math.max(0, fps) }),
    setGpuTier: (gpuTier) => set({ gpuTier }),
    setQualityPreset: (qualityPreset) => set({ qualityPreset }),
    setLodBias: (bias) => set({ lodBias: clamp(bias, 0, 4) }),
    setMemoryBudget: (memoryBudgetMB) => set({ memoryBudgetMB }),
    reset: () => set({ ...INITIAL_STATE }),
  }));
}
