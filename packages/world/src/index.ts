/**
 * @synapse/world
 *
 * The scene graph and districts: world root + layers, scene-object ownership,
 * the district manager, and the Origin Void district. Framework-light
 * (three.js + @synapse/materials only; no React).
 */

export {
  createSceneObject,
  disposeGeometries,
  type SceneObject,
  type CreateSceneObjectParams,
} from "./objects/scene-object";
export {
  SCENE_LAYERS,
  createSceneLayers,
  type SceneLayerName,
  type SceneLayers,
} from "./root/scene-layers";
export { WorldRoot, createWorldRoot } from "./root/world-root";

export type { District, DistrictContext, DistrictMetadata } from "./districts/district";
export { DistrictManager, type DistrictManagerOptions } from "./districts/district-manager";
export {
  createOriginVoidDistrict,
  type OriginVoidDistrict,
} from "./districts/origin-void/origin-void.district";
export { createOriginCore } from "./districts/origin-void/origin-core";
export { createAtmosphereField } from "./districts/origin-void/atmosphere-field";
export { createDustField, type DustFieldOptions } from "./districts/origin-void/dust-field";
