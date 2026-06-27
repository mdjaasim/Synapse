/**
 * @synapse/animation
 *
 * GSAP Animation Engine: registry, timeline controller, motion tokens,
 * scroll orchestration, and declarative timeline builder. Framework-light
 * (no React, no three.js). GSAP is confined to this package only.
 */

export { ANIMATION_CATEGORIES, CATEGORY_PRIORITY, type AnimationCategory } from "./categories";

export {
  MOTION_TOKENS,
  resolveDuration,
  resolveDelay,
  type MotionDurationToken,
  type MotionDelayToken,
  type MotionStaggerToken,
} from "./motion/motion-tokens";
export { MOTION_CURVES, resolveCurve, type MotionCurve } from "./motion/motion-curves";

export {
  TIMELINE_STATES,
  toAnimationRecord,
  type TimelineState,
  type TimelineKeyframe,
  type TimelineDefinition,
  type AnimationRecord,
} from "./timeline/timeline-definition";
export { buildTimeline } from "./timeline/timeline-builder";

export { AnimationRegistry, createAnimationRegistry } from "./engine/animation-registry";
export {
  AnimationBudget,
  ANIMATION_BUDGET,
  createAnimationBudget,
} from "./engine/animation-budget";
export { TimelineController, type TimelineControllerOptions } from "./engine/timeline-controller";
export { initGsapRuntime, gsap, ScrollTrigger } from "./engine/gsap-runtime";
export {
  AnimationEngine,
  createAnimationEngine,
  type AnimationEngineOptions,
  type ActiveTimelineInfo,
} from "./engine/animation-engine";

export type { SmoothScrollAdapter } from "./scroll/scroll-adapter";
export {
  ScrollOrchestrator,
  createScrollOrchestrator,
  type ScrollOrchestratorOptions,
} from "./scroll/scroll-orchestrator";
