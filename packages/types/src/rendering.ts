/**
 * Rendering contracts shared between the renderer and the application.
 *
 * The renderer observes experience/performance state through a `FrameStateSource`
 * instead of importing the Experience Engine. This keeps the engine fully
 * renderer-agnostic (the renderer may observe the engine, never the reverse).
 */

import type { Mood } from "./experience";
import type { QualityPreset } from "./performance";

/**
 * Per-frame state consumed by the render loop to drive shader uniforms and
 * camera motion. `elapsed`/`delta` are owned by the renderer's clock; the rest
 * is read from application state each frame.
 */
export interface FrameState {
  /** Seconds since the render loop started (excludes time frozen for reduced motion). */
  readonly elapsed: number;
  /** Seconds since the previous frame (0 when motion is frozen). */
  readonly delta: number;
  readonly mood: Mood;
  /** Overall world energy, 0..1. */
  readonly energy: number;
  /** Focus intensity, 0..1 (e.g. an artifact is focused). */
  readonly focus: number;
  /** Active interaction intensity, 0..1 (e.g. pointer pressed). */
  readonly interaction: number;
  /** Normalized narrative/scroll progress, 0..1. */
  readonly scroll: number;
  readonly quality: QualityPreset;
  readonly reducedMotion: boolean;
}

/** The dynamic portion of {@link FrameState}, read once per frame. */
export type DynamicFrameState = Omit<FrameState, "elapsed" | "delta">;

/**
 * Injected source of dynamic frame state. The application implements this by
 * reading the relevant stores; the renderer calls `read()` once per frame.
 */
export interface FrameStateSource {
  read(): DynamicFrameState;
}

/** Lightweight render statistics reported back to the application. */
export interface FrameStats {
  readonly fps: number;
}

export type FrameStatsHandler = (stats: FrameStats) => void;
