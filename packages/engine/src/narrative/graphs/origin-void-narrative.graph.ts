import type { NarrativeGraph } from "@synapse/types";

/**
 * Placeholder narrative graph for Phase 5B — Origin Void linear story only.
 * Four nodes aligned with ScrollStage beats; all districts remain `origin`.
 */
export const ORIGIN_VOID_NARRATIVE_GRAPH: NarrativeGraph = {
  id: "origin-void",
  title: "Origin Void",
  entryNodeId: "origin:spark",
  chapters: [
    {
      id: "chapter:origin-void",
      title: "Origin Void",
      nodeIds: ["origin:spark", "origin:awakening", "origin:depth", "origin:horizon"],
      scrollRange: { start: 0, end: 1 },
      mood: "calm",
    },
  ],
  nodes: [
    {
      id: "origin:spark",
      title: "Spark",
      districtId: "origin",
      cameraProfileId: "origin-default",
      transitionKind: "fade",
      scrollRange: { start: 0, end: 0.25 },
      loadingRequirements: { retainOrigin: true, preloadAdjacent: true },
      checkpoint: true,
      revisitable: true,
      enabled: true,
    },
    {
      id: "origin:awakening",
      title: "Awakening",
      districtId: "origin",
      cameraProfileId: "origin-default",
      transitionKind: "fade",
      scrollRange: { start: 0.25, end: 0.5 },
      loadingRequirements: { retainOrigin: true, preloadAdjacent: true },
      revisitable: true,
      enabled: true,
    },
    {
      id: "origin:depth",
      title: "Depth",
      districtId: "origin",
      cameraProfileId: "origin-default",
      transitionKind: "fade",
      scrollRange: { start: 0.5, end: 0.75 },
      loadingRequirements: { retainOrigin: true, preloadAdjacent: true },
      revisitable: true,
      enabled: true,
    },
    {
      id: "origin:horizon",
      title: "Horizon",
      districtId: "origin",
      cameraProfileId: "origin-default",
      transitionKind: "fade",
      scrollRange: { start: 0.75, end: 1 },
      loadingRequirements: { retainOrigin: true },
      revisitable: true,
      enabled: true,
    },
    {
      id: "memory-stream:placeholder",
      title: "Memory Stream (future)",
      districtId: "memory-stream",
      cameraProfileId: "memory-stream-default",
      transitionKind: "camera-flight",
      scrollRange: { start: 1, end: 1 },
      loadingRequirements: { retainOrigin: true },
      optional: true,
      enabled: false,
    },
  ],
  edges: [
    { from: "origin:spark", to: "origin:awakening" },
    { from: "origin:awakening", to: "origin:depth" },
    { from: "origin:depth", to: "origin:horizon" },
  ],
};

export function registerOriginVoidGraph(registry: { register(graph: NarrativeGraph): void }): void {
  registry.register(ORIGIN_VOID_NARRATIVE_GRAPH);
}
