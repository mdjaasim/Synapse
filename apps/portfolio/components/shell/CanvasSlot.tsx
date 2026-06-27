"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { FEATURE_FLAGS, THEME } from "@synapse/config";
import { useExperienceContext } from "../../providers/ExperienceProvider";
import { useFrameStateSource } from "../../rendering/use-frame-state-source";

/**
 * The renderer is loaded client-side only (it touches WebGL/`window`) and sits
 * in a fixed, full-viewport background layer behind the HUD.
 */
const ExperienceCanvas = dynamic(
  () => import("@synapse/renderer").then((mod) => mod.ExperienceCanvas),
  { ssr: false },
);

/** Mount point for the React Three Fiber canvas. */
export function CanvasSlot() {
  const engine = useExperienceContext();
  const source = useFrameStateSource();

  useEffect(() => {
    engine.stores.experience.getState().setWorldPhase("active");
    return () => {
      engine.stores.experience.getState().setWorldPhase("dormant");
    };
  }, [engine]);

  if (!FEATURE_FLAGS.canvas) {
    return <div aria-hidden className="fixed inset-0 -z-10" data-slot="canvas" />;
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10" data-slot="canvas">
      <ExperienceCanvas
        source={source}
        themeColor={THEME.colors.accent}
        onStats={({ fps }) => engine.stores.performance.getState().setFps(fps)}
      />
    </div>
  );
}
