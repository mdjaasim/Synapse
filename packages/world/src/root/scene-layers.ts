import * as THREE from "three";

/**
 * Scene layers (Doc 16 "World Layers"). The world root contains exactly these
 * layer groups; every object lives under one of them so nothing is orphaned.
 */
export const SCENE_LAYERS = ["sky", "atmosphere", "districts", "effects", "lighting"] as const;

export type SceneLayerName = (typeof SCENE_LAYERS)[number];

export type SceneLayers = Readonly<Record<SceneLayerName, THREE.Group>>;

/** Creates the fixed set of named layer groups. */
export function createSceneLayers(): SceneLayers {
  const entries = SCENE_LAYERS.map((name) => {
    const group = new THREE.Group();
    group.name = `layer:${name}`;
    return [name, group] as const;
  });
  return Object.fromEntries(entries) as SceneLayers;
}
