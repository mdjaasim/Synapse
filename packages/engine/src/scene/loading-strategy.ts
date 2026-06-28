import type { DistrictId, StoryNode } from "@synapse/types";
import type { DistrictCommandPort } from "@synapse/types";
import type { NarrativeGraphRegistry } from "../narrative/narrative-graph-registry";

export interface LoadingStrategyOptions {
  readonly graphId: string;
  readonly registry: NarrativeGraphRegistry;
  readonly district: DistrictCommandPort;
}

/**
 * Data-driven preload queue based on graph edges and manifest streaming policy.
 */
export class LoadingStrategy {
  readonly #graphId: string;
  readonly #registry: NarrativeGraphRegistry;
  readonly #district: DistrictCommandPort;

  constructor({ graphId, registry, district }: LoadingStrategyOptions) {
    this.#graphId = graphId;
    this.#registry = registry;
    this.#district = district;
  }

  computePreloadQueue(currentNode: StoryNode): readonly DistrictId[] {
    const queue: DistrictId[] = [];
    const next = this.#registry.getNextNode(this.#graphId, currentNode.id);

    if (currentNode.loadingRequirements.retainOrigin) {
      queue.push("origin");
    }

    if (next && next.enabled !== false && currentNode.loadingRequirements.preloadAdjacent) {
      if (!queue.includes(next.districtId)) {
        queue.push(next.districtId);
      }
    }

    return queue;
  }

  async applyPreloadQueue(queue: readonly DistrictId[]): Promise<void> {
    const order = this.#district.getSnapshot().loadedDistrictIds;
    const sorted = [...queue].sort((a, b) => {
      const aLoaded = order.includes(a) ? 1 : 0;
      const bLoaded = order.includes(b) ? 1 : 0;
      return bLoaded - aLoaded;
    });

    for (const districtId of sorted) {
      if (!this.#district.isLoaded(districtId)) {
        await this.#district.ensureLoaded(districtId);
      }
    }
  }
}

export function createLoadingStrategy(options: LoadingStrategyOptions): LoadingStrategy {
  return new LoadingStrategy(options);
}
