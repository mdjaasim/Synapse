import type { DistrictId, DistrictLifecyclePhase } from "@synapse/types";

/** Valid lifecycle transitions (Doc 8). */
const TRANSITIONS: Readonly<Record<DistrictLifecyclePhase, readonly DistrictLifecyclePhase[]>> = {
  created: ["prepared", "disposed"],
  prepared: ["entering", "dormant", "disposed"],
  entering: ["active", "disposed"],
  active: ["focused", "leaving", "disposed"],
  focused: ["active", "leaving", "disposed"],
  leaving: ["dormant", "disposed"],
  dormant: ["prepared", "entering", "disposed"],
  disposed: [],
};

/**
 * Enforces the Doc 8 district lifecycle state machine.
 * Returns the new phase or null if the transition is invalid.
 */
export class DistrictLifecycle {
  readonly #phases = new Map<DistrictId, DistrictLifecyclePhase>();

  getPhase(districtId: DistrictId): DistrictLifecyclePhase {
    return this.#phases.get(districtId) ?? "created";
  }

  canTransition(from: DistrictLifecyclePhase, to: DistrictLifecyclePhase): boolean {
    return TRANSITIONS[from].includes(to);
  }

  transition(districtId: DistrictId, to: DistrictLifecyclePhase): DistrictLifecyclePhase {
    const from = this.getPhase(districtId);
    if (!this.canTransition(from, to)) {
      throw new Error(`Invalid district lifecycle transition: ${districtId} ${from} → ${to}`);
    }
    this.#phases.set(districtId, to);
    return to;
  }

  init(districtId: DistrictId): DistrictLifecyclePhase {
    this.#phases.set(districtId, "created");
    return "created";
  }

  remove(districtId: DistrictId): void {
    this.#phases.delete(districtId);
  }

  isUpdateEligible(phase: DistrictLifecyclePhase): boolean {
    return phase === "active" || phase === "focused" || phase === "entering";
  }

  isSceneEligible(phase: DistrictLifecyclePhase): boolean {
    return phase === "entering" || phase === "active" || phase === "focused" || phase === "leaving";
  }

  dispose(): void {
    this.#phases.clear();
  }
}

export function createDistrictLifecycle(): DistrictLifecycle {
  return new DistrictLifecycle();
}
