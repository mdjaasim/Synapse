import { THEME } from "@synapse/config";

/**
 * Shared motion tokens (Document 25). Timelines reference these instead of
 * hardcoding durations, delays, or staggers.
 */
export const MOTION_TOKENS = {
  duration: {
    instant: 0,
    fast: THEME.motion.fast / 1000,
    base: THEME.motion.base / 1000,
    slow: THEME.motion.slow / 1000,
    narrative: 2.4,
    camera: 1.8,
  },
  delay: {
    none: 0,
    short: 0.12,
    medium: 0.32,
  },
  stagger: {
    tight: 0.05,
    base: 0.1,
    wide: 0.18,
  },
} as const;

export type MotionDurationToken = keyof typeof MOTION_TOKENS.duration;
export type MotionDelayToken = keyof typeof MOTION_TOKENS.delay;
export type MotionStaggerToken = keyof typeof MOTION_TOKENS.stagger;

/** Resolves a duration token (or raw seconds) to a number. */
export function resolveDuration(token: MotionDurationToken | number): number {
  return typeof token === "number" ? token : MOTION_TOKENS.duration[token];
}

/** Resolves a delay token (or raw seconds) to a number. */
export function resolveDelay(token: MotionDelayToken | number): number {
  return typeof token === "number" ? token : MOTION_TOKENS.delay[token];
}
