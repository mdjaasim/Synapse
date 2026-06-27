import type { EnvironmentalState } from "@synapse/types";
import { NEUTRAL_ENVIRONMENT } from "@synapse/types";

/** Mutable Layer 4 environmental state owned by the simulator. */
export interface MutableEnvironmentalState {
  breath: number;
  fogDensity: number;
  energyFlow: number;
  lightBias: number;
}

/** Creates a mutable environmental state initialized to neutral. */
export function createMutableEnvironmentalState(): MutableEnvironmentalState {
  return { ...NEUTRAL_ENVIRONMENT };
}

/** Returns a read-only snapshot of the current environmental state. */
export function snapshotEnvironment(state: MutableEnvironmentalState): EnvironmentalState {
  return {
    breath: state.breath,
    fogDensity: state.fogDensity,
    energyFlow: state.energyFlow,
    lightBias: state.lightBias,
  };
}
