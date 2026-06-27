import * as THREE from "three";
import { LIVING_FOG_FAMILY, type MaterialFactory } from "@synapse/materials";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";

/**
 * The atmosphere backdrop — a large back-side dome rendered first (renderOrder
 * well below everything) with depth writes off, so it reads as infinite sky
 * without occluding the core or dust. Frustum culling is disabled since it
 * always surrounds the camera.
 */
export function createAtmosphereField(materials: MaterialFactory): SceneObject {
  const geometry = new THREE.SphereGeometry(60, 32, 32);
  const material = materials.get(LIVING_FOG_FAMILY);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "atmosphere";
  mesh.renderOrder = -100;
  mesh.frustumCulled = false;
  return createSceneObject({ id: "origin:atmosphere", object3d: mesh, districtId: "origin" });
}
