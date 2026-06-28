import type { DistrictId, DistrictTransitionKind, SynapseEventBus } from "@synapse/types";
import type { DistrictRegistry } from "./district-registry";
import type { DistrictState } from "./district-state";
import { TransitionRegistry } from "./transitions/transition-registry";

export interface DistrictTransitionManagerOptions {
  readonly registry: DistrictRegistry;
  readonly state: DistrictState;
  readonly transitions: TransitionRegistry;
  readonly bus: SynapseEventBus;
  readonly getReducedMotion?: () => boolean;
}

const TRANSITION_DURATIONS: Record<DistrictTransitionKind, number> = {
  fade: 0.65,
  crossfade: 0.85,
  "camera-flight": 0.4,
  portal: 1.15,
  "shader-dissolve": 1.0,
  blackout: 0.75,
};

/**
 * Resolves transition kind from district manifest preferences and executes
 * registered handlers with animated progress.
 */
export class DistrictTransitionManager {
  readonly #registry: DistrictRegistry;
  readonly #state: DistrictState;
  readonly #transitions: TransitionRegistry;
  readonly #bus: SynapseEventBus;
  readonly #getReducedMotion: () => boolean;

  constructor({
    registry,
    state,
    transitions,
    bus,
    getReducedMotion,
  }: DistrictTransitionManagerOptions) {
    this.#registry = registry;
    this.#state = state;
    this.#transitions = transitions;
    this.#bus = bus;
    this.#getReducedMotion = getReducedMotion ?? (() => false);
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

  async run(from: DistrictId | null, to: DistrictId, kind: DistrictTransitionKind): Promise<void> {
    const reducedMotion = this.#getReducedMotion();
    const duration = reducedMotion ? 0 : TRANSITION_DURATIONS[kind];

    this.#state.setTransition({
      active: true,
      kind,
      from,
      to,
      progress: 0,
    });
    this.#bus.publish("district.transitionStarted", { kind, from, to });
    this.#transitions.get(kind).execute();

    if (duration <= 0) {
      this.#state.setTransition({
        active: false,
        kind: null,
        from: null,
        to: null,
        progress: 1,
      });
      this.#bus.publish("district.transitionCompleted", { kind, from, to });
      return;
    }

    await new Promise<void>((resolve) => {
      const start = performance.now();
      const step = (now: number): void => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        const eased = t * t * (3 - 2 * t);
        this.#state.setTransition({
          active: true,
          kind,
          from,
          to,
          progress: eased,
        });
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          this.#state.setTransition({
            active: false,
            kind: null,
            from: null,
            to: null,
            progress: 1,
          });
          this.#bus.publish("district.transitionCompleted", { kind, from, to });
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
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
