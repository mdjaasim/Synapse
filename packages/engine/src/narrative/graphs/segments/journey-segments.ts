import type { NarrativeSegment } from "../compose-narrative-graph";
import { nodePair } from "../compose-narrative-graph";

export const ORIGIN_SEGMENT: NarrativeSegment = {
  chapter: {
    id: "chapter:origin-void",
    title: "Origin Void",
    nodeIds: ["origin:spark", "origin:awakening", "origin:depth", "origin:horizon"],
    scrollRange: { start: 0, end: 0.14 },
    mood: "calm",
  },
  nodes: [
    {
      id: "origin:spark",
      title: "Spark",
      districtId: "origin",
      cameraProfileId: "origin-default",
      transitionKind: "fade",
      scrollRange: { start: 0, end: 0.035 },
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
      scrollRange: { start: 0.035, end: 0.07 },
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
      scrollRange: { start: 0.07, end: 0.105 },
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
      scrollRange: { start: 0.105, end: 0.14 },
      loadingRequirements: { retainOrigin: true, preloadAdjacent: true },
      revisitable: true,
      enabled: true,
    },
  ],
  edges: [
    { from: "origin:spark", to: "origin:awakening" },
    { from: "origin:awakening", to: "origin:depth" },
    { from: "origin:depth", to: "origin:horizon" },
  ],
};

export const PROJECT_GALAXY_SEGMENT = nodePair(
  "project-galaxy",
  "galaxy",
  ["Project Discovery", "Orbital Exploration"],
  0.14,
  0.28,
  "camera-flight",
);

export const CLIENT_WORLDS_SEGMENT = nodePair(
  "client-worlds",
  "clients",
  ["Career Timeline", "Client Ecosystems"],
  0.28,
  0.42,
  "camera-flight",
);

export const ENGINEERING_CORE_SEGMENT = nodePair(
  "engineering-core",
  "engineering",
  ["Systems Lattice", "Engineering Philosophy"],
  0.42,
  0.56,
  "crossfade",
);

export const KNOWLEDGE_FOREST_SEGMENT = nodePair(
  "knowledge-forest",
  "forest",
  ["Identity", "Growth"],
  0.56,
  0.7,
  "crossfade",
);

export const AI_OBSERVATORY_SEGMENT = nodePair(
  "ai-observatory",
  "observatory",
  ["Digital Presence", "Talk to Jaasim"],
  0.7,
  0.84,
  "portal",
);

export const MEMORY_STREAM_SEGMENT: NarrativeSegment = {
  chapter: {
    id: "chapter:memory-stream",
    title: "Memory Stream",
    nodeIds: ["memory-stream:contact", "memory-stream:horizon-loop"],
    scrollRange: { start: 0.84, end: 1 },
    mood: "reflective",
  },
  nodes: [
    {
      id: "memory-stream:contact",
      title: "Contact",
      districtId: "memory-stream",
      cameraProfileId: "default",
      transitionKind: "fade",
      scrollRange: { start: 0.84, end: 0.92 },
      loadingRequirements: { retainOrigin: true },
      revisitable: true,
      enabled: true,
    },
    {
      id: "memory-stream:horizon-loop",
      title: "Infinite Future",
      districtId: "memory-stream",
      cameraProfileId: "default",
      transitionKind: "blackout",
      scrollRange: { start: 0.92, end: 1 },
      loadingRequirements: { retainOrigin: true },
      checkpoint: true,
      revisitable: true,
      enabled: true,
    },
  ],
  edges: [{ from: "memory-stream:contact", to: "memory-stream:horizon-loop" }],
};

export const JOURNEY_SEGMENTS = [
  ORIGIN_SEGMENT,
  PROJECT_GALAXY_SEGMENT,
  CLIENT_WORLDS_SEGMENT,
  ENGINEERING_CORE_SEGMENT,
  KNOWLEDGE_FOREST_SEGMENT,
  AI_OBSERVATORY_SEGMENT,
  MEMORY_STREAM_SEGMENT,
] as const;
