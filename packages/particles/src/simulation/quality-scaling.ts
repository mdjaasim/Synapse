import type { QualityPreset } from "@synapse/types";

/** Origin Void particle count caps — sparse by design (Doc 26 district profile). */
export const ORIGIN_VOID_PARTICLE_CAPS: Readonly<Record<QualityPreset, number>> = {
  ultra: 600,
  high: 500,
  balanced: 350,
  low: 150,
};

/** Energy particle caps — disabled on low quality. */
export const ORIGIN_VOID_ENERGY_CAPS: Readonly<Record<QualityPreset, number>> = {
  ultra: 120,
  high: 100,
  balanced: 60,
  low: 0,
};

/** Returns the active particle count for a family at a given quality preset. */
export function scaledCount(
  baseCount: number,
  quality: QualityPreset,
  caps: Record<QualityPreset, number>,
): number {
  const cap = caps[quality];
  return Math.min(baseCount, cap);
}
