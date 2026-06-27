"use client";

import { useAnimationEngine } from "../../hooks/use-animation";
import { useExperienceStore, usePerformanceStore } from "../../hooks/use-experience";
import { useSettingsStore } from "../../hooks/use-stores";
import { useEnvironmentContext } from "../../providers/EnvironmentProvider";
import type { ActiveTimelineInfo } from "@synapse/animation";

/**
 * Developer overlay showing active timelines, scroll progress, environment
 * simulation, budget, and fps. Visible when developer mode is enabled.
 */
export function AnimationDebugOverlay() {
  const engine = useAnimationEngine();
  const environment = useEnvironmentContext();
  const storyProgress = useExperienceStore((s) => s.storyProgress);
  const fps = usePerformanceStore((s) => s.fps);
  const developerMode = useSettingsStore((s) => s.developerMode);

  if (!developerMode) {
    return null;
  }

  const env = environment.read();
  const timelines = engine.getActiveTimelines();
  const budget = engine.budget.getAllActive();

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 max-w-xs rounded-lg border border-neutral-800 bg-black/80 p-3 font-mono text-[10px] leading-relaxed text-neutral-400 backdrop-blur-sm"
      aria-hidden
    >
      <p className="mb-1 text-neutral-500">Animation Debug</p>
      <p>scroll: {(storyProgress * 100).toFixed(1)}%</p>
      <p>fps: {fps.toFixed(0)}</p>
      <p>breath: {env.breath.toFixed(4)}</p>
      <p>fog: {env.fogDensity.toFixed(3)}</p>
      <p>energy: {env.energyFlow.toFixed(3)}</p>
      <p>light: {env.lightBias.toFixed(3)}</p>
      <p>timelines: {timelines.length}</p>
      {timelines.map((tl: ActiveTimelineInfo) => (
        <p key={tl.id} className="pl-2 text-neutral-600">
          {tl.id} [{tl.state}] {tl.scrollBound ? "scroll" : "time"}
        </p>
      ))}
      {Object.keys(budget).length > 0 && (
        <>
          <p className="mt-1 text-neutral-500">budget</p>
          {Object.entries(budget).map(([cat, ids]: [string, readonly string[]]) => (
            <p key={cat} className="pl-2 text-neutral-600">
              {cat}: {ids.join(", ")}
            </p>
          ))}
        </>
      )}
    </div>
  );
}
