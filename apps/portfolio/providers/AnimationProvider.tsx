"use client";

import {
  createAnimationEngine,
  type AnimationEngine,
  type TimelineDefinition,
} from "@synapse/animation";
import { createOriginVoidCameraChoreography } from "@synapse/camera";
import { createSafeContext } from "@synapse/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { useExperienceContext } from "./ExperienceProvider";
import { useCameraContext } from "./CameraProvider";
import { useStoresContext } from "./StoresProvider";

const [AnimationContext, useAnimationContext] =
  createSafeContext<AnimationEngine>("AnimationProvider");

export { useAnimationContext };

/**
 * Instantiates the Animation Engine, registers the Origin Void camera
 * choreography, and wires scroll progress to the experience store.
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
      onScrollProgress: (progress) => {
        experienceEngine.stores.experience.getState().setStoryProgress(progress);
        experienceEngine.bus.publish("experience.storyProgress", { progress });
      },
    });
    const choreography = createOriginVoidCameraChoreography(cameraController.narrativePose);
    eng.register(choreography as TimelineDefinition);
    return eng;
  });

  useEffect(() => {
    return () => {
      engine.dispose();
    };
  }, [engine]);

  return <AnimationContext.Provider value={engine}>{children}</AnimationContext.Provider>;
}
