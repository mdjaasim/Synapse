/**
 * Shared GLSL: fresnel / edge glow.
 *
 * Purpose: physically-inspired edge emphasis (Doc 17 "Edge Language") reused by
 * any shader needing rim light. Inputs: `vec3 normal`, `vec3 viewDir` (both in
 * the same space), `float power`. Output: `float` rim factor in [0, 1].
 * Performance: trivial (one pow, one dot); safe to call per-fragment.
 */
export const GLOW_GLSL = /* glsl */ `
float fresnel(vec3 normal, vec3 viewDir, float power){
  float f = 1.0 - clamp(dot(normalize(normal), normalize(viewDir)), 0.0, 1.0);
  return pow(f, power);
}
`;
