"use client";

import {
  createAnimationEngine,
  type AnimationEngine,
  type TimelineDefinition,
} from "@synapse/animation";
import { registerAllDistrictChoreographies } from "@synapse/camera";
import { createSafeContext } from "@synapse/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { useExperienceContext } from "./ExperienceProvider";
import { useCameraContext } from "./CameraProvider";
import { useStoresContext } from "./StoresProvider";

const [AnimationContext, useAnimationContext] =
  createSafeContext<AnimationEngine>("AnimationProvider");

export { useAnimationContext };

/**
 * Instantiates the Animation Engine and registers all district camera choreographies.
 * SceneDirector scrubs the active district timeline via the animation command port.
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  const experienceEngine = useExperienceContext();
  const cameraController = useCameraContext();
  const { settings } = useStoresContext();

  const [engine] = useState(() => {
    const eng = createAnimationEngine({
      bus: experienceEngine.bus,
      getReducedMotion: () => settings.getState().reducedMotion,
      getQuality: () => experienceEngine.stores.performance.getState().qualityPreset,
    });
    registerAllDistrictChoreographies(cameraController.narrativePose, (def) => {
      eng.register(def as TimelineDefinition);
    });
    return eng;
  });

  useEffect(() => {
    return () => {
      engine.dispose();
    };
  }, [engine]);

  return <AnimationContext.Provider value={engine}>{children}</AnimationContext.Provider>;
}
