"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { SceneState } from "@synapse/types";
import { useSceneDirectorContext } from "../providers/SceneDirectorProvider";

function subscribe(onStoreChange: () => void) {
  const interval = setInterval(onStoreChange, 250);
  return () => clearInterval(interval);
}

/** Subscribes to SceneDirector-owned navigation state for UI and debug tooling. */
export function useScene(): SceneState & {
  readonly navigateToNode: (nodeId: string) => void;
  readonly navigateToDistrict: (districtId: NonNullable<SceneState["currentDistrictId"]>) => void;
} {
  const { sceneDirector, navigateToNode } = useSceneDirectorContext();

  const getSnapshot = useCallback(() => sceneDirector.sceneState.getState(), [sceneDirector]);

  const scene = useSyncExternalStore((cb) => subscribe(cb), getSnapshot, getSnapshot);

  const navigateToDistrict = useCallback(
    (districtId: NonNullable<SceneState["currentDistrictId"]>) => {
      void sceneDirector.navigateToDistrict(districtId);
    },
    [sceneDirector],
  );

  return { ...scene, navigateToNode, navigateToDistrict };
}
