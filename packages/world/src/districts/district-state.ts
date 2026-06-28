import type {
  DistrictFrameworkSnapshot,
  DistrictId,
  DistrictLifecyclePhase,
  DistrictRuntimeState,
  DistrictTransitionState,
} from "@synapse/types";

interface MutableDistrictRecord {
  phase: DistrictLifecyclePhase;
  loaded: boolean;
  mounted: boolean;
  memoryBytesEstimate: number;
}

/**
 * Tracks per-district runtime state for the controller and debug tooling.
 */
export class DistrictState {
  readonly #records = new Map<DistrictId, MutableDistrictRecord>();
  #currentDistrictId: DistrictId | null = null;
  #transition: DistrictTransitionState = {
    active: false,
    kind: null,
    from: null,
    to: null,
    progress: 0,
  };

  init(districtId: DistrictId): void {
    this.#records.set(districtId, {
      phase: "created",
      loaded: false,
      mounted: false,
      memoryBytesEstimate: 0,
    });
  }

  remove(districtId: DistrictId): void {
    this.#records.delete(districtId);
    if (this.#currentDistrictId === districtId) {
      this.#currentDistrictId = null;
    }
  }

  setPhase(districtId: DistrictId, phase: DistrictLifecyclePhase): void {
    const record = this.#require(districtId);
    record.phase = phase;
  }

  setLoaded(districtId: DistrictId, loaded: boolean): void {
    this.#require(districtId).loaded = loaded;
  }

  setMounted(districtId: DistrictId, mounted: boolean): void {
    this.#require(districtId).mounted = mounted;
  }

  setMemoryEstimate(districtId: DistrictId, bytes: number): void {
    this.#require(districtId).memoryBytesEstimate = bytes;
  }

  setCurrentDistrict(districtId: DistrictId | null): void {
    this.#currentDistrictId = districtId;
  }

  getCurrentDistrict(): DistrictId | null {
    return this.#currentDistrictId;
  }

  setTransition(transition: DistrictTransitionState): void {
    this.#transition = transition;
  }

  getTransition(): DistrictTransitionState {
    return this.#transition;
  }

  getRuntimeState(districtId: DistrictId): DistrictRuntimeState {
    const record = this.#require(districtId);
    return {
      districtId,
      phase: record.phase,
      loaded: record.loaded,
      mounted: record.mounted,
      memoryBytesEstimate: record.memoryBytesEstimate,
    };
  }

  getSnapshot(): DistrictFrameworkSnapshot {
    const districts: DistrictRuntimeState[] = [];
    let totalMemory = 0;
    const loaded: DistrictId[] = [];
    const active: DistrictId[] = [];

    for (const [id, record] of this.#records) {
      districts.push({
        districtId: id,
        phase: record.phase,
        loaded: record.loaded,
        mounted: record.mounted,
        memoryBytesEstimate: record.memoryBytesEstimate,
      });
      totalMemory += record.memoryBytesEstimate;
      if (record.loaded) {
        loaded.push(id);
      }
      if (record.phase === "active" || record.phase === "focused" || record.phase === "entering") {
        active.push(id);
      }
    }

    return {
      currentDistrictId: this.#currentDistrictId,
      loadedDistrictIds: loaded,
      activeDistrictIds: active,
      districts,
      transition: this.#transition,
      totalMemoryBytesEstimate: totalMemory,
    };
  }

  #require(districtId: DistrictId): MutableDistrictRecord {
    const record = this.#records.get(districtId);
    if (!record) {
      throw new Error(`District state not initialized for "${districtId}".`);
    }
    return record;
  }

  dispose(): void {
    this.#records.clear();
    this.#currentDistrictId = null;
    this.#transition = { active: false, kind: null, from: null, to: null, progress: 0 };
  }
}

export function createDistrictState(): DistrictState {
  return new DistrictState();
}
