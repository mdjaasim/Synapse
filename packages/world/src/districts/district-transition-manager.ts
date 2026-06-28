import type { DistrictId, DistrictTransitionKind, SynapseEventBus } from "@synapse/types";
import type { DistrictRegistry } from "./district-registry";
import type { DistrictState } from "./district-state";
import { TransitionRegistry } from "./transitions/transition-registry";

export interface DistrictTransitionManagerOptions {
  readonly registry: DistrictRegistry;
  readonly state: DistrictState;
  readonly transitions: TransitionRegistry;
  readonly bus: SynapseEventBus;
}

/**
 * Resolves transition kind from district manifest preferences and executes
 * registered handlers. Phase 5A completes instantly — no visuals.
 */
export class DistrictTransitionManager {
  readonly #registry: DistrictRegistry;
  readonly #state: DistrictState;
  readonly #transitions: TransitionRegistry;
  readonly #bus: SynapseEventBus;

  constructor({ registry, state, transitions, bus }: DistrictTransitionManagerOptions) {
    this.#registry = registry;
    this.#state = state;
    this.#transitions = transitions;
    this.#bus = bus;
  }

  /** Resolves the transition kind from the target district manifest. */
  resolveKind(to: DistrictId, requested?: DistrictTransitionKind): DistrictTransitionKind {
    const manifest = this.#registry.getManifest(to);
    const prefs = manifest.transitionPreferences;
    if (requested && prefs.allowed.includes(requested)) {
      return requested;
    }
    return prefs.preferred;
  }

  run(from: DistrictId | null, to: DistrictId, kind: DistrictTransitionKind): void {
    this.#state.setTransition({
      active: true,
      kind,
      from,
      to,
      progress: 0,
    });
    this.#bus.publish("district.transitionStarted", { kind, from, to });

    this.#transitions.get(kind).execute();

    this.#state.setTransition({
      active: false,
      kind: null,
      from: null,
      to: null,
      progress: 1,
    });
    this.#bus.publish("district.transitionCompleted", { kind, from, to });
  }

  dispose(): void {
    this.#state.setTransition({
      active: false,
      kind: null,
      from: null,
      to: null,
      progress: 0,
    });
  }
}

export function createDistrictTransitionManager(
  options: DistrictTransitionManagerOptions,
): DistrictTransitionManager {
  return new DistrictTransitionManager(options);
}
