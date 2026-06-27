/**
 * @synapse/camera
 *
 * Camera ownership: the camera store plus the deterministic camera rig and
 * framing presets. Framework-light (no three.js, no React); the renderer
 * applies the rig's computed pose to the actual camera.
 */

export {
  createCameraStore,
  type CameraActions,
  type CameraStore,
  type CameraStoreState,
} from "./stores/camera.store";
export {
  CameraRig,
  createCameraRig,
  type CameraPose,
  type CameraRigOptions,
} from "./rig/camera-rig";
export { ORIGIN_VOID_CAMERA, type CameraPreset } from "./rig/camera-presets";
export {
  createCameraPoseState,
  snapshotPose,
  type CameraPoseState,
} from "./controller/camera-pose";
export {
  CameraController,
  createCameraController,
  type CameraControllerOptions,
} from "./controller/camera-controller";
export { createOriginVoidCameraChoreography } from "./choreography/origin-void.choreography";
