import type { DistrictId, DistrictManifest } from "@synapse/types";
import type { DistrictFactory, DistrictRegistration } from "./base-district";

/**
 * Registry of data-driven district manifests and factories.
 * New districts are addable via {@link register} without controller changes.
 */
export class DistrictRegistry {
  readonly #entries = new Map<DistrictId, DistrictRegistration>();

  register(registration: DistrictRegistration): void {
    if (this.#entries.has(registration.manifest.id)) {
      throw new Error(`District "${registration.manifest.id}" is already registered.`);
    }
    this.#entries.set(registration.manifest.id, registration);
  }

  getManifest(id: DistrictId): DistrictManifest {
    return this.get(id).manifest;
  }

  get(id: DistrictId): DistrictRegistration {
    const entry = this.#entries.get(id);
    if (!entry) {
      throw new Error(`District "${id}" is not registered.`);
    }
    return entry;
  }

  has(id: DistrictId): boolean {
    return this.#entries.has(id);
  }

  /** All manifests sorted by loading priority (descending). */
  listByPriority(): readonly DistrictRegistration[] {
    return [...this.#entries.values()].sort(
      (a, b) => b.manifest.loadingPriority - a.manifest.loadingPriority,
    );
  }

  list(): readonly DistrictRegistration[] {
    return [...this.#entries.values()];
  }

  dispose(): void {
    this.#entries.clear();
  }
}

export function createDistrictRegistry(): DistrictRegistry {
  return new DistrictRegistry();
}

export type { DistrictFactory, DistrictRegistration };
