import { ScrollTrigger } from "../engine/gsap-runtime";
import type { SmoothScrollAdapter } from "./scroll-adapter";

export interface ScrollOrchestratorOptions {
  readonly onProgress: (progress: number) => void;
  readonly getReducedMotion: () => boolean;
}

/**
 * Scroll orchestrator: creates a master ScrollTrigger that proxies to a
 * SmoothScrollAdapter (Lenis in the app). Reports normalized progress and
 * scrubs scroll-bound timelines. ScrollTrigger is the single computation
 * point for scroll progress.
 */
export class ScrollOrchestrator {
  readonly #onProgress: (progress: number) => void;
  readonly #getReducedMotion: () => boolean;
  #adapter: SmoothScrollAdapter | null = null;
  #trigger: ScrollTrigger | null = null;
  #unsubscribeScroll: (() => void) | null = null;
  #scrubCallbacks: Array<(progress: number) => void> = [];

  constructor({ onProgress, getReducedMotion }: ScrollOrchestratorOptions) {
    this.#onProgress = onProgress;
    this.#getReducedMotion = getReducedMotion;
  }

  /** Connect a smooth-scroll adapter and create the master ScrollTrigger. */
  connect(adapter?: SmoothScrollAdapter): void {
    this.disconnect();

    if (this.#getReducedMotion()) {
      this.#setupNativeScroll();
      return;
    }

    if (!adapter) {
      this.#setupNativeScroll();
      return;
    }

    this.#adapter = adapter;
    this.#setupLenisScroll(adapter);
  }

  /** Register a callback that receives normalized progress for scrubbing. */
  onScrub(callback: (progress: number) => void): () => void {
    this.#scrubCallbacks.push(callback);
    return () => {
      this.#scrubCallbacks = this.#scrubCallbacks.filter((cb) => cb !== callback);
    };
  }

  /** Current normalized scroll progress 0..1. */
  get progress(): number {
    if (this.#adapter) {
      return this.#adapter.progress;
    }
    if (typeof window === "undefined") {
      return 0;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
  }

  disconnect(): void {
    this.#unsubscribeScroll?.();
    this.#unsubscribeScroll = null;
    this.#trigger?.kill();
    this.#trigger = null;
    this.#adapter = null;
  }

  dispose(): void {
    this.disconnect();
    this.#scrubCallbacks = [];
  }

  #emitProgress(progress: number): void {
    const clamped = Math.max(0, Math.min(1, progress));
    this.#onProgress(clamped);
    for (const cb of this.#scrubCallbacks) {
      cb(clamped);
    }
  }

  #setupLenisScroll(adapter: SmoothScrollAdapter): void {
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          adapter.scrollTo(value);
        }
        return adapter.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    this.#trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scroller: document.documentElement,
      onUpdate: (self) => {
        this.#emitProgress(self.progress);
      },
    });

    this.#unsubscribeScroll = adapter.onScroll(() => {
      ScrollTrigger.update();
    });
  }

  #setupNativeScroll(): void {
    const handler = (): void => {
      this.#emitProgress(this.progress);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handler, { passive: true });
      this.#unsubscribeScroll = () => window.removeEventListener("scroll", handler);
      handler();
    }
  }
}

export function createScrollOrchestrator(options: ScrollOrchestratorOptions): ScrollOrchestrator {
  return new ScrollOrchestrator(options);
}
