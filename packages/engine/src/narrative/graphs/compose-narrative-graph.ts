import type {
  DistrictId,
  NarrativeChapter,
  NarrativeEdge,
  NarrativeGraph,
  StoryNode,
} from "@synapse/types";

export interface NarrativeSegment {
  readonly chapter: NarrativeChapter;
  readonly nodes: readonly StoryNode[];
  readonly edges: readonly NarrativeEdge[];
}

export function composeNarrativeGraph(
  id: string,
  title: string,
  entryNodeId: string,
  segments: readonly NarrativeSegment[],
): NarrativeGraph {
  const chapters: NarrativeChapter[] = [];
  const nodes: StoryNode[] = [];
  const edges: NarrativeEdge[] = [];

  for (const segment of segments) {
    chapters.push(segment.chapter);
    nodes.push(...segment.nodes);
    edges.push(...segment.edges);
  }

  return { id, title, entryNodeId, chapters, nodes, edges };
}

export function nodePair(
  districtId: DistrictId,
  prefix: string,
  titles: readonly [string, string],
  scrollStart: number,
  scrollEnd: number,
  transitionKind: StoryNode["transitionKind"] = "camera-flight",
): NarrativeSegment {
  const mid = scrollStart + (scrollEnd - scrollStart) / 2;
  const n1: StoryNode = {
    id: `${districtId}:${prefix}-enter`,
    title: titles[0],
    districtId,
    cameraProfileId: "default",
    transitionKind,
    scrollRange: { start: scrollStart, end: mid },
    loadingRequirements: { retainOrigin: true, preloadAdjacent: true },
    revisitable: true,
    enabled: true,
  };
  const n2: StoryNode = {
    id: `${districtId}:${prefix}-depth`,
    title: titles[1],
    districtId,
    cameraProfileId: "default",
    transitionKind: "crossfade",
    scrollRange: { start: mid, end: scrollEnd },
    loadingRequirements: { retainOrigin: true },
    revisitable: true,
    enabled: true,
  };

  return {
    chapter: {
      id: `chapter:${districtId}`,
      title: titles[0],
      nodeIds: [n1.id, n2.id],
      scrollRange: { start: scrollStart, end: scrollEnd },
    },
    nodes: [n1, n2],
    edges: [{ from: n1.id, to: n2.id }],
  };
}
