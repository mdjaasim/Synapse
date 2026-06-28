"use client";

import { useMemo } from "react";
import type { DynamicFrameState, FrameStateSource, Mood } from "@synapse/types";
import { useExperienceContext } from "../providers/ExperienceProvider";
import { useStoresContext } from "../providers/StoresProvider";
import { useDistrictContext } from "../providers/DistrictProvider";

/** Mood -> ambient energy. Drives the breathing pulse and rim intensity. */
const MOOD_ENERGY: Record<Mood, number> = {
  calm: 0.3,
  curious: 0.5,
  focused: 0.7,
  celebratory: 1,
  reflective: 0.4,
};

/**
 * Builds the renderer's {@link FrameStateSource}. This is the application's
 * adapter from its stores to the renderer: the renderer observes state by
 * calling `read()` each frame (via getState, so it never triggers React
 * re-renders). The engine remains completely renderer-agnostic.
 */
export function useFrameStateSource(): FrameStateSource {
  const engine = useExperienceContext();
  const { settings, interaction } = useStoresContext();
  const { controller } = useDistrictContext();

  return useMemo<FrameStateSource>(
    () => ({
      read(): DynamicFrameState {
        const experience = engine.stores.experience.getState();
        const performance = engine.stores.performance.getState();
        const setting = settings.getState();
        const inter = interaction.getState();
        const transition = controller.getSnapshot().transition;
        return {
          mood: experience.mood,
          energy: MOOD_ENERGY[experience.mood],
          focus: experience.focusedArtifactId ? 1 : 0,
          interaction: inter.isPointerDown ? 1 : 0,
          scroll: experience.storyProgress,
          quality: performance.qualityPreset,
          reducedMotion: setting.reducedMotion,
          currentDistrict: experience.currentDistrict,
          transitionProgress: transition.active ? transition.progress : 1,
        };
      },
    }),
    [engine, settings, interaction, controller],
  );
}
