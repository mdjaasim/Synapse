import type { QualityPreset } from "@synapse/types";

/** Device pixel ratio clamp for a given quality preset. */
export function dprForQuality(quality: QualityPreset): [number, number] {
  switch (quality) {
    case "ultra":
    case "high":
      return [1, 2];
    case "balanced":
      return [1, 1.5];
    case "low":
      return [1, 1];
    default:
      return [1, 1.5];
  }
}

export interface EffectFlags {
  readonly bloom: boolean;
  readonly vignette: boolean;
  readonly smaa: boolean;
}

/** Which post-processing effects to enable for a given quality preset. */
export function effectsForQuality(quality: QualityPreset): EffectFlags {
  switch (quality) {
    case "ultra":
    case "high":
      return { bloom: true, vignette: true, smaa: true };
    case "balanced":
      return { bloom: true, vignette: true, smaa: false };
    case "low":
      return { bloom: false, vignette: true, smaa: false };
    default:
      return { bloom: true, vignette: true, smaa: false };
  }
}
