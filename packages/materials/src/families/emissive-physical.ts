import * as THREE from "three";
import type { MaterialFamily } from "./material-family";

export interface EmissivePhysicalTokens {
  readonly color: string;
  readonly emissive: string;
  readonly glow: string;
  readonly emissiveIntensity: number;
  readonly roughness: number;
  readonly transmission: number;
  readonly thickness: number;
  readonly metalness?: number;
}

/** Creates a reusable emissive physical material family with breathing pulse. */
export function createEmissivePhysicalFamily(
  id: string,
  tokens: EmissivePhysicalTokens,
): MaterialFamily {
  return {
    id,
    create({ standard }) {
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(tokens.color),
        emissive: new THREE.Color(tokens.emissive),
        emissiveIntensity: tokens.emissiveIntensity,
        roughness: tokens.roughness,
        metalness: tokens.metalness ?? 0.1,
        transmission: tokens.transmission,
        thickness: tokens.thickness,
        transparent: tokens.transmission > 0,
      });

      const glow = new THREE.Color(tokens.glow);

      material.onBeforeCompile = (shader) => {
        shader.uniforms.uBreath = standard.uBreath;
        shader.uniforms.uEnergy = standard.uEnergy;
        shader.uniforms.uScroll = standard.uScroll;
        shader.uniforms.uGlowColor = { value: glow };

        shader.vertexShader =
          "uniform float uBreath;\nvarying vec3 vSynView;\nvarying vec3 vSynNormal;\n" +
          shader.vertexShader.replace(
            "#include <begin_vertex>",
            [
              "float breathScale = 1.0 + 0.003 * (uBreath - 0.5) * 2.0;",
              "vec3 transformed = position * breathScale;",
              "vSynNormal = normalize(normalMatrix * normal);",
              "vSynView = normalize(-(modelViewMatrix * vec4(transformed, 1.0)).xyz);",
            ].join("\n"),
          );

        shader.fragmentShader =
          "uniform float uBreath;\nuniform float uEnergy;\nuniform float uScroll;\nuniform vec3 uGlowColor;\nvarying vec3 vSynView;\nvarying vec3 vSynNormal;\n" +
          shader.fragmentShader.replace(
            "#include <emissivemap_fragment>",
            [
              "#include <emissivemap_fragment>",
              "float synRim = pow(1.0 - clamp(dot(normalize(vSynNormal), normalize(vSynView)), 0.0, 1.0), 2.0);",
              "totalEmissiveRadiance += uGlowColor * synRim * (0.8 + 0.5 * uEnergy);",
              "totalEmissiveRadiance *= (0.75 + 0.25 * (uBreath - 0.5) * 2.0);",
              "totalEmissiveRadiance *= (0.94 + uScroll * 0.06);",
            ].join("\n"),
          );
      };

      material.customProgramCacheKey = () => `synapse-${id}`;
      return material;
    },
  };
}
