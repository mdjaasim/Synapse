import gsap from "gsap";
import type { CameraPreset } from "../rig/camera-presets";
import type { DistrictManifest, Vec3 } from "@synapse/types";
import { CameraRig, type CameraRigOptions } from "../rig/camera-rig";
import {
  cameraPresetFromManifest,
  primaryCameraTarget,
} from "../profiles/district-camera-profiles";
import { getCameraTransitionProfile } from "../transition/camera-transition-profiles";
import { createCameraPoseState, snapshotPose, type CameraPoseState } from "./camera-pose";

export interface CameraControllerOptions {
  readonly preset: CameraPreset;
  readonly rigOptions?: CameraRigOptions;
}

export type SavedCameraPose = ReturnType<typeof snapshotPose>;

/**
 * Composes ambient drift (CameraRig) with a narrative pose (GSAP-driven).
 * The renderer reads the final composed pose each frame. Animation timelines
 * tween `narrativePose` — never the three.js camera directly.
 */
export class CameraController {
  readonly narrativePose: CameraPoseState;
  readonly #rig: CameraRig;
  readonly #composed: CameraPoseState;
  #focusedDistrictId: DistrictManifest["id"] | null = null;
  #activeTween: gsap.core.Timeline | null = null;
  #reducedMotion = false;

  constructor({ preset, rigOptions }: CameraControllerOptions) {
    this.#rig = new CameraRig(preset, rigOptions);
    this.narrativePose = createCameraPoseState(preset.position, preset.target, preset.fov);
    this.#composed = createCameraPoseState(preset.position, preset.target, preset.fov);
  }

  get focusedDistrictId(): DistrictManifest["id"] | null {
    return this.#focusedDistrictId;
  }

  get isTransitioning(): boolean {
    return this.#activeTween !== null && this.#activeTween.isActive();
  }

  setReducedMotion(reducedMotion: boolean): void {
    this.#reducedMotion = reducedMotion;
  }

  savePose(): SavedCameraPose {
    return snapshotPose(this.narrativePose);
  }

  restorePose(saved: SavedCameraPose): void {
    this.#killTween();
    this.narrativePose.position.x = saved.position.x;
    this.narrativePose.position.y = saved.position.y;
    this.narrativePose.position.z = saved.position.z;
    this.narrativePose.target.x = saved.target.x;
    this.narrativePose.target.y = saved.target.y;
    this.narrativePose.target.z = saved.target.z;
    this.narrativePose.fov = saved.fov;
  }

  interruptTransition(): void {
    this.#killTween();
  }

  lookAtTarget(target: Vec3): void {
    this.narrativePose.target.x = target.x;
    this.narrativePose.target.y = target.y;
    this.narrativePose.target.z = target.z;
  }

  /** Applies the primary camera target from a district manifest. */
  focusDistrict(manifest: DistrictManifest): void {
    this.#killTween();
    const cam = primaryCameraTarget(manifest);
    this.narrativePose.position.x = cam.position.x;
    this.narrativePose.position.y = cam.position.y;
    this.narrativePose.position.z = cam.position.z;
    this.narrativePose.target.x = cam.target.x;
    this.narrativePose.target.y = cam.target.y;
    this.narrativePose.target.z = cam.target.z;
    this.narrativePose.fov = cam.fov;
    this.#focusedDistrictId = manifest.id;
  }

  /**
   * Cinematic transition to a district camera preset. Respects profile duration
   * and easing; instant when duration is zero or reduced motion is active.
   */
  transitionTo(manifest: DistrictManifest, profileId: string): void {
    const profile = getCameraTransitionProfile(profileId);
    const preset = cameraPresetFromManifest(manifest);

    if (profile.duration <= 0 || this.#reducedMotion) {
      this.focusDistrict(manifest);
      return;
    }

    this.#killTween();
    const tl = gsap.timeline({
      onComplete: () => {
        this.#activeTween = null;
      },
    });

    tl.to(
      this.narrativePose.position,
      {
        x: preset.position.x,
        y: preset.position.y,
        z: preset.position.z,
        duration: profile.duration,
        ease: profile.easing,
      },
      0,
    );
    tl.to(
      this.narrativePose.target,
      {
        x: preset.target.x,
        y: preset.target.y,
        z: preset.target.z,
        duration: profile.duration,
        ease: profile.easing,
      },
      0,
    );
    tl.to(
      this.narrativePose,
      {
        fov: preset.fov,
        duration: profile.duration,
        ease: profile.easing,
      },
      0,
    );

    this.#activeTween = tl;
    this.#focusedDistrictId = manifest.id;
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

  #killTween(): void {
    if (this.#activeTween) {
      this.#activeTween.kill();
      this.#activeTween = null;
    }
  }
}

export function createCameraController(options: CameraControllerOptions): CameraController {
  return new CameraController(options);
}

/** Adapter for {@link DistrictController} — keeps world free of camera imports. */
export function createDistrictCameraAdapter(controller: CameraController) {
  return {
    focusDistrict(manifest: DistrictManifest) {
      controller.focusDistrict(manifest);
    },
    transitionTo(manifest: DistrictManifest, profileId: string) {
      controller.transitionTo(manifest, profileId);
    },
    interruptTransition() {
      controller.interruptTransition();
    },
  };
}
