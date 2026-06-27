"use client";

import type { CameraStoreState } from "@synapse/camera";
import type { InteractionStoreState } from "@synapse/interactions";
import { useStore } from "zustand";
import { useStoresContext } from "../providers/StoresProvider";
import type { DebugStoreState } from "../stores/debug.store";
import type { SettingsStoreState } from "../stores/settings.store";

/** Subscribes to a slice of camera state. */
export function useCameraStore<T>(selector: (state: CameraStoreState) => T): T {
  const { camera } = useStoresContext();
  return useStore(camera, selector);
}

/** Subscribes to a slice of interaction state. */
export function useInteractionStore<T>(selector: (state: InteractionStoreState) => T): T {
  const { interaction } = useStoresContext();
  return useStore(interaction, selector);
}

/** Subscribes to a slice of persisted settings. */
export function useSettingsStore<T>(selector: (state: SettingsStoreState) => T): T {
  const { settings } = useStoresContext();
  return useStore(settings, selector);
}

/** Subscribes to a slice of debug state. */
export function useDebugStore<T>(selector: (state: DebugStoreState) => T): T {
  const { debug } = useStoresContext();
  return useStore(debug, selector);
}
