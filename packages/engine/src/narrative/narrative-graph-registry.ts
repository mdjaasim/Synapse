import type {
  ChapterId,
  NarrativeChapter,
  NarrativeEdge,
  NarrativeGraph,
  ScrollRange,
  StoryNode,
  StoryNodeId,
} from "@synapse/types";
import { clamp01 } from "@synapse/utils";

/**
 * Registry of narrative graphs. Resolution is data-driven — no district-specific logic.
 */
export class NarrativeGraphRegistry {
  readonly #graphs = new Map<string, NarrativeGraph>();
  readonly #nodeIndex = new Map<string, Map<StoryNodeId, StoryNode>>();
  readonly #chapterIndex = new Map<string, Map<ChapterId, NarrativeChapter>>();

  register(graph: NarrativeGraph): void {
    this.#graphs.set(graph.id, graph);
    const nodes = new Map<StoryNodeId, StoryNode>();
    for (const node of graph.nodes) {
      nodes.set(node.id, node);
    }
    this.#nodeIndex.set(graph.id, nodes);

    const chapters = new Map<ChapterId, NarrativeChapter>();
    for (const chapter of graph.chapters) {
      chapters.set(chapter.id, chapter);
    }
    this.#chapterIndex.set(graph.id, chapters);
  }

  get(graphId: string): NarrativeGraph {
    const graph = this.#graphs.get(graphId);
    if (!graph) {
      throw new Error(`Narrative graph "${graphId}" is not registered.`);
    }
    return graph;
  }

  getNode(graphId: string, nodeId: StoryNodeId): StoryNode {
    const node = this.#nodeIndex.get(graphId)?.get(nodeId);
    if (!node) {
      throw new Error(`Story node "${nodeId}" is not registered in graph "${graphId}".`);
    }
    return node;
  }

  getChapter(graphId: string, chapterId: ChapterId): NarrativeChapter {
    const chapter = this.#chapterIndex.get(graphId)?.get(chapterId);
    if (!chapter) {
      throw new Error(`Chapter "${chapterId}" is not registered in graph "${graphId}".`);
    }
    return chapter;
  }

  findNodeByProgress(graphId: string, progress: number): StoryNode {
    const graph = this.get(graphId);
    const p = clamp01(progress);
    const enabledNodes = graph.nodes.filter((node) => node.enabled !== false);

    for (const node of enabledNodes) {
      if (p >= node.scrollRange.start && p < node.scrollRange.end) {
        return node;
      }
    }

    const last = enabledNodes[enabledNodes.length - 1];
    if (last && p >= last.scrollRange.start) {
      return last;
    }

    return this.getNode(graphId, graph.entryNodeId);
  }

  findChapterByProgress(graphId: string, progress: number): NarrativeChapter {
    const graph = this.get(graphId);
    const p = clamp01(progress);

    for (const chapter of graph.chapters) {
      if (p >= chapter.scrollRange.start && p < chapter.scrollRange.end) {
        return chapter;
      }
    }

    const last = graph.chapters[graph.chapters.length - 1];
    if (last && p >= last.scrollRange.start) {
      return last;
    }

    return (
      graph.chapters[0] ?? {
        id: "unknown",
        title: "Unknown",
        nodeIds: [],
        scrollRange: { start: 0, end: 1 },
      }
    );
  }

  findChapterForNode(graphId: string, nodeId: StoryNodeId): NarrativeChapter | null {
    const graph = this.get(graphId);
    for (const chapter of graph.chapters) {
      if (chapter.nodeIds.includes(nodeId)) {
        return chapter;
      }
    }
    return null;
  }

  computeNodeLocalProgress(node: StoryNode, totalProgress: number): number {
    const range = node.scrollRange;
    const span = Math.max(range.end - range.start, Number.EPSILON);
    return clamp01((clamp01(totalProgress) - range.start) / span);
  }

  getNextNode(graphId: string, nodeId: StoryNodeId): StoryNode | null {
    const graph = this.get(graphId);
    const edge = graph.edges.find((e) => e.from === nodeId);
    if (!edge) {
      return null;
    }
    return this.getNode(graphId, edge.to);
  }

  getPreviousNode(graphId: string, nodeId: StoryNodeId): StoryNode | null {
    const graph = this.get(graphId);
    const edge = graph.edges.find((e) => e.to === nodeId);
    if (!edge) {
      return null;
    }
    return this.getNode(graphId, edge.from);
  }

  getLinearNodeOrder(graphId: string): readonly StoryNodeId[] {
    const graph = this.get(graphId);
    const order: StoryNodeId[] = [];
    let current: StoryNodeId | null = graph.entryNodeId;
    const visited = new Set<StoryNodeId>();

    while (current && !visited.has(current)) {
      order.push(current);
      visited.add(current);
      const next = this.getNextNode(graphId, current);
      current = next?.id ?? null;
    }

    return order;
  }

  getDistrictsInGraph(graphId: string): readonly StoryNode["districtId"][] {
    const graph = this.get(graphId);
    const ids = new Set<StoryNode["districtId"]>();
    for (const node of graph.nodes) {
      if (node.enabled !== false) {
        ids.add(node.districtId);
      }
    }
    return [...ids];
  }

  dispose(): void {
    this.#graphs.clear();
    this.#nodeIndex.clear();
    this.#chapterIndex.clear();
  }
}

export function createNarrativeGraphRegistry(): NarrativeGraphRegistry {
  return new NarrativeGraphRegistry();
}

export function nodeInRange(range: ScrollRange, progress: number): boolean {
  const p = clamp01(progress);
  return p >= range.start && p < range.end;
}

export function resolveEdgeTarget(
  edges: readonly NarrativeEdge[],
  from: StoryNodeId,
): StoryNodeId | null {
  return edges.find((edge) => edge.from === from)?.to ?? null;
}
