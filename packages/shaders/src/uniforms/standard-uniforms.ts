import * as THREE from "three";

/**
 * The standardized global uniform objects shared across every Synapse material.
 * The same `IUniform` instances are referenced by all materials, so a single
 * per-frame write (UniformManager) propagates everywhere.
 */
export interface StandardUniforms {
  readonly uTime: THREE.IUniform<number>;
  readonly uMood: THREE.IUniform<number>;
  readonly uProgress: THREE.IUniform<number>;
  readonly uEnergy: THREE.IUniform<number>;
  readonly uFocus: THREE.IUniform<number>;
  readonly uInteraction: THREE.IUniform<number>;
  readonly uDistance: THREE.IUniform<number>;
  readonly uScroll: THREE.IUniform<number>;
  readonly uPerformance: THREE.IUniform<number>;
  readonly uBreath: THREE.IUniform<number>;
  readonly uTheme: THREE.IUniform<THREE.Color>;
}

export interface StandardUniformsOptions {
  themeColor?: THREE.Color;
}

/** Creates a fresh set of standard uniform objects with sensible defaults. */
export function createStandardUniforms(options: StandardUniformsOptions = {}): StandardUniforms {
  return {
    uTime: { value: 0 },
    uMood: { value: 0 },
    uProgress: { value: 0 },
    uEnergy: { value: 0.5 },
    uFocus: { value: 0 },
    uInteraction: { value: 0 },
    uDistance: { value: 0 },
    uScroll: { value: 0 },
    uPerformance: { value: 1 },
    uBreath: { value: 0.5 },
    uTheme: { value: options.themeColor ?? new THREE.Color("#5b8cff") },
  };
}
