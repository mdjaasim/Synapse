import * as THREE from "three";
import type { DistrictId } from "@synapse/types";
import { LIVING_FOG_FAMILY, type MaterialFactory } from "@synapse/materials";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";
import { getMaterial } from "./create-animated-district";

export function fogBackdrop(
  materials: MaterialFactory,
  districtId: DistrictId,
  radius: number,
): SceneObject {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const mesh = new THREE.Mesh(geometry, getMaterial(materials, LIVING_FOG_FAMILY));
  mesh.renderOrder = -50;
  mesh.frustumCulled = false;
  return createSceneObject({
    id: `district:${districtId}:backdrop`,
    object3d: mesh,
    districtId,
    onDispose: () => geometry.dispose(),
  });
}
