/**
 * Named easing curves (Document 25). Timelines reference these instead of
 * hardcoding GSAP ease strings.
 */

export const MOTION_CURVES = {
  linear: "none",
  easeOut: "power2.out",
  easeInOut: "power2.inOut",
  cinematic: "power3.inOut",
  soft: "sine.inOut",
  snap: "power4.out",
  elastic: "elastic.out(1, 0.5)",
} as const;

export type MotionCurve = keyof typeof MOTION_CURVES;

/** Resolves a curve token (or raw GSAP ease string) to a string. */
export function resolveCurve(curve: MotionCurve | string): string {
  if (curve in MOTION_CURVES) {
    return MOTION_CURVES[curve as MotionCurve];
  }
  return curve;
}
