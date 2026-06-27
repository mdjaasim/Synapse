/**
 * Base shader foundation.
 *
 * Purpose: the shared GLSL header every Synapse ShaderMaterial includes. It
 * declares the standardized global uniforms (Doc 27) so the Experience Engine
 * can influence the whole universe coherently through one update path.
 *
 * Inputs (uniforms), updated once per frame by the UniformManager:
 *   uTime, uMood, uProgress, uEnergy, uFocus, uInteraction, uDistance,
 *   uScroll, uPerformance, uTheme.
 * Outputs: none (declarations only).
 * Performance: declarations only; zero runtime cost. Shaders enable only the
 * uniforms they actually read.
 */
export const STANDARD_UNIFORMS_GLSL = /* glsl */ `
uniform float uTime;
uniform float uMood;
uniform float uProgress;
uniform float uEnergy;
uniform float uFocus;
uniform float uInteraction;
uniform float uDistance;
uniform float uScroll;
uniform float uPerformance;
uniform vec3 uTheme;
`;

/** Ordered list of the standardized global uniform names. */
export const STANDARD_UNIFORM_NAMES = [
  "uTime",
  "uMood",
  "uProgress",
  "uEnergy",
  "uFocus",
  "uInteraction",
  "uDistance",
  "uScroll",
  "uPerformance",
  "uTheme",
] as const;

export type StandardUniformName = (typeof STANDARD_UNIFORM_NAMES)[number];
