import type { DistrictId } from "@synapse/types";

export interface DistrictResourceHandle {
  readonly id: string;
  dispose(): void;
}

/**
 * Tracks disposable resources per district and estimates memory usage.
 */
export class DistrictResourceManager {
  readonly #resources = new Map<DistrictId, DistrictResourceHandle[]>();
  readonly #estimates = new Map<DistrictId, number>();

  track(districtId: DistrictId, handle: DistrictResourceHandle): void {
    const list = this.#resources.get(districtId) ?? [];
    list.push(handle);
    this.#resources.set(districtId, list);
  }

  setEstimate(districtId: DistrictId, bytes: number): void {
    this.#estimates.set(districtId, bytes);
  }

  estimateMemoryBytes(districtId: DistrictId): number {
    return this.#estimates.get(districtId) ?? 0;
  }

  exceedsBudget(districtId: DistrictId, budgetBytes: number): boolean {
    return this.estimateMemoryBytes(districtId) > budgetBytes;
  }

  release(districtId: DistrictId): void {
    const handles = this.#resources.get(districtId);
    if (handles) {
      for (const handle of handles) {
        handle.dispose();
      }
      this.#resources.delete(districtId);
    }
    this.#estimates.delete(districtId);
  }

  dispose(): void {
    for (const districtId of [...this.#resources.keys()]) {
      this.release(districtId);
    }
  }
}

export function createDistrictResourceManager(): DistrictResourceManager {
  return new DistrictResourceManager();
}
