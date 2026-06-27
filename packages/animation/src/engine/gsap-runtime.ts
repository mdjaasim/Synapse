import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

/**
 * One-time GSAP runtime setup. Registers ScrollTrigger and configures the
 * ticker for deterministic, low-latency scrubbing. Called once per engine
 * instance; safe to call multiple times (idempotent).
 */
export function initGsapRuntime(): void {
  if (initialized) {
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  initialized = true;
}

export { gsap, ScrollTrigger };
