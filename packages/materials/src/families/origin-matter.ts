import * as THREE from "three";
import type { MaterialFamily } from "./material-family";
import { ORIGIN_MATTER_TOKENS } from "../tokens/material-tokens";

/**
 * Origin Matter family — the hero material of the Origin Void.
 *
 * Implemented as a native MeshPhysicalMaterial (correct lighting, transmission,
 * tone mapping, and color management for free) extended via onBeforeCompile to
 * add the shared breathing pulse and a fresnel rim glow. We inject our own
 * varyings rather than relying on three's internal ones, so the hook is robust
 * across three versions.
 */
export const ORIGIN_MATTER_FAMILY: MaterialFamily = {
  id: "origin-matter",
  create({ standard }) {
    const tokens = ORIGIN_MATTER_TOKENS;
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(tokens.color),
      emissive: new THREE.Color(tokens.emissive),
      emissiveIntensity: tokens.emissiveIntensity,
      roughness: tokens.roughness,
      metalness: 0,
      transmission: tokens.transmission,
      thickness: tokens.thickness,
      ior: tokens.ior,
      clearcoat: tokens.clearcoat,
      clearcoatRoughness: tokens.clearcoatRoughness,
      transparent: true,
    });

    const glow = new THREE.Color(tokens.glow);

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uBreath = standard.uBreath;
      shader.uniforms.uEnergy = standard.uEnergy;
      shader.uniforms.uGlowColor = { value: glow };

      shader.vertexShader =
        "uniform float uBreath;\nvarying vec3 vSynView;\nvarying vec3 vSynNormal;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          [
            "float breathScale = 1.0 + 0.004 * (uBreath - 0.5) * 2.0;",
            "vec3 transformed = position * breathScale;",
            "vSynNormal = normalize(normalMatrix * normal);",
            "vSynView = normalize(-(modelViewMatrix * vec4(transformed, 1.0)).xyz);",
          ].join("\n"),
        );

      shader.fragmentShader =
        "uniform float uBreath;\nuniform float uEnergy;\nuniform vec3 uGlowColor;\nvarying vec3 vSynView;\nvarying vec3 vSynNormal;\n" +
        shader.fragmentShader.replace(
          "#include <emissivemap_fragment>",
          [
            "#include <emissivemap_fragment>",
            "float synRim = pow(1.0 - clamp(dot(normalize(vSynNormal), normalize(vSynView)), 0.0, 1.0), 2.5);",
            "totalEmissiveRadiance += uGlowColor * synRim * (1.0 + 0.6 * uEnergy);",
            "totalEmissiveRadiance *= (0.7 + 0.3 * (uBreath - 0.5) * 2.0);",
          ].join("\n"),
        );
    };

    material.customProgramCacheKey = () => "synapse-origin-matter";
    return material;
  },
};
