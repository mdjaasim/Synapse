"use client";

import { createCameraStore, type CameraStore } from "@synapse/camera";
import { createInteractionStore, type InteractionStore } from "@synapse/interactions";
import { createSafeContext } from "@synapse/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { createDebugStore, type DebugStore } from "../stores/debug.store";
import { createSettingsStore, type SettingsStore } from "../stores/settings.store";

export interface AppStores {
  readonly camera: CameraStore;
  readonly interaction: InteractionStore;
  readonly settings: SettingsStore;
  readonly debug: DebugStore;
}

const [StoresContext, useStoresContext] = createSafeContext<AppStores>("StoresProvider");

export { useStoresContext };

/**
 * Dependency-injection container for stores without a dedicated provider:
 * camera, interaction, settings (persisted), and debug.
 */
export function StoresProvider({ children }: { children: ReactNode }) {
  const [stores] = useState<AppStores>(() => ({
    camera: createCameraStore(),
    interaction: createInteractionStore(),
    settings: createSettingsStore(),
    debug: createDebugStore(),
  }));

  useEffect(() => {
    void stores.settings.persist.rehydrate();
  }, [stores]);

  return <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>;
}
