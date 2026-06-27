/**
 * Shared GLSL: depth fog.
 *
 * Purpose: distance-based atmospheric fade reused across shaders for depth.
 * Inputs: `vec3 color`, `vec3 fogColor`, `float dist` (view distance),
 * `float density`. Output: fogged `vec3`. Performance: trivial.
 */
export const FOG_GLSL = /* glsl */ `
vec3 applyDepthFog(vec3 color, vec3 fogColor, float dist, float density){
  float f = 1.0 - exp(-density * density * dist * dist);
  return mix(color, fogColor, clamp(f, 0.0, 1.0));
}
`;
