/**
 * Material tokens: the per-family appearance constants (colors, surface params).
 * Centralized so material identity stays consistent and is never hardcoded
 * inside scene objects.
 */

export interface OriginMatterTokens {
  readonly color: string;
  readonly emissive: string;
  readonly glow: string;
  readonly emissiveIntensity: number;
  readonly roughness: number;
  readonly transmission: number;
  readonly thickness: number;
  readonly ior: number;
  readonly clearcoat: number;
  readonly clearcoatRoughness: number;
}

/** Origin Matter: soft, translucent, faint inner glow (Doc 17, Material 01). */
export const ORIGIN_MATTER_TOKENS: OriginMatterTokens = {
  color: "#161d36",
  emissive: "#26356b",
  glow: "#7aa2ff",
  emissiveIntensity: 1.1,
  roughness: 0.12,
  transmission: 0.65,
  thickness: 1.6,
  ior: 1.35,
  clearcoat: 0.5,
  clearcoatRoughness: 0.25,
};

export interface AtmosphereTokens {
  readonly horizon: string;
  readonly zenith: string;
}

/** Living Fog backdrop: cool, near-black gradient for the Origin Void. */
export const ATMOSPHERE_TOKENS: AtmosphereTokens = {
  horizon: "#0a0e1c",
  zenith: "#02030a",
};

export interface DustTokens {
  readonly color: string;
}

/** Ambient dust tint. */
export const DUST_TOKENS: DustTokens = {
  color: "#9ab4ff",
};
