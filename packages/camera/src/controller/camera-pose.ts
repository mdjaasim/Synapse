/** Mutable 3D vector for GSAP tween targets. */
export interface MutableVec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Mutable camera pose state that GSAP can tween into. The camera controller
 * owns this object; timelines target its properties directly.
 */
export interface CameraPoseState {
  position: MutableVec3;
  target: MutableVec3;
  fov: number;
}

/** Creates a camera pose state from position, target, and fov. */
export function createCameraPoseState(
  position: { readonly x: number; readonly y: number; readonly z: number },
  target: { readonly x: number; readonly y: number; readonly z: number },
  fov: number,
): CameraPoseState {
  return {
    position: { x: position.x, y: position.y, z: position.z },
    target: { x: target.x, y: target.y, z: target.z },
    fov,
  };
}

/** Returns a read-only snapshot of the pose. */
export function snapshotPose(state: CameraPoseState): {
  readonly position: { readonly x: number; readonly y: number; readonly z: number };
  readonly target: { readonly x: number; readonly y: number; readonly z: number };
  readonly fov: number;
} {
  return {
    position: state.position,
    target: state.target,
    fov: state.fov,
  };
}
