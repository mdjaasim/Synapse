import * as THREE from "three";
import { SHADER_IDS } from "@synapse/shaders";
import type { MaterialFamily } from "./material-family";
import { ATMOSPHERE_TOKENS } from "../tokens/material-tokens";

/**
 * Living Fog family — the atmospheric backdrop (Doc 17, Material 07).
 */
export const LIVING_FOG_FAMILY: MaterialFamily = {
  id: "living-fog",
  create({ standard, shaders }) {
    const preset = shaders.get(SHADER_IDS.ATMOSPHERE);
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
        uFogDensity: standard.uFogDensity,
        uTransition: standard.uTransition,
        uHorizon: { value: new THREE.Color(ATMOSPHERE_TOKENS.horizon) },
        uZenith: { value: new THREE.Color(ATMOSPHERE_TOKENS.zenith) },
      },
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false,
    });
  },
};
