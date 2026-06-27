import type { EnvironmentalState } from "@synapse/types";
import { WorldBreathing } from "./world-breathing";
import { applyAtmosphericDrift } from "./atmospheric-drift";
import {
  createMutableEnvironmentalState,
  snapshotEnvironment,
  type MutableEnvironmentalState,
} from "./environmental-state";

export interface EnvironmentSimulatorInput {
  readonly delta: number;
  readonly scroll: number;
  readonly reducedMotion: boolean;
}

/**
 * Layer 4 environmental simulator (Doc 18). Owns world breathing and
 * atmospheric drift. Ticked by the application — never by React or the
 * renderer directly. Outputs are read via snapshotEnvironment().
 */
export class EnvironmentSimulator {
  readonly #state: MutableEnvironmentalState;
  readonly #breathing: WorldBreathing;

  constructor() {
    this.#state = createMutableEnvironmentalState();
    this.#breathing = new WorldBreathing(28);
  }

  /** Advances simulation by one tick. */
  tick({ delta, scroll, reducedMotion }: EnvironmentSimulatorInput): void {
    const breath = this.#breathing.tick(delta, reducedMotion);
    applyAtmosphericDrift(this.#state, breath, scroll);
  }

  /** Current environmental snapshot for the renderer. */
  read(): EnvironmentalState {
    return snapshotEnvironment(this.#state);
  }

  dispose(): void {
    this.#breathing.reset();
  }
}

export function createEnvironmentSimulator(): EnvironmentSimulator {
  return new EnvironmentSimulator();
}
