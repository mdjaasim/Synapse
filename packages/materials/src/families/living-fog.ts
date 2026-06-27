import * as THREE from "three";
import { SHADER_IDS } from "@synapse/shaders";
import type { MaterialFamily } from "./material-family";
import { ATMOSPHERE_TOKENS } from "../tokens/material-tokens";

/**
 * Living Fog family — the atmospheric backdrop (Doc 17, Material 07).
 *
 * A back-side gradient dome driven by the atmosphere shader preset. Opts out of
 * managed tone mapping (handles its own sRGB) and disables depth writes so it
 * never occludes scene geometry.
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
        uTheme: standard.uTheme,
        uHorizon: { value: new THREE.Color(ATMOSPHERE_TOKENS.horizon) },
        uZenith: { value: new THREE.Color(ATMOSPHERE_TOKENS.zenith) },
      },
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false,
    });
  },
};
