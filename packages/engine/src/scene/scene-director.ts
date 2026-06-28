import type {
  AnimationCommandPort,
  CameraCommandPort,
  DistrictCommandPort,
  DistrictId,
  Mood,
  NarrativeIntent,
  StoryNodeId,
  SynapseEventBus,
  WorldPhase,
} from "@synapse/types";
import type { ExperienceStore } from "../stores/experience.store";
import type { NarrativeDirector } from "../narrative/narrative-director";
import type { NarrativeGraphRegistry } from "../narrative/narrative-graph-registry";
import { createLoadingStrategy, LoadingStrategy } from "./loading-strategy";
import {
  createSceneStateStore,
  syncSceneToExperience,
  type SceneStateStore,
} from "./scene-state.store";
import { createTransitionHandlerRegistry } from "./transition-handler-registry";
import { createTransitionPipeline, TransitionPipeline } from "./transition-pipeline";

export interface SceneDirectorOptions {
  readonly graphId: string;
  readonly bus: SynapseEventBus;
  readonly experienceStore: ExperienceStore;
  readonly registry: NarrativeGraphRegistry;
  readonly narrativeDirector: NarrativeDirector;
  readonly district: DistrictCommandPort;
  readonly camera: CameraCommandPort;
  readonly animation?: AnimationCommandPort;
}

/**
 * Top-level scene orchestrator — the sole authority for navigation state mutation.
 * Coordinates story progression, district navigation, camera, loading, and events.
 */
export class SceneDirector {
  readonly sceneState: SceneStateStore;
  readonly #graphId: string;
  readonly #bus: SynapseEventBus;
  readonly #experienceStore: ExperienceStore;
  readonly #registry: NarrativeGraphRegistry;
  readonly #narrativeDirector: NarrativeDirector;
  readonly #district: DistrictCommandPort;
  readonly #camera: CameraCommandPort;
  readonly #animation: AnimationCommandPort | undefined;
  readonly #transitionPipeline: TransitionPipeline;
  readonly #loadingStrategy: LoadingStrategy;
  readonly #unsubs: Array<() => void> = [];
  #storyBegun = false;
  #renderContextReady = false;

