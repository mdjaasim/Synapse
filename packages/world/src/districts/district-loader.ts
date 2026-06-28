import type { DistrictId } from "@synapse/types";
import type { BaseDistrict, DistrictContext } from "./base-district";
import type { DistrictLifecycle } from "./district-lifecycle";
import type { DistrictRegistry } from "./district-registry";
import type { DistrictResourceManager } from "./district-resource-manager";
import type { DistrictState } from "./district-state";

export interface DistrictLoaderOptions {
  readonly registry: DistrictRegistry;
  readonly lifecycle: DistrictLifecycle;
  readonly state: DistrictState;
  readonly resources: DistrictResourceManager;
}

/**
 * Loads and unloads district instances using manifest-driven priority.
 * Streaming-ready async prepare(); stubs resolve immediately.
 */
export class DistrictLoader {
  readonly #registry: DistrictRegistry;
  readonly #lifecycle: DistrictLifecycle;
  readonly #state: DistrictState;
  readonly #resources: DistrictResourceManager;
  readonly #instances = new Map<DistrictId, BaseDistrict>();

  constructor(options: DistrictLoaderOptions) {
    this.#registry = options.registry;
    this.#lifecycle = options.lifecycle;
    this.#state = options.state;
    this.#resources = options.resources;
  }

  getInstance(id: DistrictId): BaseDistrict | undefined {
    return this.#instances.get(id);
  }

  isLoaded(id: DistrictId): boolean {
    return this.#instances.has(id);
  }

  /** Returns district ids sorted by manifest loading priority (desc). */
  getLoadOrder(ids: readonly DistrictId[]): readonly DistrictId[] {
    return [...ids].sort(
      (a, b) =>
        this.#registry.getManifest(b).loadingPriority -
        this.#registry.getManifest(a).loadingPriority,
    );
  }

  async load(id: DistrictId, ctx: DistrictContext): Promise<BaseDistrict> {
    const existing = this.#instances.get(id);
    if (existing) {
      return existing;
    }

    const { create, manifest } = this.#registry.get(id);
    this.#lifecycle.init(id);
    this.#state.init(id);

    const district = create(ctx);
    await district.prepare();

    this.#lifecycle.transition(id, "prepared");
    this.#state.setPhase(id, "prepared");
    this.#state.setLoaded(id, true);

    this.#instances.set(id, district);
    this.#resources.setEstimate(id, manifest.memoryBudgetBytes > 0 ? 1024 : 0);

    return district;
  }

  unload(id: DistrictId): void {
    const district = this.#instances.get(id);
    if (!district) {
      return;
    }

    const manifest = district.manifest;
    if (manifest.streamingPolicy.unloadWhenDormant) {
      district.unmount();
      district.dispose();
      this.#resources.release(id);
      this.#instances.delete(id);
      this.#lifecycle.transition(id, "disposed");
      this.#lifecycle.remove(id);
      this.#state.remove(id);
    }
  }

  dispose(): void {
    for (const id of [...this.#instances.keys()]) {
      const district = this.#instances.get(id);
      if (district) {
        district.unmount();
        district.dispose();
      }
      this.#resources.release(id);
    }
    this.#instances.clear();
  }
}

export function createDistrictLoader(options: DistrictLoaderOptions): DistrictLoader {
  return new DistrictLoader(options);
}
