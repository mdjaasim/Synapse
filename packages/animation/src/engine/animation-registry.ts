import type { AnimationRecord } from "../timeline/timeline-definition";

/**
 * Animation Registry (Document 25). Every animation is registered with
 * metadata before it can play. No anonymous animations.
 */
export class AnimationRegistry {
  readonly #records = new Map<string, AnimationRecord>();

  register(record: AnimationRecord): void {
    if (this.#records.has(record.id)) {
      throw new Error(`Animation "${record.id}" is already registered.`);
    }
    this.#records.set(record.id, record);
  }

  get(id: string): AnimationRecord {
    const record = this.#records.get(id);
    if (!record) {
      throw new Error(`Animation "${id}" is not registered.`);
    }
    return record;
  }

  has(id: string): boolean {
    return this.#records.has(id);
  }

  list(): readonly AnimationRecord[] {
    return [...this.#records.values()];
  }

  clear(): void {
    this.#records.clear();
  }
}

export function createAnimationRegistry(): AnimationRegistry {
  return new AnimationRegistry();
}
