import type { Vec3 } from "@synapse/types";

/** A static camera framing: where the camera sits, what it looks at, and fov. */
export interface CameraPreset {
  readonly position: Vec3;
  readonly target: Vec3;
  readonly fov: number;
}

/** Origin Void framing: calm, slightly elevated, looking at the core. */
export const ORIGIN_VOID_CAMERA: CameraPreset = {
  position: { x: 0, y: 0.6, z: 6 },
  target: { x: 0, y: 0, z: 0 },
  fov: 42,
};
