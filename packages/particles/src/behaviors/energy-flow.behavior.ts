import * as THREE from "three";
import type { StandardUniforms } from "@synapse/shaders";
import { composeGlsl, COLOR_GLSL } from "@synapse/shaders";
import { STANDARD_UNIFORMS_GLSL } from "@synapse/shaders";

/**
 * Energy particle vertex shader.
 * Purpose: faint genesis whisper — particles drift slowly inward toward the
 * core. Barely visible; intensity scales with uScroll and uEnergy.
 * Performance: single Points draw call; motion entirely on GPU.
 */
export const ENERGY_VERTEX = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  /* glsl */ `
attribute float aScale;
attribute float aSeed;
attribute vec3 aDirection;
varying float vAlpha;
void main(){
  vec3 p = position;
  float t = uTime * 0.008 + aSeed * 6.2831853;
  float flow = uScroll * 0.3 + uEnergy * 0.1;
  p += aDirection * sin(t) * 0.04 * flow;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.001);
  gl_PointSize = aScale * (180.0 / dist);
  gl_Position = projectionMatrix * mv;
  vAlpha = clamp(0.2 - dist * 0.015, 0.01, 0.2) * flow;
}
`,
);

export const ENERGY_FRAGMENT = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  COLOR_GLSL,
  /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  if (a < 0.005) discard;
  vec3 col = mix(uColor, uTheme, 0.25);
  gl_FragColor = vec4(toSRGB(col), a);
}
`,
);

export interface EnergyParticleMaterialOptions {
  readonly standard: StandardUniforms;
  readonly color?: THREE.Color;
}

export function createEnergyParticleMaterial({
  standard,
  color = new THREE.Color("#6a7ec0"),
}: EnergyParticleMaterialOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: ENERGY_VERTEX,
    fragmentShader: ENERGY_FRAGMENT,
    uniforms: {
      uTime: standard.uTime,
      uMood: standard.uMood,
      uProgress: standard.uProgress,
      uEnergy: standard.uEnergy,
      uFocus: standard.uFocus,
      uInteraction: standard.uInteraction,
      uDistance: standard.uDistance,
      uScroll: standard.uScroll,
      uPerformance: standard.uPerformance,
      uBreath: standard.uBreath,
      uTheme: standard.uTheme,
      uColor: { value: color },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}