  constructor({
    graphId,
    bus,
    experienceStore,
    registry,
    narrativeDirector,
    district,
    camera,
    animation,
  }: SceneDirectorOptions) {
    this.#graphId = graphId;
    this.#bus = bus;
    this.#experienceStore = experienceStore;
    this.#registry = registry;
    this.#narrativeDirector = narrativeDirector;
    this.#district = district;
    this.#camera = camera;
    this.#animation = animation;
    this.sceneState = createSceneStateStore();

    const handlers = createTransitionHandlerRegistry();
    this.#transitionPipeline = createTransitionPipeline({ bus, district, handlers });
    this.#loadingStrategy = createLoadingStrategy({ graphId, registry, district });

    this.#unsubs.push(
      bus.subscribe("ai.navigationRequested", ({ districtId }) => {
        void this.navigateToDistrict(districtId);
      }),
    );
  }

  /** Called when SceneRoot has bound render context — enables district loading. */
  onRenderContextReady(): Promise<void> {
    this.#renderContextReady = true;
    if (!this.#storyBegun) {
      return this.beginStory();
    }
    return Promise.resolve();
  }

  async beginStory(): Promise<void> {
    if (this.#storyBegun || !this.#renderContextReady) {
      return;
    }

    this.#storyBegun = true;
    const entry = this.#narrativeDirector.getEntryNode();
    const chapter = this.#registry.findChapterForNode(this.#graphId, entry.id);

    this.sceneState.getState().setGraphId(this.#graphId);
    this.sceneState.getState().setStoryStarted(true);
    this.sceneState.getState().setLoadingState("preloading");
    this.#setWorldPhase("awakening");

    this.#bus.publish("story.started", {
      graphId: this.#graphId,
      entryNodeId: entry.id,
    });

    if (chapter) {
      this.#bus.publish("story.chapterEnter", { chapterId: chapter.id, title: chapter.title });
      this.sceneState.getState().setChapter(chapter.id);
    }

    await this.#enterNode(entry, null, "jump");

    this.sceneState.getState().setLoadingState("ready");
    this.#setWorldPhase("active");
    this.#syncExperience();
  }

  async navigateToNode(nodeId: StoryNodeId): Promise<void> {
    const intent = this.#narrativeDirector.resolveNode(nodeId);
    await this.#applyIntent(intent, true);
  }

  async navigateToDistrict(districtId: DistrictId): Promise<void> {
    const graph = this.#registry.get(this.#graphId);
    const node = graph.nodes.find((n) => n.districtId === districtId && n.enabled !== false);
    if (!node) {
      return;
    }
    await this.navigateToNode(node.id);
  }

  pauseNarrative(): void {
    this.sceneState.getState().setNarrativePaused(true);
  }

  resumeNarrative(): void {
    this.sceneState.getState().setNarrativePaused(false);
  }

  restoreCheckpoint(checkpointNodeId: StoryNodeId): void {
    void this.navigateToNode(checkpointNodeId);
  }

  /** Handles scroll-driven narrative intents from ScrollDirector. */
  async handleNarrativeIntent(intent: NarrativeIntent): Promise<void> {
    if (!this.#storyBegun || this.sceneState.getState().narrativePaused) {
      return;
    }
    await this.#applyIntent(intent, false);
  }

  dispose(): void {
    for (const unsub of this.#unsubs) {
      unsub();
    }
    this.#unsubs.length = 0;
    this.sceneState.getState().reset();
    this.#storyBegun = false;
    this.#renderContextReady = false;
  }

  async #applyIntent(intent: NarrativeIntent, forceNodeEnter: boolean): Promise<void> {
    const { node, previousNode, chapter, previousChapter, type } = intent;
    if (!node) {
      return;
    }

    const shouldEnterNode = forceNodeEnter || type === "nodeEnter";
    const shouldUpdateProgress = type === "progress" || shouldEnterNode;

    if (shouldUpdateProgress) {
      this.sceneState.getState().setTotalProgress(intent.totalProgress);
      this.sceneState.getState().setNodeLocalProgress(intent.nodeLocalProgress);
      this.sceneState.getState().setNavigationDirection(intent.direction);
      this.#bus.publish("experience.storyProgress", { progress: intent.totalProgress });
      this.#bus.publish("story.progress", {
        totalProgress: intent.totalProgress,
        nodeLocalProgress: intent.nodeLocalProgress,
        direction: intent.direction,
        nodeId: node.id,
      });
      this.#scrubDistrictTimeline(node.districtId, intent.nodeLocalProgress);
    }

    if (
      type === "chapterEnter" &&
      chapter &&
      previousChapter &&
      chapter.id !== previousChapter.id
    ) {
      this.#bus.publish("story.chapterExit", { chapterId: previousChapter.id });
      this.#bus.publish("story.chapterEnter", { chapterId: chapter.id, title: chapter.title });
      this.sceneState.getState().setChapter(chapter.id);
    }

    if (shouldEnterNode && previousNode && previousNode.id !== node.id) {
      this.#bus.publish("story.nodeExit", {
        nodeId: previousNode.id,
        districtId: previousNode.districtId,
      });
    }

    if (shouldEnterNode) {
      await this.#enterNode(node, previousNode, intent.direction);
    } else if (shouldUpdateProgress) {
      this.#syncExperience();
    }

    if (intent.totalProgress >= 1 && !this.sceneState.getState().storyCompleted) {
      this.sceneState.getState().setStoryCompleted(true);
      this.#bus.publish("story.completed", { graphId: this.#graphId });
    }
  }

  async #enterNode(
    node: NonNullable<NarrativeIntent["node"]>,
    previousNode: NarrativeIntent["previousNode"],
    direction: NarrativeIntent["direction"],
  ): Promise<void> {
    const fromDistrictId = previousNode?.districtId ?? this.sceneState.getState().currentDistrictId;
    const districtChanged = fromDistrictId !== node.districtId;

    this.sceneState.getState().setTransitionState("active");
    this.#setWorldPhase("transitioning");

    if (districtChanged) {
      await this.#transitionPipeline.execute({
        kind: node.transitionKind,
        fromNodeId: previousNode?.id ?? null,
        toNode: node,
        fromDistrictId: fromDistrictId ?? null,
      });
    } else if (!this.#district.isLoaded(node.districtId)) {
      await this.#district.ensureLoaded(node.districtId);
      const snap = this.#district.getSnapshot();
      if (snap.currentDistrictId !== node.districtId) {
        await this.#district.navigateTo(node.districtId, node.transitionKind);
      }
    }

    const manifest = this.#district.getManifest(node.districtId);
    this.#camera.transitionTo(manifest, node.cameraProfileId);
    this.#camera.focusDistrict(manifest);

    if (node.checkpoint) {
      const checkpoint = this.#camera.saveCheckpoint(node.id);
      this.sceneState.getState().setCheckpoint(checkpoint.nodeId);
    }

    this.sceneState.getState().setPreviousNode(previousNode?.id ?? null);
    this.sceneState.getState().setNode(node.id, node.districtId);

    const chapter = this.#registry.findChapterForNode(this.#graphId, node.id);
    if (chapter) {
      this.sceneState.getState().setChapter(chapter.id);
    }

    this.#bus.publish("story.nodeEnter", {
      nodeId: node.id,
      districtId: node.districtId,
      chapterId: chapter?.id ?? null,
    });

    const preloadQueue = this.#loadingStrategy.computePreloadQueue(node);
    this.sceneState.getState().setPreloadQueue(preloadQueue);
    this.sceneState.getState().setLoadingState("preloading");
    await this.#loadingStrategy.applyPreloadQueue(preloadQueue);
    this.sceneState.getState().setLoadingState("ready");

    this.sceneState.getState().setTransitionState("idle");
    this.sceneState.getState().setNavigationDirection(direction);
    this.#setWorldPhase("active");
    this.#syncExperience();
  }

  #scrubDistrictTimeline(districtId: DistrictId, progress: number): void {
    this.#animation?.scrubTimeline(`${districtId}:camera-scroll`, progress);
  }

  #setWorldPhase(phase: WorldPhase): void {
    this.#experienceStore.getState().setWorldPhase(phase);
    this.#bus.publish("experience.worldPhaseChanged", { phase });
  }

  #resolveMood(): Mood {
    const chapterId = this.sceneState.getState().currentChapterId;
    if (!chapterId) {
      return "calm";
    }
    const chapter = this.#registry.getChapter(this.#graphId, chapterId);
    return chapter.mood ?? "calm";
  }

  #syncExperience(): void {
    syncSceneToExperience(this.sceneState, {
      experienceStore: this.#experienceStore,
      getMood: () => this.#resolveMood(),
      getWorldPhase: () => this.#experienceStore.getState().worldPhase,
    });
    const mood = this.#resolveMood();
    this.#bus.publish("experience.moodChanged", { mood });
  }
}

export function createSceneDirector(options: SceneDirectorOptions): SceneDirector {
  return new SceneDirector(options);
}
