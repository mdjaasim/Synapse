/**
 * @synapse/materials
 *
 * Material "personalities": the Material Factory plus the Phase 2 family
 * presets (Origin Matter, Living Fog, Dust) and their tokens. Framework-light
 * (three.js + @synapse/shaders only; no React).
 */

export { MaterialFactory, createMaterialFactory } from "./factory/material-factory";
export type { MaterialFamily, MaterialFamilyContext } from "./families/material-family";
export { ORIGIN_MATTER_FAMILY } from "./families/origin-matter";
export { LIVING_FOG_FAMILY } from "./families/living-fog";
export { VOLUMETRIC_FOG_FAMILY } from "./families/volumetric-fog";
export { DUST_FAMILY } from "./families/dust";
export { MATERIAL_FAMILIES } from "./families/material-families";

export {
  ORIGIN_MATTER_TOKENS,
  ATMOSPHERE_TOKENS,
  DUST_TOKENS,
  VOLUMETRIC_FOG_TOKENS,
  type OriginMatterTokens,
  type AtmosphereTokens,
  type DustTokens,
  type VolumetricFogTokens,
} from "./tokens/material-tokens";
