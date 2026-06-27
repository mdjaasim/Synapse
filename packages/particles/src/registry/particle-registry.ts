import type { ParticleFamily, ParticleFamilyId } from "./particle-ids";

export interface ParticleRecord {
  readonly id: ParticleFamilyId;
  readonly family: ParticleFamily;
  readonly name: string;
  readonly maxCount: number;
  readonly narrativePurpose: string;
}

/** Registry of registered particle families (Doc 26). No anonymous particles. */
export class ParticleRegistry {
  readonly #records = new Map<ParticleFamilyId, ParticleRecord>();

  register(record: ParticleRecord): void {
    this.#records.set(record.id, record);
  }

  get(id: ParticleFamilyId): ParticleRecord {
    const record = this.#records.get(id);
    if (!record) {
      throw new Error(`Particle family "${id}" is not registered.`);
    }
    return record;
  }

  list(): readonly ParticleRecord[] {
    return [...this.#records.values()];
  }

  clear(): void {
    this.#records.clear();
  }
}

export function createParticleRegistry(): ParticleRegistry {
  return new ParticleRegistry();
}
