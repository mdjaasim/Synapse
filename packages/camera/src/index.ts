/**
 * @synapse/camera
 *
 * Camera state ownership. Controller, rigs, and spline paths arrive in later
 * phases; Phase 1 exposes the camera store factory.
 */

export {
  createCameraStore,
  type CameraActions,
  type CameraStore,
  type CameraStoreState,
} from "./stores/camera.store";
