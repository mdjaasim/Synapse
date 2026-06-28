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
      return { bloom: true, vignette: true, smaa: true };
    case "low":
      return { bloom: true, vignette: true, smaa: false };
    default:
      return { bloom: true, vignette: true, smaa: false };
  }
}

const QUALITY_ORDER: readonly QualityPreset[] = ["low", "balanced", "high", "ultra"];

/** Per-district bloom intensity — premium look preserved at high tiers. */
export const DISTRICT_BLOOM: Record<string, number> = {
  origin: 0.45,
  "project-galaxy": 0.52,
  "client-worlds": 0.42,
  "engineering-core": 0.28,
  "knowledge-forest": 0.38,
  "ai-observatory": 0.32,
  "memory-stream": 0.4,
};

export function bloomIntensityForDistrict(districtId: string | null): number {
  if (!districtId) {
    return 0.45;
  }
  return DISTRICT_BLOOM[districtId] ?? 0.45;
}

export interface AdaptiveQualityInput {
  readonly fps: number;
  readonly current: QualityPreset;
  readonly lowSamples: number;
  readonly highSamples: number;
}

export interface AdaptiveQualityResult {
  readonly preset: QualityPreset;
  readonly lowSamples: number;
  readonly highSamples: number;
}

/**
 * Hysteresis quality controller — downgrades only after sustained low FPS,
 * upgrades after sustained stability. Never removes bloom at balanced+.
 */
export function evaluateAdaptiveQuality({
  fps,
  current,
  lowSamples,
  highSamples,
}: AdaptiveQualityInput): AdaptiveQualityResult {
  const idx = QUALITY_ORDER.indexOf(current);
  let next = current;
  let nextLow = lowSamples;
  let nextHigh = highSamples;

  if (fps > 0 && fps < 42) {
    nextLow += 1;
    nextHigh = 0;
    if (nextLow >= 4 && idx > 0) {
      next = QUALITY_ORDER[idx - 1] ?? "low";
      nextLow = 0;
    }
  } else if (fps >= 54) {
    nextHigh += 1;
    nextLow = 0;
    if (nextHigh >= 8 && idx < QUALITY_ORDER.length - 1) {
      next = QUALITY_ORDER[idx + 1] ?? "ultra";
      nextHigh = 0;
    }
  } else {
    nextLow = Math.max(0, nextLow - 1);
    nextHigh = Math.max(0, nextHigh - 1);
  }

  return { preset: next, lowSamples: nextLow, highSamples: nextHigh };
}
