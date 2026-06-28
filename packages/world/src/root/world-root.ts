import * as THREE from "three";
import { createSceneLayers, type SceneLayerName, type SceneLayers } from "./scene-layers";
import type { SceneObject } from "../objects/scene-object";

/**
 * The World Root owns the top of the scene graph: one group containing the
 * fixed layer groups. Objects are added into a specific layer and tracked for
 * deterministic disposal. The renderer mounts `group` via `<primitive>`.
 */
export class WorldRoot {
  readonly group: THREE.Group;
  readonly layers: SceneLayers;
  readonly #objects = new Map<string, { object: SceneObject; layer: SceneLayerName }>();

  constructor() {
    this.group = new THREE.Group();
    this.group.name = "world-root";
    this.layers = createSceneLayers();
    for (const layer of Object.values(this.layers)) {
      this.group.add(layer);
    }
  }

  add(object: SceneObject, layer: SceneLayerName): void {
    this.layers[layer].add(object.object3d);
    this.#objects.set(object.id, { object, layer });
  }

  /** Removes from the scene graph without disposing — for district unmount. */
  detach(id: string): void {
    const entry = this.#objects.get(id);
    if (!entry) {
      return;
    }
    this.layers[entry.layer].remove(entry.object.object3d);
    this.#objects.delete(id);
  }

  remove(id: string): void {
    const entry = this.#objects.get(id);
    if (!entry) {
      return;
    }
    this.layers[entry.layer].remove(entry.object.object3d);
    entry.object.dispose();
    this.#objects.delete(id);
  }

  dispose(): void {
    for (const { object, layer } of this.#objects.values()) {
      this.layers[layer].remove(object.object3d);
      object.dispose();
    }
    this.#objects.clear();
  }
}

export function createWorldRoot(): WorldRoot {
  return new WorldRoot();
}
