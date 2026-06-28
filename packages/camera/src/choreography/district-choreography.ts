import type { CameraPoseState } from "../controller/camera-pose";

export interface DistrictCameraKeyframe {
  readonly position: { readonly x: number; readonly y: number; readonly z: number };
  readonly target: { readonly x: number; readonly y: number; readonly z: number };
  readonly fov: number;
}

/** Declarative district scroll choreography — scrubbed by SceneDirector via node-local progress. */
export function createDistrictCameraChoreography(
  districtId: string,
  narrativePose: CameraPoseState,
  start: DistrictCameraKeyframe,
  end: DistrictCameraKeyframe,
) {
  return {
    id: `${districtId}:camera-scroll`,
    name: `${districtId} Camera Scroll`,
    category: "camera" as const,
    owner: districtId,
    duration: "narrative" as const,
    priority: 1,
    interruptible: true,
    reversible: true,
    performanceCost: "low" as const,
    scrollBound: false,
    target: narrativePose as unknown as Record<string, unknown>,
    keyframes: [
      {
        props: {
          "position.x": start.position.x,
          "position.y": start.position.y,
          "position.z": start.position.z,
          "target.x": start.target.x,
          "target.y": start.target.y,
          "target.z": start.target.z,
          fov: start.fov,
        },
        duration: 0,
      },
      {
        props: {
          "position.x": end.position.x,
          "position.y": end.position.y,
          "position.z": end.position.z,
          "target.x": end.target.x,
          "target.y": end.target.y,
          "target.z": end.target.z,
          fov: end.fov,
        },
        duration: "narrative" as const,
        ease: "cinematic" as const,
      },
    ],
  };
}
