import { composeGlsl, COLOR_GLSL, FOG_GLSL } from "../glsl";
import { STANDARD_UNIFORMS_GLSL } from "./base.shader";
import type { ShaderPreset } from "../registry/shader-registry";
import { SHADER_IDS } from "../registry/shader-ids";

/**
 * Volumetric fog shell shader (Layer 2, Doc 19).
 *
 * Purpose: translucent inner fog sphere that modulates density with world
 * breathing and scroll progress. Shader-based — not ray-marched volumetrics.
 * Inputs: uBreath, uScroll, uDistance + uInnerColor, uOuterColor.
 * Performance: single draw call, depthWrite off, low peak opacity (~0.15).
 */
const vertex = /* glsl */ `
varying vec3 vDir;
varying float vDist;
void main(){
  vDir = normalize(position);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  COLOR_GLSL,
  FOG_GLSL,
  /* glsl */ `
varying vec3 vDir;
varying float vDist;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
void main(){
  float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uInnerColor, uOuterColor, pow(h, 1.2));
  float breathMod = (uBreath - 0.5) * 0.03;
  float scrollMod = uScroll * 0.04;
  float density = uFogDensity * (1.0 + breathMod + scrollMod);
  col = applyDepthFog(col, uOuterColor, vDist, density * 0.08);
  float alpha = clamp(density * 0.28, 0.0, 0.15);
  if (alpha < 0.005) discard;
  gl_FragColor = vec4(toSRGB(col), alpha);
}
`,
);

export const VOLUMETRIC_FOG_SHADER: ShaderPreset = {
  id: SHADER_IDS.VOLUMETRIC_FOG,
  vertex,
  fragment,
};
