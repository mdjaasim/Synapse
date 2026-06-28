import type { NavigationDirection } from "@synapse/types";
import { clamp01 } from "@synapse/utils";
import type { NarrativeDirector } from "../narrative/narrative-director";

export interface ScrollDirectorOptions {
  readonly narrativeDirector: NarrativeDirector;
  readonly onIntent: (intent: ReturnType<NarrativeDirector["resolve"]>) => void;
  readonly getPaused?: () => boolean;
}

/**
 * Receives normalized scroll progress from the animation layer and forwards
 * narrative intents to SceneDirector. Does not mutate any stores directly.
 */
export class ScrollDirector {
  readonly #narrativeDirector: NarrativeDirector;
  readonly #onIntent: ScrollDirectorOptions["onIntent"];
  readonly #getPaused: () => boolean;
  #previousProgress = 0;

  constructor({ narrativeDirector, onIntent, getPaused }: ScrollDirectorOptions) {
    this.#narrativeDirector = narrativeDirector;
    this.#onIntent = onIntent;
    this.#getPaused = getPaused ?? (() => false);
  }

  onProgress(progress: number): void {
    if (this.#getPaused()) {
      return;
    }

    const totalProgress = clamp01(progress);
    const direction = this.#resolveDirection(totalProgress);
    const intent = this.#narrativeDirector.resolve(totalProgress, direction);
    this.#previousProgress = totalProgress;
    this.#onIntent(intent);
  }

  reset(): void {
    this.#previousProgress = 0;
    this.#narrativeDirector.reset();
  }

  #resolveDirection(progress: number): NavigationDirection {
    const delta = progress - this.#previousProgress;
    if (Math.abs(delta) < 0.0001) {
      return "idle";
    }
    return delta > 0 ? "forward" : "backward";
  }
}

export function createScrollDirector(options: ScrollDirectorOptions): ScrollDirector {
  return new ScrollDirector(options);
}
