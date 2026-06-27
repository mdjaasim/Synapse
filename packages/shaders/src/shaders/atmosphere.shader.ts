import { composeGlsl, COLOR_GLSL, NOISE_GLSL } from "../glsl";
import { STANDARD_UNIFORMS_GLSL } from "./base.shader";
import type { ShaderPreset } from "../registry/shader-registry";
import { SHADER_IDS } from "../registry/shader-ids";

/**
 * Atmosphere (sky gradient) shader.
 *
 * Purpose: renders the Origin Void backdrop as a calm vertical gradient with a
 * faint themed horizon glow and almost-imperceptible grain, on a large
 * back-side dome.
 * Inputs: standard uniforms (reads uTime, uTheme) + `uHorizon`, `uZenith`
 * colors. Vertex attribute: position (dome). Varyings: vDir (object-space dir).
 * Outputs: opaque gradient color (manual sRGB; this material opts out of the
 * managed tone-mapping pipeline via toneMapped=false).
 * Performance: one fbm call per fragment at low frequency; dome is a single
 * draw call with depthWrite off. Cheap.
 */
const vertex = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  COLOR_GLSL,
  NOISE_GLSL,
  /* glsl */ `
varying vec3 vDir;
uniform vec3 uHorizon;
uniform vec3 uZenith;
void main(){
  float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(h, 1.5));
  float band = smoothstep(0.55, 0.0, abs(vDir.y));
  col += uTheme * band * (0.05 + uScroll * 0.004);
  col += (fbm(vDir * 3.0 + uTime * 0.015) - 0.5) * 0.012;
  gl_FragColor = vec4(toSRGB(col), 1.0);
}
`,
);

export const ATMOSPHERE_SHADER: ShaderPreset = {
  id: SHADER_IDS.ATMOSPHERE,
  vertex,
  fragment,
};
