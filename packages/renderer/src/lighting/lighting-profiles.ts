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

/** Slightly brighter key for curious exploration. */
export const ORIGIN_VOID_LIGHTING_CURIOUS: LightingProfile = {
  ambient: { color: "#121a35", intensity: 0.65 },
  key: { color: "#a8c0ff", intensity: 1.5, position: { x: 3, y: 4, z: 5 } },
  rim: { color: "#4a6be0", intensity: 1.15, position: { x: -4, y: -2, z: -3 } },
};

/** Softer, deeper ambient for reflective moments. */
export const ORIGIN_VOID_LIGHTING_REFLECTIVE: LightingProfile = {
  ambient: { color: "#0c1428", intensity: 0.55 },
  key: { color: "#8aa8f0", intensity: 1.25, position: { x: 3, y: 4, z: 5 } },
  rim: { color: "#3450b8", intensity: 0.95, position: { x: -4, y: -2, z: -3 } },
};

/** Returns the base Origin Void profile for a given mood. */
export function lightingForMood(mood: Mood): LightingProfile {
  switch (mood) {
    case "curious":
      return ORIGIN_VOID_LIGHTING_CURIOUS;
    case "reflective":
      return ORIGIN_VOID_LIGHTING_REFLECTIVE;
    default:
      return ORIGIN_VOID_LIGHTING;
  }
}

/**
 * Interpolates Origin Void lighting from mood, scroll progress, and the
 * environmental light bias. Scroll slowly approaches the core; ambient deepens.
 */
export function interpolateOriginVoidLighting(
  mood: Mood,
  scroll: number,
  lightBias: number,
): LightingProfile {
  const base = lightingForMood(mood);
  const bias = (lightBias - 0.5) * 2;
  const scrollT = Math.min(Math.max(scroll, 0), 1);

  const keyPosition = base.key.position
    ? {
        x: base.key.position.x * (1 - scrollT * 0.15),
        y: base.key.position.y,
        z: base.key.position.z * (1 - scrollT * 0.15),
      }
    : null;

  const scrolled: LightingProfile = {
    ambient: {
      ...base.ambient,
      intensity: base.ambient.intensity * (1 - scrollT * 0.08 + bias * 0.02),
    },
    key: {
      ...base.key,
      intensity: base.key.intensity * (1 + scrollT * 0.12 + bias * 0.02),
      ...(keyPosition ? { position: keyPosition } : {}),
    },
    rim: {
      ...base.rim,
      intensity: base.rim.intensity * (1 - scrollT * 0.1 + bias * 0.01),
    },
  };

  return scrolled;
}
