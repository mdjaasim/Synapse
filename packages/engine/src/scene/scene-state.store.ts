import { createStore, type StoreApi } from "zustand/vanilla";
import type {
  ChapterId,
  DistrictId,
  Mood,
  NavigationDirection,
  NarrativeTransitionState,
  SceneLoadingState,
  SceneState,
  StoryNodeId,
  WorldPhase,
} from "@synapse/types";
import { clamp01 } from "@synapse/utils";
import type { ExperienceStore } from "../stores/experience.store";

export interface SceneStateActions {
  setGraphId(graphId: string): void;
  setNode(nodeId: StoryNodeId | null, districtId: DistrictId | null): void;
  setPreviousNode(nodeId: StoryNodeId | null): void;
  setChapter(chapterId: ChapterId | null): void;
  setTotalProgress(progress: number): void;
  setNodeLocalProgress(progress: number): void;
  setNavigationDirection(direction: NavigationDirection): void;
  setTransitionState(state: NarrativeTransitionState): void;
  setLoadingState(state: SceneLoadingState): void;
  setPreloadQueue(queue: readonly DistrictId[]): void;
  setCheckpoint(nodeId: StoryNodeId | null): void;
  setNarrativePaused(paused: boolean): void;
  setStoryStarted(started: boolean): void;
  setStoryCompleted(completed: boolean): void;
  reset(): void;
}

export type SceneStateStoreState = SceneState & SceneStateActions;
export type SceneStateStore = StoreApi<SceneStateStoreState>;

const INITIAL_SCENE_STATE: SceneState = {
  graphId: null,
  currentNodeId: null,
  previousNodeId: null,
  currentChapterId: null,
  currentDistrictId: null,
  totalProgress: 0,
  nodeLocalProgress: 0,
  navigationDirection: "idle",
  transitionState: "idle",
  loadingState: "idle",
  preloadQueue: [],
  checkpointNodeId: null,
  narrativePaused: false,
  storyStarted: false,
  storyCompleted: false,
};

/** Factory for scene navigation state. Only SceneDirector may write. */
export function createSceneStateStore(): SceneStateStore {
  return createStore<SceneStateStoreState>((set) => ({
    ...INITIAL_SCENE_STATE,
    setGraphId: (graphId) => set({ graphId }),
    setNode: (currentNodeId, currentDistrictId) => set({ currentNodeId, currentDistrictId }),
    setPreviousNode: (previousNodeId) => set({ previousNodeId }),
    setChapter: (currentChapterId) => set({ currentChapterId }),
    setTotalProgress: (totalProgress) => set({ totalProgress: clamp01(totalProgress) }),
    setNodeLocalProgress: (nodeLocalProgress) =>
      set({ nodeLocalProgress: clamp01(nodeLocalProgress) }),
    setNavigationDirection: (navigationDirection) => set({ navigationDirection }),
    setTransitionState: (transitionState) => set({ transitionState }),
    setLoadingState: (loadingState) => set({ loadingState }),
    setPreloadQueue: (preloadQueue) => set({ preloadQueue: [...preloadQueue] }),
    setCheckpoint: (checkpointNodeId) => set({ checkpointNodeId }),
    setNarrativePaused: (narrativePaused) => set({ narrativePaused }),
    setStoryStarted: (storyStarted) => set({ storyStarted }),
    setStoryCompleted: (storyCompleted) => set({ storyCompleted }),
    reset: () => set({ ...INITIAL_SCENE_STATE }),
  }));
}

export interface ExperienceSyncInput {
  readonly worldPhase: WorldPhase;
  readonly currentDistrict: DistrictId | null;
  readonly mood: Mood;
  readonly storyProgress: number;
}

/**
 * Maps scene navigation state to experience store fields.
 * Called exclusively by SceneDirector after scene state mutations.
 */
export function deriveExperienceSync(
  scene: SceneState,
  mood: Mood,
  worldPhase: WorldPhase,
): ExperienceSyncInput {
  return {
    worldPhase,
    currentDistrict: scene.currentDistrictId,
    mood,
    storyProgress: scene.totalProgress,
  };
}

export interface ExperienceSyncOptions {
  readonly experienceStore: ExperienceStore;
  readonly getMood: () => Mood;
  readonly getWorldPhase: () => WorldPhase;
}

/** Applies navigation-related fields to the experience store (SceneDirector only). */
export function syncSceneToExperience(
  sceneStore: SceneStateStore,
  { experienceStore, getMood, getWorldPhase }: ExperienceSyncOptions,
): void {
  const scene = sceneStore.getState();
  const sync = deriveExperienceSync(scene, getMood(), getWorldPhase());
  const prev = experienceStore.getState();

  if (prev.worldPhase !== sync.worldPhase) {
    experienceStore.getState().setWorldPhase(sync.worldPhase);
  }
  if (prev.currentDistrict !== sync.currentDistrict) {
    experienceStore.getState().setDistrict(sync.currentDistrict);
  }
  if (prev.mood !== sync.mood) {
    experienceStore.getState().setMood(sync.mood);
  }
  if (prev.storyProgress !== sync.storyProgress) {
    experienceStore.getState().setStoryProgress(sync.storyProgress);
  }
}
