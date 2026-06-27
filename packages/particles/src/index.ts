/**
 * @synapse/particles
 *
 * GPU particle engine: registry, instanced Points renderer, behavior presets,
 * and quality scaling. Framework-light (three.js only; no React).
 */

export { PARTICLE_FAMILY_IDS, PARTICLE_FAMILIES, FAMILY_PRIORITY } from "./registry/particle-ids";
export type { ParticleFamilyId, ParticleFamily } from "./registry/particle-ids";
export {
  ParticleRegistry,
  createParticleRegistry,
  type ParticleRecord,
} from "./registry/particle-registry";

export {
  ParticleEngine,
  createParticleEngine,
  type ParticleEngineOptions,
  type ParticleSystem,
} from "./simulation/particle-engine";

export {
  ORIGIN_VOID_PARTICLE_CAPS,
  ORIGIN_VOID_ENERGY_CAPS,
  scaledCount,
} from "./simulation/quality-scaling";

export { createInstancedPoints, type InstancedPointsOptions } from "./render/instanced-points";
