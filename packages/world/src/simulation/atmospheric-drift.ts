import type { MutableEnvironmentalState } from "./environmental-state";

/**
 * Computes slow atmospheric drift values from breath and scroll.
 * All changes are gradual — the visitor feels depth deepening over time,
 * never sees a sudden shift.
 */
export function applyAtmosphericDrift(
  state: MutableEnvironmentalState,
  breath: number,
  scroll: number,
): void {
  state.breath = breath;
  // Fog density: breath contributes ±1%, scroll contributes up to +4% over full scroll
  state.fogDensity = 0.5 + (breath - 0.5) * 0.02 + scroll * 0.04;
  // Energy flow: barely visible at start, reaches ~25% intensity at full scroll
  state.energyFlow = scroll * 0.25;
  // Light bias: subtle brightening as narrative progresses (±6% range)
  state.lightBias = 0.5 + scroll * 0.06 + (breath - 0.5) * 0.01;
}
