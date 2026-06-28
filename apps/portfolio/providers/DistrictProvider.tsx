"use client";

import {
  createDistrictController,
  createWorldRoot,
  type DistrictContext,
  type DistrictController,
} from "@synapse/world";
import { createDistrictCameraAdapter } from "@synapse/camera";
import { createSafeContext } from "@synapse/hooks";
import type { SynapseEventBus } from "@synapse/types";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useExperienceContext } from "./ExperienceProvider";
import { useCameraContext } from "./CameraProvider";
import { useStoresContext } from "./StoresProvider";

export interface DistrictContextValue {
  readonly controller: DistrictController;
  bindRenderContext(ctx: DistrictContext): void;
}

const [DistrictContextProvider, useDistrictContext] =
  createSafeContext<DistrictContextValue>("DistrictProvider");

export { useDistrictContext };

export interface DistrictProviderProps {
  readonly children: ReactNode;
  readonly bus: SynapseEventBus;
}

/**
 * Thin DI provider — exposes {@link DistrictController} only.
 * Navigation state is owned exclusively by SceneDirector.
 */
export function DistrictProvider({ children, bus }: DistrictProviderProps) {
  const cameraController = useCameraContext();
  const { settings } = useStoresContext();
  const renderContextRef = useRef<DistrictContext | null>(null);
  const worldRootRef = useRef(createWorldRoot());

  const controller = useMemo(() => {
    return createDistrictController({
      worldRoot: worldRootRef.current,
      bus,
      camera: createDistrictCameraAdapter(cameraController),
      getContext: () => renderContextRef.current,
      getReducedMotion: () => settings.getState().reducedMotion,
    });
  }, [bus, cameraController, settings]);

  useEffect(() => {
    return () => {
      controller.dispose();
      worldRootRef.current.dispose();
    };
  }, [controller]);

  const value = useMemo<DistrictContextValue>(
    () => ({
      controller,
      bindRenderContext(ctx: DistrictContext) {
        renderContextRef.current = ctx;
      },
    }),
    [controller],
  );

  return <DistrictContextProvider value={value}>{children}</DistrictContextProvider>;
}

/** Inner provider wired to ExperienceEngine bus — use inside ExperienceProvider. */
export function DistrictProviderFromEngine({ children }: { children: ReactNode }) {
  const engine = useExperienceContext();
  return <DistrictProvider bus={engine.bus}>{children}</DistrictProvider>;
}
