import type { Mood } from "@synapse/types";

export interface LightVec {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface LightConfig {
  readonly color: string;
  readonly intensity: number;
  readonly position?: LightVec;
}

export interface LightingProfile {
  readonly ambient: LightConfig;
  readonly key: LightConfig;
  readonly rim: LightConfig;
}

/**
 * Origin Void lighting (Doc 19): almost dark, minimal contrast, a single soft
 * key plus low ambient fill and a cool rim. Well within the realtime-light
 * budget (3 lights vs. the documented max of 6).
 */
export const ORIGIN_VOID_LIGHTING: LightingProfile = {
  ambient: { color: "#10182f", intensity: 0.6 },
  key: { color: "#9ab4ff", intensity: 1.4, position: { x: 3, y: 4, z: 5 } },
  rim: { color: "#3a5bd0", intensity: 1.1, position: { x: -4, y: -2, z: -3 } },
};

/** Phase 2 has one profile; later phases vary lighting by mood. */
export function lightingForMood(_mood: Mood): LightingProfile {
  return ORIGIN_VOID_LIGHTING;
}
