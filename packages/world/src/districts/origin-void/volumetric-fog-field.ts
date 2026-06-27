import * as THREE from "three";
import { VOLUMETRIC_FOG_FAMILY, type MaterialFactory } from "@synapse/materials";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";

/**
 * Inner volumetric fog shell — sits inside the sky dome (r=55 vs r=60).
 * Breath- and scroll-modulated density; depth writes off.
 */
export function createVolumetricFogField(materials: MaterialFactory): SceneObject {
  const geometry = new THREE.SphereGeometry(55, 32, 32);
  const material = materials.get(VOLUMETRIC_FOG_FAMILY);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "volumetric-fog";
  mesh.renderOrder = -50;
  mesh.frustumCulled = false;
  return createSceneObject({ id: "origin:fog", object3d: mesh, districtId: "origin" });
}
