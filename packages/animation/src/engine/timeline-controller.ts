import type { SynapseEventBus } from "@synapse/types";
import type { AnimationCategory } from "../categories";
import type { TimelineState } from "../timeline/timeline-definition";
import type { GsapTimeline } from "../timeline/timeline-builder";

export interface TimelineControllerOptions {
  readonly id: string;
  readonly category: AnimationCategory;
  readonly bus: SynapseEventBus;
  readonly timeline: GsapTimeline;
  readonly scrollBound?: boolean;
}

/**
 * Wraps a single GSAP timeline and is the only place GSAP timeline methods
 * are called. Exposes the full lifecycle (play/pause/resume/reverse/restart/
 * seek/scrub/dispose) and emits animation.* events on the Event Bus.
 */
export class TimelineController {
  readonly id: string;
  readonly category: AnimationCategory;
  readonly scrollBound: boolean;
  readonly #bus: SynapseEventBus;
  readonly #timeline: GsapTimeline;
  #state: TimelineState = "created";

  constructor({ id, category, bus, timeline, scrollBound = false }: TimelineControllerOptions) {
    this.id = id;
    this.category = category;
    this.scrollBound = scrollBound;
    this.#bus = bus;
    this.#timeline = timeline;
    this.#state = "registered";
    this.#bus.publish("animation.registered", { id });
  }

  get state(): TimelineState {
    return this.#state;
  }

  get timeline(): GsapTimeline {
    return this.#timeline;
  }

  get duration(): number {
    return this.#timeline.duration();
  }

  play(): void {
    this.#timeline.play();
    this.#state = "playing";
    this.#bus.publish("animation.started", { id: this.id });
  }

  pause(): void {
    this.#timeline.pause();
    this.#state = "paused";
  }

  resume(): void {
    this.#timeline.resume();
    this.#state = "playing";
  }

  reverse(): void {
    this.#timeline.reverse();
    this.#state = "reversed";
    this.#bus.publish("animation.reversed", { id: this.id });
  }

  restart(): void {
    this.#timeline.restart();
    this.#state = "playing";
    this.#bus.publish("animation.started", { id: this.id });
  }

  /** Seek to a normalized progress value 0..1. */
  seek(progress: number): void {
    this.#timeline.progress(Math.max(0, Math.min(1, progress)));
  }

  /** Scrub alias — same as seek, used by scroll orchestrator. */
  scrub(progress: number): void {
    this.seek(progress);
  }

  interrupt(): void {
    this.#timeline.pause();
    this.#state = "paused";
    this.#bus.publish("animation.interrupted", { id: this.id });
  }

  dispose(): void {
    this.#timeline.kill();
    this.#state = "disposed";
    this.#bus.publish("animation.disposed", { id: this.id });
  }
}
