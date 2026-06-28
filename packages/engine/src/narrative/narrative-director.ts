import type {
  ChapterId,
  NavigationDirection,
  NarrativeChapter,
  NarrativeIntent,
  NarrativeIntentType,
  StoryNode,
  StoryNodeId,
} from "@synapse/types";
import { clamp01 } from "@synapse/utils";
import type { NarrativeGraphRegistry } from "./narrative-graph-registry";

export interface NarrativeDirectorOptions {
  readonly graphId: string;
  readonly registry: NarrativeGraphRegistry;
}

/**
 * Pure graph resolution — no I/O, no store mutations.
 * Converts scroll progress into narrative intents for SceneDirector.
 */
export class NarrativeDirector {
  readonly #graphId: string;
  readonly #registry: NarrativeGraphRegistry;
  #previousNodeId: StoryNodeId | null = null;
  #previousChapterId: ChapterId | null = null;
  #previousProgress = 0;

  constructor({ graphId, registry }: NarrativeDirectorOptions) {
    this.#graphId = graphId;
    this.#registry = registry;
  }

  reset(): void {
    this.#previousNodeId = null;
    this.#previousChapterId = null;
    this.#previousProgress = 0;
  }

  resolve(totalProgress: number, direction: NavigationDirection): NarrativeIntent {
    const progress = clamp01(totalProgress);
    const node = this.#registry.findNodeByProgress(this.#graphId, progress);
    const chapter = this.#registry.findChapterForNode(this.#graphId, node.id);
    const nodeLocalProgress = this.#registry.computeNodeLocalProgress(node, progress);

    const previousNode = this.#previousNodeId
      ? this.#registry.getNode(this.#graphId, this.#previousNodeId)
      : null;
    const previousChapter = this.#previousChapterId
      ? this.#registry.getChapter(this.#graphId, this.#previousChapterId)
      : null;

    const type = this.#resolveIntentType(node, chapter, previousNode, previousChapter, progress);

    const intent: NarrativeIntent = {
      type,
      node,
      previousNode,
      chapter,
      previousChapter,
      totalProgress: progress,
      nodeLocalProgress,
      direction,
    };

    this.#previousNodeId = node.id;
    this.#previousChapterId = chapter?.id ?? null;
    this.#previousProgress = progress;

    return intent;
  }

  resolveNode(nodeId: StoryNodeId): NarrativeIntent {
    const node = this.#registry.getNode(this.#graphId, nodeId);
    const chapter = this.#registry.findChapterForNode(this.#graphId, node.id);
    const progress = node.scrollRange.start;
    const previousNode = this.#previousNodeId
      ? this.#registry.getNode(this.#graphId, this.#previousNodeId)
      : null;
    const previousChapter = this.#previousChapterId
      ? this.#registry.getChapter(this.#graphId, this.#previousChapterId)
      : null;

    const intent: NarrativeIntent = {
      type: "nodeEnter",
      node,
      previousNode,
      chapter,
      previousChapter,
      totalProgress: progress,
      nodeLocalProgress: 0,
      direction: "jump",
    };

    this.#previousNodeId = node.id;
    this.#previousChapterId = chapter?.id ?? null;
    this.#previousProgress = progress;

    return intent;
  }

  getEntryNode(): StoryNode {
    const graph = this.#registry.get(this.#graphId);
    return this.#registry.getNode(this.#graphId, graph.entryNodeId);
  }

  getNextNode(nodeId: StoryNodeId): StoryNode | null {
    return this.#registry.getNextNode(this.#graphId, nodeId);
  }

  getPreviousNode(nodeId: StoryNodeId): StoryNode | null {
    return this.#registry.getPreviousNode(this.#graphId, nodeId);
  }

  #resolveIntentType(
    node: StoryNode,
    chapter: NarrativeChapter | null,
    previousNode: StoryNode | null,
    previousChapter: NarrativeChapter | null,
    progress: number,
  ): NarrativeIntentType {
    const nodeChanged = previousNode !== null && previousNode.id !== node.id;
    const chapterChanged =
      previousChapter !== null && chapter !== null && previousChapter.id !== chapter.id;

    if (nodeChanged) {
      return "nodeEnter";
    }
    if (chapterChanged) {
      return "chapterEnter";
    }
    if (Math.abs(progress - this.#previousProgress) > Number.EPSILON) {
      return "progress";
    }
    return "none";
  }
}

export function createNarrativeDirector(options: NarrativeDirectorOptions): NarrativeDirector {
  return new NarrativeDirector(options);
}
