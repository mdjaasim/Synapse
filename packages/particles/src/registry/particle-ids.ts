/** Stable identifiers for particle families (Doc 26). */
export const PARTICLE_FAMILY_IDS = {
  ATMOSPHERE: "atmosphere",
  ENERGY: "energy",
} as const;

export type ParticleFamilyId = (typeof PARTICLE_FAMILY_IDS)[keyof typeof PARTICLE_FAMILY_IDS];

export const PARTICLE_FAMILIES = [
  "atmosphere",
  "energy",
  "knowledge",
  "memory",
  "ai",
  "curiosity",
  "achievement",
] as const;

export type ParticleFamily = (typeof PARTICLE_FAMILIES)[number];

/** Priority for budget enforcement — lower = more important. */
export const FAMILY_PRIORITY: Readonly<Record<ParticleFamily, number>> = {
  atmosphere: 1,
  energy: 2,
  knowledge: 3,
  memory: 3,
  ai: 4,
  curiosity: 4,
  achievement: 5,
};
