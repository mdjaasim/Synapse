import * as THREE from "three";
import { ORIGIN_MATTER_FAMILY, type MaterialFactory } from "@synapse/materials";
import { createSceneObject, type SceneObject } from "../../objects/scene-object";

/**
 * The luminous Origin core — the single hero object and visual identity of the
 * void. A smooth translucent sphere using the Origin Matter material. This is
 * the first object mounted, so the first visible frame is meaningful.
 */
export function createOriginCore(materials: MaterialFactory): SceneObject {
  const geometry = new THREE.SphereGeometry(1.1, 96, 96);
  const material = materials.get(ORIGIN_MATTER_FAMILY);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "origin-core";
  mesh.renderOrder = 0;
  return createSceneObject({ id: "origin:core", object3d: mesh, districtId: "origin" });
}
