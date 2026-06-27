"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { FEATURE_FLAGS, THEME } from "@synapse/config";
import { useExperienceContext } from "../../providers/ExperienceProvider";
import { useCameraContext } from "../../providers/CameraProvider";
import { useEnvironmentContext } from "../../providers/EnvironmentProvider";
import { useFrameStateSource } from "../../rendering/use-frame-state-source";

const ExperienceCanvas = dynamic(
  () => import("@synapse/renderer").then((mod) => mod.ExperienceCanvas),
  { ssr: false },
);

/** Mount point for the React Three Fiber canvas. */
export function CanvasSlot() {
  const engine = useExperienceContext();
  const cameraController = useCameraContext();
  const source = useFrameStateSource();
  const environmentSource = useEnvironmentContext();

  useEffect(() => {
    engine.stores.experience.getState().setWorldPhase("active");
    engine.stores.experience.getState().setDistrict("origin");
    return () => {
      engine.stores.experience.getState().setWorldPhase("dormant");
      engine.stores.experience.getState().setDistrict(null);
    };
  }, [engine]);

  if (!FEATURE_FLAGS.canvas) {
    return <div aria-hidden className="fixed inset-0 -z-10" data-slot="canvas" />;
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10" data-slot="canvas">
      <ExperienceCanvas
        source={source}
        environmentSource={environmentSource}
        cameraController={cameraController}
        themeColor={THEME.colors.accent}
        onStats={({ fps }) => engine.stores.performance.getState().setFps(fps)}
      />
    </div>
  );
}
