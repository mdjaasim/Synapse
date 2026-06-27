import type { DistrictId } from "@synapse/types";
import type { Mesh, Object3D } from "three";

/**
 * A Scene Object is the unit of ownership in the scene graph. Every object has
 * a stable id, the district it belongs to, and a deterministic disposer.
 *
 * Ownership chain: WorldRoot -> Scene Layer -> District -> Scene Object ->
 * Mesh -> Material -> Shader. A Scene Object owns its geometry; materials are
 * shared resources owned by the Material Factory, so disposal here releases
 * geometry only (the factory disposes materials).
 */
export interface SceneObject {
  readonly id: string;
  readonly object3d: Object3D;
  readonly districtId: DistrictId;
  dispose(): void;
}

/** Disposes every geometry under an object subtree (materials excluded). */
export function disposeGeometries(root: Object3D): void {
  root.traverse((node) => {
    const geometry = (node as Mesh).geometry;
    if (geometry) {
      geometry.dispose();
    }
  });
}

export interface CreateSceneObjectParams {
  readonly id: string;
  readonly object3d: Object3D;
  readonly districtId: DistrictId;
  readonly onDispose?: () => void;
}

/** Creates a Scene Object whose disposer releases its geometry. */
export function createSceneObject(params: CreateSceneObjectParams): SceneObject {
  const { id, object3d, districtId, onDispose } = params;
  return {
    id,
    object3d,
    districtId,
    dispose() {
      disposeGeometries(object3d);
      onDispose?.();
    },
  };
}
