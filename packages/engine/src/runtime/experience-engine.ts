import type { SynapseEventBus } from "@synapse/types";
import { createEventBus } from "../event-bus/event-bus";
import { createExperienceStore, type ExperienceStore } from "../stores/experience.store";
import { createPerformanceStore, type PerformanceStore } from "../stores/performance.store";
import type { EnginePhase } from "./lifecycle";

export interface ExperienceEngineStores {
  readonly experience: ExperienceStore;
  readonly performance: PerformanceStore;
}

/**
 * The Experience Engine is the runtime that owns the Event Bus and the
 * experience/performance state. It is instantiated via {@link createExperienceEngine}
 * inside an application provider (dependency injection), never at module scope.
 */
export class ExperienceEngine {
  readonly bus: SynapseEventBus;
  readonly stores: ExperienceEngineStores;
  #phase: EnginePhase = "idle";

  constructor() {
    this.bus = createEventBus();
    this.stores = {
      experience: createExperienceStore(),
      performance: createPerformanceStore(),
    };
  }

  get phase(): EnginePhase {
    return this.#phase;
  }

  /**
   * Transition to `ready`. Re-arms a previously disposed engine so the same
   * instance can be reused across React StrictMode remounts in development.
   */
  init(): void {
    if (this.#phase === "idle" || this.#phase === "disposed") {
      this.#phase = "ready";
    }
  }

  /** Transition ready/paused -> running. */
  start(): void {
    if (this.#phase === "ready" || this.#phase === "paused") {
      this.#phase = "running";
    }
  }

  /** Transition running -> paused. */
  pause(): void {
    if (this.#phase === "running") {
      this.#phase = "paused";
    }
  }

  /** Tear down subscriptions and mark the engine disposed. */
  dispose(): void {
    this.bus.clear();
    this.#phase = "disposed";
  }
}

export function createExperienceEngine(): ExperienceEngine {
  return new ExperienceEngine();
}
