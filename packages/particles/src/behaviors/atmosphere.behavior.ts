import * as THREE from "three";
import type { StandardUniforms } from "@synapse/shaders";
import { composeGlsl, COLOR_GLSL } from "@synapse/shaders";
import { STANDARD_UNIFORMS_GLSL } from "@synapse/shaders";

/**
 * Atmosphere particle vertex shader.
 * Purpose: extremely slow, sparse dust motes. Motion is barely perceptible —
 * uTime scaled to 0.012 so drift only registers after several seconds.
 * Performance: trig per vertex only; single Points draw call.
 */
export const ATMOSPHERE_VERTEX = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  /* glsl */ `
attribute float aScale;
attribute float aSeed;
varying float vAlpha;
void main(){
  vec3 p = position;
  float t = uTime * 0.012 + aSeed * 6.2831853;
  float flow = uScroll * 0.15 + uEnergy * 0.08;
  p.x += sin(t + flow) * (0.06 + uEnergy * 0.02);
  p.y += cos(t * 0.85 + flow * 0.5) * (0.05 + uBreath * 0.02);
  p.z += sin(t * 0.95 - flow) * (0.06 + uEnergy * 0.015);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.001);
  gl_PointSize = aScale * (220.0 / dist);
  gl_Position = projectionMatrix * mv;
  vAlpha = clamp(0.35 - dist * 0.018, 0.02, 0.35);
}
`,
);

export const ATMOSPHERE_FRAGMENT = composeGlsl(
  STANDARD_UNIFORMS_GLSL,
  COLOR_GLSL,
  /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  if (a < 0.008) discard;
  vec3 col = mix(uColor, uTheme, 0.35);
  gl_FragColor = vec4(toSRGB(col), a);
}
`,
);

export interface AtmosphereParticleMaterialOptions {
  readonly standard: StandardUniforms;
  readonly color?: THREE.Color;
}

/** Creates the atmosphere particle ShaderMaterial bound to shared standard uniforms. */
export function createAtmosphereParticleMaterial({
  standard,
  color = new THREE.Color("#8a9ec8"),
}: AtmosphereParticleMaterialOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: ATMOSPHERE_VERTEX,
    fragmentShader: ATMOSPHERE_FRAGMENT,
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
      uFogDensity: standard.uFogDensity,
      uTransition: standard.uTransition,
      uColor: { value: color },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}
