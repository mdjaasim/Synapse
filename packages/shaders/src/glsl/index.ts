/**
 * Shared GLSL module registry. Shaders compose these reusable chunks instead of
 * duplicating GLSL logic (Doc 27 "Shared GLSL Modules").
 */

export { NOISE_GLSL } from "./noise.glsl";
export { GLOW_GLSL } from "./glow.glsl";
export { FOG_GLSL } from "./fog.glsl";
export { COLOR_GLSL } from "./color.glsl";

/** Concatenates GLSL chunks in order, separated by newlines. */
export function composeGlsl(...chunks: readonly string[]): string {
  return chunks.join("\n");
}
