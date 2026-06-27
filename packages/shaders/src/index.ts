/**
 * @synapse/shaders
 *
 * GPU rendering framework: the shader registry, standardized uniforms, the
 * per-frame uniform manager, reusable GLSL modules, built-in shader presets,
 * and performance tiers. Framework-light (three.js only; no React).
 */

export {
  ShaderRegistry,
  createShaderRegistry,
  type ShaderPreset,
} from "./registry/shader-registry";
export { SHADER_IDS, type ShaderId } from "./registry/shader-ids";
export { BUILTIN_SHADERS, createSynapseShaderRegistry } from "./registry/builtin-shaders";

export {
  createStandardUniforms,
  type StandardUniforms,
  type StandardUniformsOptions,
} from "./uniforms/standard-uniforms";
export {
  UniformManager,
  createUniformManager,
  type UniformUpdateInput,
  type UniformManagerOptions,
} from "./uniforms/uniform-manager";

export {
  STANDARD_UNIFORMS_GLSL,
  STANDARD_UNIFORM_NAMES,
  type StandardUniformName,
} from "./shaders/base.shader";
export { ATMOSPHERE_SHADER } from "./shaders/atmosphere.shader";
export { DUST_SHADER } from "./shaders/dust.shader";
export { VOLUMETRIC_FOG_SHADER } from "./shaders/volumetric-fog.shader";

export { composeGlsl, NOISE_GLSL, GLOW_GLSL, FOG_GLSL, COLOR_GLSL } from "./glsl";

export { SHADER_TIERS, selectShaderTier, type ShaderTier } from "./performance/tiers";
