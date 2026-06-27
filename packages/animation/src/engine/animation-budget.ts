import type { AnimationCategory } from "../categories";

/** Maximum simultaneous timelines per category (Document 25 budget). */
export const ANIMATION_BUDGET: Readonly<Record<AnimationCategory, number>> = {
  camera: 1,
  narrative: 2,
  interaction: 3,
  ambient: 4,
  ai: 2,
  celebration: 1,
};

/**
 * Enforces the animation budget. The engine checks before starting a new
 * timeline and rejects if the category limit is exceeded.
 */
export class AnimationBudget {
  readonly #active = new Map<AnimationCategory, Set<string>>();

  canStart(category: AnimationCategory, id: string): boolean {
    const active = this.#active.get(category);
    if (!active) {
      return true;
    }
    if (active.has(id)) {
      return true;
    }
    return active.size < ANIMATION_BUDGET[category];
  }

  track(category: AnimationCategory, id: string): void {
    const active = this.#active.get(category) ?? new Set<string>();
    active.add(id);
    this.#active.set(category, active);
  }

  release(category: AnimationCategory, id: string): void {
    const active = this.#active.get(category);
    if (!active) {
      return;
    }
    active.delete(id);
    if (active.size === 0) {
      this.#active.delete(category);
    }
  }

  getActive(category: AnimationCategory): readonly string[] {
    return [...(this.#active.get(category) ?? [])];
  }

  getAllActive(): Readonly<Record<string, readonly string[]>> {
    const result: Record<string, readonly string[]> = {};
    for (const [category, ids] of this.#active) {
      result[category] = [...ids];
    }
    return result;
  }

  clear(): void {
    this.#active.clear();
  }
}

export function createAnimationBudget(): AnimationBudget {
  return new AnimationBudget();
}
