"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { DistrictFrameworkSnapshot } from "@synapse/types";
import { useDistrictContext } from "../providers/DistrictProvider";
import { useScene } from "./use-scene";

function subscribe(onStoreChange: () => void) {
  const interval = setInterval(onStoreChange, 250);
  return () => clearInterval(interval);
}

/**
 * Subscribes to district framework state for UI and debug tooling.
 * Navigation commands route through SceneDirector — not DistrictController directly.
 */
export function useDistrict(): DistrictFrameworkSnapshot & {
  readonly storyProgress: number;
  readonly navigateTo: (id: DistrictFrameworkSnapshot["currentDistrictId"]) => void;
} {
  const { controller } = useDistrictContext();
  const scene = useScene();

  const getSnapshot = useCallback(() => controller.getSnapshot(), [controller]);

  const snapshot = useSyncExternalStore((cb) => subscribe(cb), getSnapshot, getSnapshot);

  const navigateTo = useCallback(
    (id: DistrictFrameworkSnapshot["currentDistrictId"]) => {
      if (id) {
        scene.navigateToDistrict(id);
      }
    },
    [scene],
  );

  return { ...snapshot, storyProgress: scene.totalProgress, navigateTo };
}
