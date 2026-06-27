/**
 * Lenis-agnostic smooth-scroll adapter interface. The animation package
 * depends on this contract, not on Lenis directly. The app implements it
 * by wrapping a Lenis instance.
 */
export interface SmoothScrollAdapter {
  /** Current scroll position in pixels. */
  readonly scroll: number;
  /** Maximum scrollable distance in pixels. */
  readonly limit: number;
  /** Normalized scroll progress 0..1. */
  readonly progress: number;
  /** Jump to a scroll position (used by ScrollTrigger scrollerProxy). */
  scrollTo(value: number): void;
  /** Register a scroll callback. Returns an unsubscribe function. */
  onScroll(callback: () => void): () => void;
  /** Advance the smooth-scroll engine (call from rAF). */
  raf(time: number): void;
  /** Destroy the smooth-scroll engine. */
  destroy(): void;
}
