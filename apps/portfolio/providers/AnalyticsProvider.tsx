"use client";

import { FEATURE_FLAGS } from "@synapse/config";
import { createSafeContext } from "@synapse/hooks";
import { useEffect, useState, type ReactNode } from "react";
import { createAnalyticsStore, type AnalyticsStore } from "../stores/analytics.store";
import { useExperienceContext } from "./ExperienceProvider";

const [AnalyticsContext, useAnalyticsContext] =
  createSafeContext<AnalyticsStore>("AnalyticsProvider");

export { useAnalyticsContext };

/** Instantiates the session analytics store and wires narrative event hooks. */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createAnalyticsStore());
  const engine = useExperienceContext();

  useEffect(() => {
    if (!FEATURE_FLAGS.analytics) {
      return;
    }
    const unsubs = [
      engine.bus.subscribe("story.nodeEnter", ({ districtId }) => {
        store.getState().track("district.enter", { districtId });
        store.getState().markDiscovery(districtId);
      }),
      engine.bus.subscribe("story.completed", () => {
        store.getState().track("story.completed");
      }),
      engine.bus.subscribe("experience.storyProgress", ({ progress }) => {
        if (progress >= 0.25 && progress < 0.26) {
          store.getState().track("story.quarter");
        }
        if (progress >= 0.5 && progress < 0.51) {
          store.getState().track("story.half");
        }
        if (progress >= 0.75 && progress < 0.76) {
          store.getState().track("story.threeQuarter");
        }
      }),
    ];
    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [engine.bus, store]);

  return <AnalyticsContext.Provider value={store}>{children}</AnalyticsContext.Provider>;
}
