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
  createDistrictCameraAdapter,
  type CameraControllerOptions,
  type SavedCameraPose,
} from "./controller/camera-controller";
export { createOriginVoidCameraChoreography } from "./choreography/origin-void.choreography";
export {
  createDistrictCameraChoreography,
  type DistrictCameraKeyframe,
} from "./choreography/district-choreography";
export {
  createDistrictScrollChoreography,
  registerAllDistrictChoreographies,
} from "./choreography/district-choreographies";
export { primaryCameraTarget, cameraPresetFromManifest } from "./profiles/district-camera-profiles";
export {
  CAMERA_TRANSITION_PROFILES,
  getCameraTransitionProfile,
  type CameraTransitionProfileId,
} from "./transition/camera-transition-profiles";
export {
  CameraFlightController,
  createCameraFlightController,
  type CameraFlightState,
} from "./flight/camera-flight-controller";
export type { CameraFlightPlan, CameraCheckpoint } from "./flight/camera-flight-plan";
