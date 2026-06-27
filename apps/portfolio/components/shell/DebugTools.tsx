"use client";

import { FEATURE_FLAGS } from "@synapse/config";
import { useSettingsStore } from "../../hooks/use-stores";

/**
 * Developer tools slot, gated by the feature flag or developer mode. Inspector
 * and overlays arrive in the debug tooling phase.
 */
export function DebugTools() {
  const developerMode = useSettingsStore((state) => state.developerMode);

  if (!FEATURE_FLAGS.debugTools && !developerMode) {
    return null;
  }

  return null;
}
