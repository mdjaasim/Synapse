/**
 * Layer 4 environmental simulation state (Doc 18 / PRD 24).
 * Owned by the World Engine; read by the renderer via FrameStateSource.
 * Never enters React.
 */

/** Snapshot of the living environment at a single simulation tick. */
export interface EnvironmentalState {
  /** World breathing phase, 0..1 (0.5 = neutral rest). Almost imperceptible. */
  readonly breath: number;
  /** Fog density bias, 0..1 (0.5 = baseline). */
  readonly fogDensity: number;
  /** Energy flow intensity, 0..1. Origin Void genesis whisper. */
  readonly energyFlow: number;
  /** Lighting intensity bias, 0..1 (0.5 = baseline). */
  readonly lightBias: number;
}

/** Neutral resting environmental state. */
export const NEUTRAL_ENVIRONMENT: EnvironmentalState = {
  breath: 0.5,
  fogDensity: 0.5,
  energyFlow: 0,
  lightBias: 0.5,
};

/**
 * Injected source of environmental state. The application ticks the simulator
 * and the renderer reads this each frame alongside FrameStateSource.
 */
export interface EnvironmentTickInput {
  readonly delta: number;
  readonly scroll: number;
  readonly reducedMotion: boolean;
}

export interface EnvironmentStateSource {
  read(): EnvironmentalState;
  /** Advances simulation — called from the render loop when provided. */
  tick?(input: EnvironmentTickInput): void;
}
