import type { QualityPreset } from "@synapse/types";

/**
 * Shader performance tiers (Doc 27). Higher-cost shaders pick a tier and scale
 * their work; selection is driven by the Performance Store's quality preset.
 */
export const SHADER_TIERS = ["hero", "interactive", "background", "fallback"] as const;

export type ShaderTier = (typeof SHADER_TIERS)[number];

/** Maps a quality preset to the maximum shader tier that should be used. */
export function selectShaderTier(quality: QualityPreset): ShaderTier {
  switch (quality) {
    case "ultra":
    case "high":
      return "hero";
    case "balanced":
      return "interactive";
    case "low":
      return "fallback";
    default:
      return "interactive";
  }
}
