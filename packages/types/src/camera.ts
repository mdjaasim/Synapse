/**
 * Camera-domain types: a minimal vector type and the camera state shape.
 */

export interface Vec3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export const CAMERA_TRANSITIONS = ["idle", "moving", "cinematic"] as const;

export type CameraTransition = (typeof CAMERA_TRANSITIONS)[number];

/** Camera state. Owned by @synapse/camera (consumed by the renderer later). */
export interface CameraState {
  readonly position: Vec3;
  readonly target: Vec3;
  readonly transition: CameraTransition;
  readonly activeCinematicId: string | null;
}
