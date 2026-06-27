import type { CameraPreset } from "../rig/camera-presets";
import { CameraRig, type CameraRigOptions } from "../rig/camera-rig";
import { createCameraPoseState, snapshotPose, type CameraPoseState } from "./camera-pose";

export interface CameraControllerOptions {
  readonly preset: CameraPreset;
  readonly rigOptions?: CameraRigOptions;
}

/**
 * Composes ambient drift (CameraRig) with a narrative pose (GSAP-driven).
 * The renderer reads the final composed pose each frame. Animation timelines
 * tween `narrativePose` — never the three.js camera directly.
 */
export class CameraController {
  readonly narrativePose: CameraPoseState;
  readonly #rig: CameraRig;
  readonly #composed: CameraPoseState;

  constructor({ preset, rigOptions }: CameraControllerOptions) {
    this.#rig = new CameraRig(preset, rigOptions);
    this.narrativePose = createCameraPoseState(preset.position, preset.target, preset.fov);
    this.#composed = createCameraPoseState(preset.position, preset.target, preset.fov);
  }

  /**
   * Advances ambient drift and composes the final pose. When reduced motion
   * is active, ambient drift is disabled and only the narrative pose is used.
   */
  update(
    elapsed: number,
    reducedMotion: boolean,
  ): {
    readonly position: { readonly x: number; readonly y: number; readonly z: number };
    readonly target: { readonly x: number; readonly y: number; readonly z: number };
    readonly fov: number;
  } {
    if (reducedMotion) {
      return snapshotPose(this.narrativePose);
    }

    const ambient = this.#rig.update(elapsed, false);
    const narrative = this.narrativePose;

    this.#composed.position.x =
      narrative.position.x + (ambient.position.x - this.#rig.preset.position.x);
    this.#composed.position.y =
      narrative.position.y + (ambient.position.y - this.#rig.preset.position.y);
    this.#composed.position.z =
      narrative.position.z + (ambient.position.z - this.#rig.preset.position.z);
    this.#composed.target.x = narrative.target.x;
    this.#composed.target.y = narrative.target.y;
    this.#composed.target.z = narrative.target.z;
    this.#composed.fov = narrative.fov;

    return snapshotPose(this.#composed);
  }
}

export function createCameraController(options: CameraControllerOptions): CameraController {
  return new CameraController(options);
}
