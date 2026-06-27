import type { Vec3 } from "@synapse/types";
import type { CameraPreset } from "./camera-presets";

export interface CameraPose {
  readonly position: Vec3;
  readonly target: Vec3;
}

export interface CameraRigOptions {
  /** Orbit angular speed in radians/second. */
  readonly orbitSpeed?: number;
  /** Vertical bob amplitude in world units. */
  readonly bobAmplitude?: number;
  /** Vertical bob frequency in radians/second. */
  readonly bobFrequency?: number;
}

/**
 * A deterministic, framework-light camera controller. It owns camera motion
 * (Doc 16/19/20: deliberate, calm). The renderer applies the computed pose to
 * the actual three.js camera each frame. Reduced motion returns the static
 * preset so the experience is identical but still.
 */
export class CameraRig {
  readonly preset: CameraPreset;
  readonly #orbitSpeed: number;
  readonly #bobAmplitude: number;
  readonly #bobFrequency: number;
  readonly #radius: number;
  readonly #baseAngle: number;

  constructor(preset: CameraPreset, options: CameraRigOptions = {}) {
    this.preset = preset;
    this.#orbitSpeed = options.orbitSpeed ?? 0.05;
    this.#bobAmplitude = options.bobAmplitude ?? 0.1;
    this.#bobFrequency = options.bobFrequency ?? 0.4;
    this.#radius = Math.hypot(preset.position.x, preset.position.z);
    this.#baseAngle = Math.atan2(preset.position.x, preset.position.z);
  }

  update(elapsed: number, reducedMotion: boolean): CameraPose {
    if (reducedMotion || this.#radius === 0) {
      return { position: this.preset.position, target: this.preset.target };
    }
    const angle = this.#baseAngle + elapsed * this.#orbitSpeed;
    return {
      position: {
        x: Math.sin(angle) * this.#radius,
        y: this.preset.position.y + Math.sin(elapsed * this.#bobFrequency) * this.#bobAmplitude,
        z: Math.cos(angle) * this.#radius,
      },
      target: this.preset.target,
    };
  }
}

export function createCameraRig(preset: CameraPreset, options?: CameraRigOptions): CameraRig {
  return new CameraRig(preset, options);
}
