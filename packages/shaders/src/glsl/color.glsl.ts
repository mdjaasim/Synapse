/**
 * Shared GLSL: color utilities.
 *
 * Purpose: small, reusable color helpers. `toSRGB` applies an approximate gamma
 * encoding for custom ShaderMaterials that opt out of the renderer's managed
 * tone-mapping pipeline (sky, dust). `saturateColor` adjusts saturation around
 * luma. Inputs/Outputs: `vec3` colors. Performance: trivial.
 */
export const COLOR_GLSL = /* glsl */ `
vec3 toSRGB(vec3 c){
  return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2));
}
vec3 saturateColor(vec3 c, float s){
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(l), c, s);
}
`;
