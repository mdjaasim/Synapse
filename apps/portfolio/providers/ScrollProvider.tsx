"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@synapse/animation";
import { useStore } from "zustand";
import { useEffect, type ReactNode } from "react";
import { createLenisAdapter } from "../animation/lenis-adapter";
import { useAnimationContext } from "./AnimationProvider";
import { useStoresContext } from "./StoresProvider";

/**
 * Creates Lenis smooth-scroll (when reduced motion is off), connects it to
 * the Animation Engine's scroll orchestrator, and drives Lenis via the GSAP
 * ticker. StrictMode-safe teardown on unmount.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const engine = useAnimationContext();
  const { settings } = useStoresContext();
  const reducedMotion = useStore(settings, (s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      engine.connectSmoothScroll();
      return () => {
        engine.scroll.disconnect();
      };
    }

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.085,
      touchMultiplier: 1.4,
    });

    const adapter = createLenisAdapter(lenis);
    engine.connectSmoothScroll(adapter);
    ScrollTrigger.refresh();

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);

    return () => {
      gsap.ticker.remove(onTick);
      adapter.destroy();
      engine.scroll.disconnect();
    };
  }, [engine, reducedMotion]);

  return <>{children}</>;
}
