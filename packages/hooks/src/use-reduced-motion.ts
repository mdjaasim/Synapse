import { useMediaQuery } from "./use-media-query";

/** Returns whether the user has requested reduced motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
