"use client";

import dynamic from "next/dynamic";
import { FEATURE_FLAGS, THEME } from "@synapse/config";
import { useExperienceContext } from "../../providers/ExperienceProvider";
import { useCameraContext } from "../../providers/CameraProvider";
import { useEnvironmentContext } from "../../providers/EnvironmentProvider";
import { useDistrictContext } from "../../providers/DistrictProvider";
import { useSceneDirectorContext } from "../../providers/SceneDirectorProvider";
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
  const { controller, bindRenderContext } = useDistrictContext();
  const { onRenderContextReady } = useSceneDirectorContext();

  if (!FEATURE_FLAGS.canvas) {
    return <div aria-hidden className="fixed inset-0 -z-10" data-slot="canvas" />;
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10" data-slot="canvas">
      <ExperienceCanvas
        source={source}
        environmentSource={environmentSource}
        cameraController={cameraController}
        districtController={controller}
        bindRenderContext={bindRenderContext}
        onRenderContextReady={() => onRenderContextReady()}
        themeColor={THEME.colors.accent}
        onStats={({ fps }) => engine.stores.performance.getState().setFps(fps)}
        onQualityChange={(preset) => {
          const current = engine.stores.performance.getState().qualityPreset;
          if (current !== preset) {
            engine.stores.performance.getState().setQualityPreset(preset);
          }
        }}
      />
    </div>
  );
}
