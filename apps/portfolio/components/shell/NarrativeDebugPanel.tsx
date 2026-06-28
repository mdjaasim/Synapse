"use client";

import { useScene } from "../../hooks/use-scene";
import { useSettingsStore } from "../../hooks/use-stores";

/**
 * Developer panel for SceneDirector navigation state.
 * Visible when developer mode is enabled.
 */
export function NarrativeDebugPanel() {
  const developerMode = useSettingsStore((s) => s.developerMode);
  const scene = useScene();

  if (!developerMode) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed top-4 right-4 z-50 max-w-sm rounded-lg border border-neutral-800 bg-black/80 p-3 font-mono text-[10px] leading-relaxed text-neutral-400 backdrop-blur-sm"
      aria-hidden
    >
      <p className="mb-1 text-neutral-500">Narrative Debug</p>
      <p>graph: {scene.graphId ?? "none"}</p>
      <p>chapter: {scene.currentChapterId ?? "none"}</p>
      <p>node: {scene.currentNodeId ?? "none"}</p>
      <p>district: {scene.currentDistrictId ?? "none"}</p>
      <p>direction: {scene.navigationDirection}</p>
      <p>transition: {scene.transitionState}</p>
      <p>loading: {scene.loadingState}</p>
      <p>scroll: {(scene.totalProgress * 100).toFixed(1)}%</p>
      <p>node-local: {(scene.nodeLocalProgress * 100).toFixed(1)}%</p>
      <p>checkpoint: {scene.checkpointNodeId ?? "none"}</p>
      <p>preload: {scene.preloadQueue.join(", ") || "none"}</p>
      <p>
        started: {String(scene.storyStarted)} completed: {String(scene.storyCompleted)}
      </p>
      <p>paused: {String(scene.narrativePaused)}</p>
    </div>
  );
}
