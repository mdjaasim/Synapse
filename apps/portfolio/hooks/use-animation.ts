"use client";

import { useAnimationContext } from "../providers/AnimationProvider";

/** Typed access to the Animation Engine from React context. */
export function useAnimationEngine() {
  return useAnimationContext();
}
