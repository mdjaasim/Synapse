import type { SynapseEventBus } from "@synapse/types";
import type { QualityPreset } from "@synapse/types";
import { initGsapRuntime } from "./gsap-runtime";
import { AnimationRegistry, createAnimationRegistry } from "./animation-registry";
import { AnimationBudget, createAnimationBudget } from "./animation-budget";
import { TimelineController } from "./timeline-controller";
import { buildTimeline } from "../timeline/timeline-builder";
import {
  toAnimationRecord,
  type TimelineDefinition,
  type TimelineState,
} from "../timeline/timeline-definition";
import { createScrollOrchestrator, ScrollOrchestrator } from "../scroll/scroll-orchestrator";
import type { SmoothScrollAdapter } from "../scroll/scroll-adapter";

export interface AnimationEngineOptions {
  readonly bus: SynapseEventBus;
  readonly getReducedMotion: () => boolean;
  readonly getQuality: () => QualityPreset;
  readonly onScrollProgress?: (progress: number) => void;
}

export interface ActiveTimelineInfo {
  readonly id: string;
  readonly state: TimelineState;
  readonly category: string;
  readonly scrollBound: boolean;
}

/**
 * The Animation Engine (Document 25). Owns the registry, active timelines,
 * budget enforcement, scroll orchestrator, and GSAP runtime. Instantiated via
 * DI inside the application — never at module scope.
 */
export class AnimationEngine {
  readonly registry: AnimationRegistry;
  readonly budget: AnimationBudget;
  readonly scroll: ScrollOrchestrator;
  readonly #bus: SynapseEventBus;
  readonly #controllers = new Map<string, TimelineController>();
  readonly #definitions = new Map<string, TimelineDefinition>();
  #scrollProgressHandler: ((progress: number) => void) | undefined;

  constructor({ bus, getReducedMotion, onScrollProgress }: AnimationEngineOptions) {
    initGsapRuntime();
    this.#bus = bus;
    this.registry = createAnimationRegistry();
    this.budget = createAnimationBudget();
    this.#scrollProgressHandler = onScrollProgress;
    this.scroll = createScrollOrchestrator({
      onProgress: (progress) => {
        this.#scrollProgressHandler?.(progress);
      },
      getReducedMotion,
    });
  }

  /** Replaces the scroll progress reporter (wired by SceneDirectorProvider). */
  setScrollProgressHandler(handler: (progress: number) => void): void {
    this.#scrollProgressHandler = handler;
  }
  register(def: TimelineDefinition): TimelineController {
    const existing = this.#controllers.get(def.id);
    if (existing) {
      return existing;
    }

    if (this.registry.has(def.id)) {
      throw new Error(`Timeline "${def.id}" is already registered.`);
    }

    const record = toAnimationRecord(def);
    this.registry.register(record);
    this.#definitions.set(def.id, def);

    const gsapTimeline = buildTimeline(def);
    const controller = new TimelineController({
      id: def.id,
      category: def.category,
      bus: this.#bus,
      timeline: gsapTimeline,
      scrollBound: def.scrollBound ?? false,
    });

    this.#controllers.set(def.id, controller);

    if (def.scrollBound) {
      this.scroll.onScrub((progress) => {
        controller.scrub(progress);
      });
    }

    return controller;
  }

  get(id: string): TimelineController {
    const controller = this.#controllers.get(id);
    if (!controller) {
      throw new Error(`Timeline "${id}" is not registered.`);
    }
    return controller;
  }

  play(id: string): void {
    const def = this.#definitions.get(id);
    const controller = this.get(id);
    if (!def) {
      return;
    }
    if (!this.budget.canStart(def.category, id)) {
      this.#bus.publish("animation.failed", {
        id,
        reason: `Budget exceeded for category "${def.category}".`,
      });
      return;
    }
    this.budget.track(def.category, id);
    controller.play();
  }

  interrupt(id: string): void {
    const controller = this.#controllers.get(id);
    if (!controller) {
      return;
    }
    controller.interrupt();
    const def = this.#definitions.get(id);
    if (def) {
      this.budget.release(def.category, id);
    }
  }

  reverse(id: string): void {
    this.get(id).reverse();
  }

  /** Connect a smooth-scroll adapter (Lenis) to the scroll orchestrator. */
  connectSmoothScroll(adapter?: SmoothScrollAdapter): void {
    this.scroll.connect(adapter);
  }

  /** List all active timeline info for debug overlay. */
  getActiveTimelines(): readonly ActiveTimelineInfo[] {
    return [...this.#controllers.values()].map((c) => ({
      id: c.id,
      state: c.state,
      category: c.category,
      scrollBound: c.scrollBound,
    }));
  }

  /** Current scroll progress from the orchestrator. */
  get scrollProgress(): number {
    return this.scroll.progress;
  }

  dispose(): void {
    for (const controller of this.#controllers.values()) {
      controller.dispose();
    }
    this.#controllers.clear();
    this.#definitions.clear();
    this.budget.clear();
    this.registry.clear();
    this.scroll.dispose();
  }
}

export function createAnimationEngine(options: AnimationEngineOptions): AnimationEngine {
  return new AnimationEngine(options);
}
