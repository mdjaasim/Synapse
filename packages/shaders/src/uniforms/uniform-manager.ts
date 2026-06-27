import type { Color } from "three";
import { MOODS, QUALITY_PRESETS, type FrameState } from "@synapse/types";
import { createStandardUniforms, type StandardUniforms } from "./standard-uniforms";

export interface UniformUpdateInput {
  readonly frame: FrameState;
  /** Camera distance to the world origin, fed into uDistance. */
  readonly distance: number;
}

const MOOD_DIVISOR = Math.max(MOODS.length - 1, 1);
const QUALITY_DIVISOR = Math.max(QUALITY_PRESETS.length - 1, 1);

/**
 * Owns the standard uniform set and writes it once per frame. This is the
 * single bridge between observed application state and the GPU; materials never
 * update uniforms themselves.
 */
export class UniformManager {
  readonly uniforms: StandardUniforms;

  constructor(uniforms: StandardUniforms) {
    this.uniforms = uniforms;
  }

  update({ frame, distance }: UniformUpdateInput): void {
    const u = this.uniforms;
    u.uTime.value = frame.elapsed;
    u.uMood.value = MOODS.indexOf(frame.mood) / MOOD_DIVISOR;
    u.uProgress.value = frame.scroll;
    u.uEnergy.value = frame.energy;
    u.uFocus.value = frame.focus;
    u.uInteraction.value = frame.interaction;
    u.uDistance.value = distance;
    u.uScroll.value = frame.scroll;
    u.uPerformance.value = QUALITY_PRESETS.indexOf(frame.quality) / QUALITY_DIVISOR;
  }
}

export interface UniformManagerOptions {
  themeColor?: Color;
}

/** Creates a UniformManager backed by a fresh standard uniform set. */
export function createUniformManager(options: UniformManagerOptions = {}): UniformManager {
  const standard = createStandardUniforms(
    options.themeColor ? { themeColor: options.themeColor } : {},
  );
  return new UniformManager(standard);
}
