/**
 * @synapse/world
 *
 * The scene graph and districts: world root + layers, scene-object ownership,
 * the district framework, environmental simulation, and district modules.
 * Framework-light (three.js + @synapse/materials only; no React).
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

export type {
  BaseDistrict,
  DistrictContext,
  DistrictFactory,
  DistrictRegistration,
  DistrictAnimationContext,
  DistrictInteractionContext,
} from "./districts/base-district";
export { createDistrictManifest } from "./districts/district-manifest";
export { createStubDistrict, createStubDistrictFactory } from "./districts/stub-district";
export { DistrictRegistry, createDistrictRegistry } from "./districts/district-registry";
export { bootstrapDistrictRegistry } from "./districts/district-registry.bootstrap";
export { DistrictLifecycle, createDistrictLifecycle } from "./districts/district-lifecycle";
export { DistrictState, createDistrictState } from "./districts/district-state";
export {
  DistrictResourceManager,
  createDistrictResourceManager,
} from "./districts/district-resource-manager";
export { DistrictLoader, createDistrictLoader } from "./districts/district-loader";
export { DistrictManager, createDistrictManager } from "./districts/district-manager";
export {
  DistrictTransitionManager,
  createDistrictTransitionManager,
} from "./districts/district-transition-manager";
export { DistrictEventBridge, createDistrictEventBridge } from "./districts/district-event-bridge";
export {
  DistrictController,
  createDistrictController,
  type DistrictCameraAdapter,
  type DistrictControllerOptions,
} from "./districts/district-controller";
export {
  TransitionRegistry,
  createTransitionRegistry,
} from "./districts/transitions/transition-registry";

export {
  createOriginVoidDistrict,
  ORIGIN_VOID_MANIFEST,
  ORIGIN_VOID_REGISTRATION,
  type OriginVoidDistrict,
} from "./districts/origin-void/origin-void.district";
export { createOriginCore } from "./districts/origin-void/origin-core";
export { createAtmosphereField } from "./districts/origin-void/atmosphere-field";
export { createVolumetricFogField } from "./districts/origin-void/volumetric-fog-field";

export {
  EnvironmentSimulator,
  createEnvironmentSimulator,
  type EnvironmentSimulatorInput,
} from "./simulation/environment-simulator";
export { WorldBreathing } from "./simulation/world-breathing";
export { applyAtmosphericDrift } from "./simulation/atmospheric-drift";
export {
  createMutableEnvironmentalState,
  snapshotEnvironment,
  type MutableEnvironmentalState,
} from "./simulation/environmental-state";
