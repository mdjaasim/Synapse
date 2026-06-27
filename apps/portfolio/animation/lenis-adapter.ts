import type Lenis from "lenis";
import type { SmoothScrollAdapter } from "@synapse/animation";

/** Wraps a Lenis instance as a SmoothScrollAdapter for the Animation Engine. */
export function createLenisAdapter(lenis: Lenis): SmoothScrollAdapter {
  return {
    get scroll() {
      return lenis.scroll;
    },
    get limit() {
      return lenis.limit;
    },
    get progress() {
      return lenis.limit > 0 ? lenis.scroll / lenis.limit : 0;
    },
    scrollTo(value: number) {
      lenis.scrollTo(value, { immediate: true });
    },
    onScroll(callback: () => void) {
      lenis.on("scroll", callback);
      return () => {
        lenis.off("scroll", callback);
      };
    },
    raf(time: number) {
      lenis.raf(time);
    },
    destroy() {
      lenis.destroy();
    },
  };
}
