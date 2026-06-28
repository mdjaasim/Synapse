"use client";

import {
  createSceneDirectorBundle,
  type SceneDirector,
  type ScrollDirector,
} from "@synapse/engine";
import { createCameraFlightController } from "@synapse/camera";
import { createSafeContext } from "@synapse/hooks";
import type { AnimationCommandPort, CameraCommandPort, DistrictCommandPort } from "@synapse/types";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useExperienceContext } from "./ExperienceProvider";
import { useCameraContext } from "./CameraProvider";
import { useDistrictContext } from "./DistrictProvider";
import { useAnimationContext } from "./AnimationProvider";

export interface SceneDirectorContextValue {
  readonly sceneDirector: SceneDirector;
  readonly scrollDirector: ScrollDirector;
  readonly navigateToNode: (nodeId: string) => void;
  readonly onRenderContextReady: () => Promise<void>;
}

const [SceneDirectorContextProvider, useSceneDirectorContext] =
  createSafeContext<SceneDirectorContextValue>("SceneDirectorProvider");

export { useSceneDirectorContext };

/**
 * Wires SceneDirector as the sole navigation state authority via injected ports.
 * Providers above remain thin DI only — no store mutations here except through director.
 */
export function SceneDirectorProvider({ children }: { children: ReactNode }) {
  const experienceEngine = useExperienceContext();
  const cameraController = useCameraContext();
  const { controller: districtController } = useDistrictContext();
  const animationEngine = useAnimationContext();

  const [flightController] = useState(() => createCameraFlightController(cameraController));

  const bundle = useMemo(() => {
    const districtPort: DistrictCommandPort = {
      navigateTo: (to, kind) => districtController.navigateTo(to, kind),
      ensureLoaded: (id) => districtController.ensureLoaded(id),
      isLoaded: (id) => districtController.loader.isLoaded(id),
      getManifest: (id) => districtController.getManifest(id),
      getSnapshot: () => districtController.getSnapshot(),
    };

    const cameraPort: CameraCommandPort = {
      focusDistrict: (manifest) => cameraController.focusDistrict(manifest),
      transitionTo: (manifest, profileId) => cameraController.transitionTo(manifest, profileId),
      saveCheckpoint: (nodeId) => flightController.saveCheckpoint(nodeId),
      restoreCheckpoint: (checkpoint) => flightController.restoreCheckpoint(checkpoint),
      beginFlight: (plan) => {
        void flightController.beginFlight(plan);
      },
      interruptFlight: () => flightController.interruptFlight(),
      savePose: () => cameraController.savePose(),
      restorePose: (pose) => cameraController.restorePose(pose),
    };

    const animationPort: AnimationCommandPort = {
      registerTimeline: (definition) => {
        animationEngine.register(definition as Parameters<typeof animationEngine.register>[0]);
      },
      scrubTimeline: (id, progress) => {
        try {
          animationEngine.get(id).scrub(progress);
        } catch {
          /* timeline not registered */
        }
      },
      interruptTimeline: (id) => animationEngine.interrupt(id),
      getScrollProgress: () => animationEngine.scrollProgress,
    };

    return createSceneDirectorBundle({
      bus: experienceEngine.bus,
      experienceStore: experienceEngine.stores.experience,
      district: districtPort,
      camera: cameraPort,
      animation: animationPort,
    });
  }, [experienceEngine, districtController, cameraController, flightController, animationEngine]);

  useEffect(() => {
    animationEngine.setScrollProgressHandler((progress) => {
      bundle.scrollDirector.onProgress(progress);
    });

    return () => {
      bundle.sceneDirector.dispose();
      flightController.dispose();
    };
  }, [animationEngine, bundle, flightController]);

  const value = useMemo<SceneDirectorContextValue>(
    () => ({
      sceneDirector: bundle.sceneDirector,
      scrollDirector: bundle.scrollDirector,
      navigateToNode: (nodeId) => {
        void bundle.sceneDirector.navigateToNode(nodeId);
      },
      onRenderContextReady: () => bundle.sceneDirector.onRenderContextReady(),
    }),
    [bundle],
  );

  return <SceneDirectorContextProvider value={value}>{children}</SceneDirectorContextProvider>;
}
