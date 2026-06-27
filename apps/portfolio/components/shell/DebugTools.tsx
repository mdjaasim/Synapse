"use client";

import { FEATURE_FLAGS } from "@synapse/config";
import { useSettingsStore } from "../../hooks/use-stores";
import { AnimationDebugOverlay } from "./AnimationDebugOverlay";

/** Developer tools slot, gated by feature flag or developer mode. */
export function DebugTools() {
  const developerMode = useSettingsStore((state) => state.developerMode);

  if (!FEATURE_FLAGS.debugTools && !developerMode) {
    return null;
  }

  return <AnimationDebugOverlay />;
}
