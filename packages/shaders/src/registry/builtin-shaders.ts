import { ATMOSPHERE_SHADER } from "../shaders/atmosphere.shader";
import { DUST_SHADER } from "../shaders/dust.shader";
import { createShaderRegistry, ShaderRegistry, type ShaderPreset } from "./shader-registry";

/** All built-in Synapse shader presets registered for Phase 2. */
export const BUILTIN_SHADERS: readonly ShaderPreset[] = [ATMOSPHERE_SHADER, DUST_SHADER];

/** Creates a shader registry pre-populated with the built-in Synapse presets. */
export function createSynapseShaderRegistry(): ShaderRegistry {
  return createShaderRegistry(BUILTIN_SHADERS);
}
