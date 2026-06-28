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

/** Per-district cinematic lighting derived from material glow palettes. */
export const DISTRICT_LIGHTING: Record<string, LightingProfile> = {
  origin: ORIGIN_VOID_LIGHTING,
  "project-galaxy": {
    ambient: { color: "#12082a", intensity: 0.55 },
    key: { color: "#c4a0ff", intensity: 1.35, position: { x: 2, y: 5, z: 4 } },
    rim: { color: "#6b3fd0", intensity: 1.05, position: { x: -5, y: -1, z: -4 } },
  },
  "client-worlds": {
    ambient: { color: "#101620", intensity: 0.58 },
    key: { color: "#8ab4f8", intensity: 1.3, position: { x: 4, y: 3, z: 5 } },
    rim: { color: "#3a6bc8", intensity: 0.95, position: { x: -3, y: -2, z: -3 } },
  },
  "engineering-core": {
    ambient: { color: "#0c1018", intensity: 0.52 },
    key: { color: "#6ec4ff", intensity: 1.25, position: { x: 2, y: 4, z: 6 } },
    rim: { color: "#2a5080", intensity: 0.85, position: { x: -4, y: 0, z: -2 } },
  },
  "knowledge-forest": {
    ambient: { color: "#0a1410", intensity: 0.56 },
    key: { color: "#5dffb0", intensity: 1.2, position: { x: -2, y: 5, z: 3 } },
    rim: { color: "#1a6040", intensity: 0.9, position: { x: 4, y: -1, z: -4 } },
  },
  "ai-observatory": {
    ambient: { color: "#0c1424", intensity: 0.54 },
    key: { color: "#9ec5ff", intensity: 1.28, position: { x: 0, y: 4, z: 5 } },
    rim: { color: "#4080d0", intensity: 1.0, position: { x: -3, y: -2, z: -3 } },
  },
  "memory-stream": {
    ambient: { color: "#100818", intensity: 0.57 },
    key: { color: "#e8b0ff", intensity: 1.22, position: { x: 3, y: 3, z: 4 } },
    rim: { color: "#8040a0", intensity: 0.92, position: { x: -4, y: -1, z: -3 } },
  },
};

function lerpLight(a: LightConfig, b: LightConfig, t: number): LightConfig {
  const base: LightConfig = {
    color: t < 0.5 ? a.color : b.color,
    intensity: a.intensity + (b.intensity - a.intensity) * t,
  };
  if (a.position && b.position) {
    return {
      ...base,
      position: {
        x: a.position.x + (b.position.x - a.position.x) * t,
        y: a.position.y + (b.position.y - a.position.y) * t,
        z: a.position.z + (b.position.z - a.position.z) * t,
      },
    };
  }
  const fallback = a.position ?? b.position;
  return fallback ? { ...base, position: fallback } : base;
}

function blendProfiles(from: LightingProfile, to: LightingProfile, t: number): LightingProfile {
  return {
    ambient: lerpLight(from.ambient, to.ambient, t),
    key: lerpLight(from.key, to.key, t),
    rim: lerpLight(from.rim, to.rim, t),
  };
}

/** Resolves district lighting with mood + scroll modulation. */
export function interpolateDistrictLighting(
  districtId: string | null,
  mood: Mood,
  scroll: number,
  lightBias: number,
  transitionProgress: number,
): LightingProfile {
  const district = districtId
    ? (DISTRICT_LIGHTING[districtId] ?? ORIGIN_VOID_LIGHTING)
    : ORIGIN_VOID_LIGHTING;
  const moodBase = lightingForMood(mood);
  const blended = blendProfiles(moodBase, district, Math.min(transitionProgress, 1));
  return interpolateOriginVoidLighting(mood, scroll, lightBias, blended);
}

/**
 * Interpolates Origin Void lighting from mood, scroll progress, and the
 * environmental light bias. Scroll slowly approaches the core; ambient deepens.
 */
export function interpolateOriginVoidLighting(
  mood: Mood,
  scroll: number,
  lightBias: number,
  baseOverride?: LightingProfile,
): LightingProfile {
  const base = baseOverride ?? lightingForMood(mood);
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
