/**
 * Experience-domain types: districts, mood, world phase, and the experience
 * state shape owned by the Experience Engine.
 */

export const DISTRICT_IDS = [
  "origin",
  "memory-stream",
  "knowledge-forest",
  "engineering-core",
  "client-worlds",
  "project-galaxy",
  "ai-observatory",
] as const;

export type DistrictId = (typeof DISTRICT_IDS)[number];

export const MOODS = ["calm", "curious", "focused", "celebratory", "reflective"] as const;

export type Mood = (typeof MOODS)[number];

export const WORLD_PHASES = ["dormant", "awakening", "active", "transitioning"] as const;

export type WorldPhase = (typeof WORLD_PHASES)[number];

/** Experience state. Owned by the Experience Engine (Layer 3). */
export interface ExperienceState {
  readonly worldPhase: WorldPhase;
  readonly currentDistrict: DistrictId | null;
  readonly mood: Mood;
  readonly focusedArtifactId: string | null;
  readonly activeProjectId: string | null;
  /** Normalized 0..1 progression through the overall narrative. */
  readonly storyProgress: number;
}
