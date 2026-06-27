import * as THREE from "three";
import { SHADER_IDS } from "@synapse/shaders";
import type { MaterialFamily } from "./material-family";
import { VOLUMETRIC_FOG_TOKENS } from "../tokens/material-tokens";

/**
 * Volumetric Fog family — inner translucent fog shell (Doc 17, Material 08).
 *
 * Renders inside the sky dome with depth writes off. Density is driven by
 * uBreath and uScroll via the volumetric fog shader preset.
 */
export const VOLUMETRIC_FOG_FAMILY: MaterialFamily = {
  id: "volumetric-fog",
  create({ standard, shaders }) {
    const preset = shaders.get(SHADER_IDS.VOLUMETRIC_FOG);
    return new THREE.ShaderMaterial({
      vertexShader: preset.vertex,
      fragmentShader: preset.fragment,
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
        uInnerColor: { value: new THREE.Color(VOLUMETRIC_FOG_TOKENS.inner) },
        uOuterColor: { value: new THREE.Color(VOLUMETRIC_FOG_TOKENS.outer) },
        uFogDensity: { value: VOLUMETRIC_FOG_TOKENS.density },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      toneMapped: false,
    });
  },
};
