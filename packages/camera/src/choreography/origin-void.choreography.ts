import { ORIGIN_VOID_CAMERA } from "../rig/camera-presets";
import type { CameraPoseState } from "../controller/camera-pose";

/**
 * Declarative scroll-driven camera choreography for the Origin Void.
 * Returns a timeline-compatible definition object; the app passes it to
 * AnimationEngine.register() which accepts TimelineDefinition.
 */
export function createOriginVoidCameraChoreography(narrativePose: CameraPoseState) {
  const start = ORIGIN_VOID_CAMERA;

  return {
    id: "origin-void:camera-scroll",
    name: "Origin Void Camera Scroll",
    category: "camera" as const,
    owner: "origin-void",
    duration: "narrative" as const,
    priority: 1,
    interruptible: true,
    reversible: true,
    performanceCost: "low" as const,
    scrollBound: true,
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
          "position.x": 1.2,
          "position.y": 1.4,
          "position.z": 4.2,
          "target.x": 0,
          "target.y": 0.2,
          "target.z": 0,
          fov: 38,
        },
        duration: "narrative" as const,
        ease: "cinematic" as const,
      },
      {
        props: {
          "position.x": -0.8,
          "position.y": 0.3,
          "position.z": 7.5,
          "target.x": 0,
          "target.y": 0,
          "target.z": 0,
          fov: 42,
        },
        duration: "narrative" as const,
        ease: "soft" as const,
      },
    ],
  };
}
