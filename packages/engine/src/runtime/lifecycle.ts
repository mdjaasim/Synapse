/**
 * Experience Engine lifecycle phases.
 */

export const ENGINE_PHASES = ["idle", "ready", "running", "paused", "disposed"] as const;

export type EnginePhase = (typeof ENGINE_PHASES)[number];
