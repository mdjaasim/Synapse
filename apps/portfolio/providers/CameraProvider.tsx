"use client";

import { createCameraController, ORIGIN_VOID_CAMERA, type CameraController } from "@synapse/camera";
import { createSafeContext } from "@synapse/hooks";
import { useState, type ReactNode } from "react";

const [CameraContext, useCameraContext] = createSafeContext<CameraController>("CameraProvider");

export { useCameraContext };

/** Instantiates the CameraController via DI and exposes it through context. */
export function CameraProvider({ children }: { children: ReactNode }) {
  const [controller] = useState(() => createCameraController({ preset: ORIGIN_VOID_CAMERA }));

  return <CameraContext.Provider value={controller}>{children}</CameraContext.Provider>;
}
