/**
 * World Breathing (Doc 18 Law 5).
 *
 * A slow 28-second synchronized pulse. Output range is deliberately narrow
 * (0.48–0.52) so the void feels alive only after several seconds of
 * observation — never immediately noticeable.
 */
export class WorldBreathing {
  /** Full breath cycle in seconds. */
  readonly #period: number;
  #elapsed = 0;

  constructor(period = 28) {
    this.#period = period;
  }

  /** Advances the breath cycle. Returns breath value 0..1 (0.5 = neutral). */
  tick(delta: number, reducedMotion: boolean): number {
    if (reducedMotion) {
      return 0.5;
    }
    this.#elapsed += delta;
    const phase = (this.#elapsed % this.#period) / this.#period;
    // Narrow amplitude: ±0.02 around neutral (almost imperceptible)
    return 0.5 + Math.sin(phase * Math.PI * 2) * 0.02;
  }

  reset(): void {
    this.#elapsed = 0;
  }
}
