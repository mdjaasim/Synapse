import { composeGlsl, COLOR_GLSL } from "../glsl";
import { STANDARD_UNIFORMS_GLSL } from "./base.shader";
import type { ShaderPreset } from "../registry/shader-registry";
import { SHADER_IDS } from "../registry/shader-ids";

/**
 * Ambient dust shader (GL_POINTS).
 *
 * Purpose: an extremely lightweight, fully GPU-driven ambient field so the void
 * never feels static. Deterministic per-point drift derived from a seed and
 * uTime — no CPU simulation, no Particle Engine (that is Phase 4).
 * Inputs: standard uniforms (reads uTime, uTheme) + `uColor`. Attributes:
 * position, aScale, aSeed. Varyings: vAlpha.
 * Outputs: soft additive sprite (manual sRGB; toneMapped=false).
 * Performance: motion is a few trig ops per vertex; fragment is a smoothstep
 * disc with early discard. Additive, depthWrite off. Very cheap.
 */
const vertex = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  /* glsl */ `
attribute float aScale;
attribute float aSeed;
varying float vAlpha;
void main(){
  vec3 p = position;
  float t = uTime * 0.05 + aSeed * 6.2831853;
  p.x += sin(t) * 0.15;
  p.y += cos(t * 0.9) * 0.12;
  p.z += sin(t * 1.1) * 0.15;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.001);
  gl_PointSize = aScale * (260.0 / dist);
  gl_Position = projectionMatrix * mv;
  vAlpha = clamp(0.55 - dist * 0.02, 0.04, 0.55);
}
`,
);

const fragment = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  COLOR_GLSL,
  /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  if (a < 0.01) discard;
  vec3 col = mix(uColor, uTheme, 0.5);
  gl_FragColor = vec4(toSRGB(col), a);
}
`,
);

export const DUST_SHADER: ShaderPreset = {
  id: SHADER_IDS.DUST,
  vertex,
  fragment,
};
