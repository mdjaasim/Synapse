import type { DistrictId } from "@synapse/types";
import type { WorldRoot } from "../root/world-root";
import type { BaseDistrict } from "./base-district";
import type { DistrictLifecycle } from "./district-lifecycle";

export interface DistrictManagerOptions {
  readonly worldRoot: WorldRoot;
  readonly lifecycle: DistrictLifecycle;
  /** Maximum simultaneously scene-mounted districts (Doc 16 budget). */
  readonly maxActive?: number;
}

/**
 * Scene-graph mount/unmount for districts. Eviction is LRU when budget exceeded.
 */
export class DistrictManager {
  readonly #worldRoot: WorldRoot;
  readonly #lifecycle: DistrictLifecycle;
  readonly #maxActive: number;
  readonly #mounted = new Map<DistrictId, BaseDistrict>();
  readonly #focusOrder: DistrictId[] = [];

  constructor({ worldRoot, lifecycle, maxActive = 3 }: DistrictManagerOptions) {
    this.#worldRoot = worldRoot;
    this.#lifecycle = lifecycle;
    this.#maxActive = maxActive;
  }

  mount(district: BaseDistrict): void {
    const id = district.districtId;
    if (this.#mounted.has(id)) {
      this.#touchFocus(id);
      return;
    }

    if (this.#mounted.size >= this.#maxActive) {
      this.#evictLeastRecent();
    }

    district.mount();
    this.#worldRoot.add(district, "districts");
    this.#mounted.set(id, district);
    this.#touchFocus(id);
  }

  unmount(districtId: DistrictId): void {
    const district = this.#mounted.get(districtId);
    if (!district) {
      return;
    }
    this.#worldRoot.detach(district.id);
    district.unmount();
    this.#mounted.delete(districtId);
    this.#focusOrder.splice(this.#focusOrder.indexOf(districtId), 1);
  }

  get(districtId: DistrictId): BaseDistrict | undefined {
    return this.#mounted.get(districtId);
  }

  get mounted(): readonly BaseDistrict[] {
    return [...this.#mounted.values()];
  }

  get mountedIds(): readonly DistrictId[] {
    return [...this.#mounted.keys()];
  }

  isMounted(districtId: DistrictId): boolean {
    return this.#mounted.has(districtId);
  }

  dispose(): void {
    for (const id of [...this.#mounted.keys()]) {
      this.unmount(id);
    }
  }

  #touchFocus(districtId: DistrictId): void {
    const idx = this.#focusOrder.indexOf(districtId);
    if (idx >= 0) {
      this.#focusOrder.splice(idx, 1);
    }
    this.#focusOrder.push(districtId);
  }

  #evictLeastRecent(): void {
    const victim = this.#focusOrder.find((id) => {
      const phase = this.#lifecycle.getPhase(id);
      return phase === "dormant" || phase === "leaving";
    });
    if (victim) {
      this.unmount(victim);
    }
  }
}

export function createDistrictManager(options: DistrictManagerOptions): DistrictManager {
  return new DistrictManager(options);
}
