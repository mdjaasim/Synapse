/**
 * Performance-domain types: GPU tier, quality presets, and the performance
 * state shape used to drive adaptive quality.
 */

export const GPU_TIERS = ["unknown", "low", "medium", "high"] as const;

export type GpuTier = (typeof GPU_TIERS)[number];

export const QUALITY_PRESETS = ["low", "balanced", "high", "ultra"] as const;

export type QualityPreset = (typeof QUALITY_PRESETS)[number];

/** Performance state. Owned by the Experience Engine runtime (Layer 3). */
export interface PerformanceState {
  readonly fps: number;
  readonly gpuTier: GpuTier;
  readonly qualityPreset: QualityPreset;
  /** Level-of-detail bias; higher means more aggressive simplification. */
  readonly lodBias: number;
  readonly memoryBudgetMB: number | null;
}
