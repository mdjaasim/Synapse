import gsap from "gsap";
import type { TimelineDefinition } from "./timeline-definition";
import { resolveCurve } from "../motion/motion-curves";
import { resolveDelay, resolveDuration } from "../motion/motion-tokens";

/** The GSAP timeline type produced by the builder. */
export type GsapTimeline = gsap.core.Timeline;

/**
 * Builds a GSAP timeline from a declarative definition. This is the only
 * place that translates data into GSAP tweens — no component ever calls GSAP
 * directly.
 */
export function buildTimeline(def: TimelineDefinition): GsapTimeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: resolveCurve("cinematic") } });

  for (const keyframe of def.keyframes) {
    tl.to(def.target, {
      ...keyframe.props,
      duration: resolveDuration(keyframe.duration ?? def.duration),
      ease: resolveCurve(keyframe.ease ?? "cinematic"),
      delay: resolveDelay(keyframe.delay ?? "none"),
    });
  }

  return tl;
}
