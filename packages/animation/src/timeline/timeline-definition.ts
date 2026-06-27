import type { AnimationCategory } from "../categories";
import type { MotionCurve } from "../motion/motion-curves";
import type { MotionDelayToken, MotionDurationToken } from "../motion/motion-tokens";
import { resolveDuration } from "../motion/motion-tokens";

/** Lifecycle states for a registered timeline. */
export const TIMELINE_STATES = [
  "created",
  "registered",
  "prepared",
  "playing",
  "paused",
  "reversed",
  "completed",
  "disposed",
] as const;

export type TimelineState = (typeof TIMELINE_STATES)[number];

/** A single keyframe step in a declarative timeline. */
export interface TimelineKeyframe {
  readonly props: Record<string, number | string>;
  readonly duration?: MotionDurationToken | number;
  readonly ease?: MotionCurve | string;
  readonly delay?: MotionDelayToken | number;
}

/** Declarative timeline definition — data, not imperative code. */
export interface TimelineDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: AnimationCategory;
  readonly owner: string;
  readonly duration: MotionDurationToken | number;
  readonly priority: number;
  readonly interruptible: boolean;
  readonly reversible: boolean;
  readonly performanceCost: "low" | "medium" | "high";
  /** The mutable object GSAP tweens into (e.g. camera controller pose). */
  readonly target: Record<string, unknown>;
  readonly keyframes: readonly TimelineKeyframe[];
  /** When true, this timeline is scrubbed by scroll progress instead of playing on its own. */
  readonly scrollBound?: boolean;
}

/** Metadata record stored in the animation registry. */
export interface AnimationRecord {
  readonly id: string;
  readonly name: string;
  readonly category: AnimationCategory;
  readonly owner: string;
  readonly duration: number;
  readonly priority: number;
  readonly interruptible: boolean;
  readonly reversible: boolean;
  readonly performanceCost: "low" | "medium" | "high";
  readonly scrollBound: boolean;
}

/** Creates an AnimationRecord from a TimelineDefinition. */
export function toAnimationRecord(def: TimelineDefinition): AnimationRecord {
  return {
    id: def.id,
    name: def.name,
    category: def.category,
    owner: def.owner,
    duration: resolveDuration(def.duration),
    priority: def.priority,
    interruptible: def.interruptible,
    reversible: def.reversible,
    performanceCost: def.performanceCost,
    scrollBound: def.scrollBound ?? false,
  };
}
