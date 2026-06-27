import { createStore, type StoreApi } from "zustand/vanilla";
import type { DistrictId, ExperienceState, Mood, WorldPhase } from "@synapse/types";
import { clamp01 } from "@synapse/utils";

export interface ExperienceActions {
  setWorldPhase(phase: WorldPhase): void;
  setDistrict(districtId: DistrictId | null): void;
  setMood(mood: Mood): void;
  focusArtifact(artifactId: string | null): void;
  setActiveProject(projectId: string | null): void;
  setStoryProgress(progress: number): void;
  reset(): void;
}

export type ExperienceStoreState = ExperienceState & ExperienceActions;

export type ExperienceStore = StoreApi<ExperienceStoreState>;

const INITIAL_STATE: ExperienceState = {
  worldPhase: "dormant",
  currentDistrict: null,
  mood: "calm",
  focusedArtifactId: null,
  activeProjectId: null,
  storyProgress: 0,
};

/** Factory for a fresh experience store. Never a module-scope singleton. */
export function createExperienceStore(): ExperienceStore {
  return createStore<ExperienceStoreState>((set) => ({
    ...INITIAL_STATE,
    setWorldPhase: (worldPhase) => set({ worldPhase }),
    setDistrict: (currentDistrict) => set({ currentDistrict }),
    setMood: (mood) => set({ mood }),
    focusArtifact: (focusedArtifactId) => set({ focusedArtifactId }),
    setActiveProject: (activeProjectId) => set({ activeProjectId }),
    setStoryProgress: (progress) => set({ storyProgress: clamp01(progress) }),
    reset: () => set({ ...INITIAL_STATE }),
  }));
}
