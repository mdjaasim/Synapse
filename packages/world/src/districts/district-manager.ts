import type { DistrictId } from "@synapse/types";
import type { WorldRoot } from "../root/world-root";
import type { District } from "./district";

export interface DistrictManagerOptions {
  readonly worldRoot: WorldRoot;
  /** Maximum simultaneously active districts (Doc 16 budget). */
  readonly maxActive?: number;
}

/**
 * District Manager (Doc 16): activates/deactivates districts under the world's
 * `districts` layer and enforces the active-district budget. It never renders.
 */
export class DistrictManager {
  readonly #worldRoot: WorldRoot;
  readonly #maxActive: number;
  readonly #active = new Map<DistrictId, District>();

  constructor({ worldRoot, maxActive = 3 }: DistrictManagerOptions) {
    this.#worldRoot = worldRoot;
    this.#maxActive = maxActive;
  }

  activate(district: District): void {
    if (this.#active.has(district.districtId)) {
      return;
    }
    if (this.#active.size >= this.#maxActive) {
      throw new Error(`District budget (${this.#maxActive}) exceeded.`);
    }
    this.#worldRoot.add(district, "districts");
    this.#active.set(district.districtId, district);
  }

  deactivate(districtId: DistrictId): void {
    const district = this.#active.get(districtId);
    if (!district) {
      return;
    }
    this.#worldRoot.remove(district.id);
    this.#active.delete(districtId);
  }

  get active(): readonly District[] {
    return [...this.#active.values()];
  }

  dispose(): void {
    for (const districtId of [...this.#active.keys()]) {
      this.deactivate(districtId);
    }
  }
}
