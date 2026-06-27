import * as THREE from "three";
import { SHADER_IDS } from "@synapse/shaders";
import type { MaterialFamily } from "./material-family";
import { DUST_TOKENS } from "../tokens/material-tokens";

/**
 * Dust family — additive ambient points driven by the dust shader preset.
 * Lightweight, GPU-animated; opts out of managed tone mapping and depth writes.
 */
export const DUST_FAMILY: MaterialFamily = {
  id: "dust",
  create({ standard, shaders }) {
    const preset = shaders.get(SHADER_IDS.DUST);
    return new THREE.ShaderMaterial({
      vertexShader: preset.vertex,
      fragmentShader: preset.fragment,
      uniforms: {
        uTime: standard.uTime,
        uTheme: standard.uTheme,
        uColor: { value: new THREE.Color(DUST_TOKENS.color) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
  },
};
