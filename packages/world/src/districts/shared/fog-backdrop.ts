import * as THREE from "three";
import type { DistrictId } from "@synapse/types";
import { LIVING_FOG_FAMILY, type MaterialFactory } from "@synapse/materials";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";
import { getMaterial } from "./create-animated-district";

/** Per-district atmosphere dome colors — premium cinematic palettes. */
const DISTRICT_ATMOSPHERE: Record<string, { horizon: string; zenith: string }> = {
  origin: { horizon: "#0a1020", zenith: "#020308" },
  "project-galaxy": { horizon: "#1a1035", zenith: "#050210" },
  "client-worlds": { horizon: "#121820", zenith: "#040608" },
  "engineering-core": { horizon: "#0e1418", zenith: "#030508" },
  "knowledge-forest": { horizon: "#0a1810", zenith: "#020604" },
  "ai-observatory": { horizon: "#101828", zenith: "#030510" },
  "memory-stream": { horizon: "#140818", zenith: "#040208" },
};

export function fogBackdrop(
  materials: MaterialFactory,
  districtId: DistrictId,
  radius: number,
): SceneObject {
  const colors = DISTRICT_ATMOSPHERE[districtId] ?? { horizon: "#0a1020", zenith: "#020308" };
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const mesh = new THREE.Mesh(geometry, getMaterial(materials, LIVING_FOG_FAMILY));
  const mat = mesh.material as THREE.ShaderMaterial;
  if (mat.uniforms.uHorizon) {
    (mat.uniforms.uHorizon.value as THREE.Color).set(colors.horizon);
  }
  if (mat.uniforms.uZenith) {
    (mat.uniforms.uZenith.value as THREE.Color).set(colors.zenith);
  }
  mesh.renderOrder = -50;
  mesh.frustumCulled = false;
  return createSceneObject({
    id: `district:${districtId}:backdrop`,
    object3d: mesh,
    districtId,
    onDispose: () => geometry.dispose(),
  });
}
