/**
 * Narrative graph and scene navigation types (Doc 6 / Doc 8 / PRD 24).
 * Graph data drives all story resolution — no district-specific logic in engine.
 */

import type { DistrictTransitionKind } from "./district";
import type { DistrictId, Mood } from "./experience";

/** Registered story node identifiers (graph-defined). */
export type StoryNodeId = string;

/** Registered chapter identifiers (graph-defined). */
export type ChapterId = string;

export const NAVIGATION_DIRECTIONS = ["forward", "backward", "idle", "jump"] as const;

export type NavigationDirection = (typeof NAVIGATION_DIRECTIONS)[number];

export const SCENE_LOADING_STATES = ["idle", "preloading", "transitioning", "ready"] as const;

export type SceneLoadingState = (typeof SCENE_LOADING_STATES)[number];

export const NARRATIVE_TRANSITION_STATES = ["idle", "active", "completing"] as const;

export type NarrativeTransitionState = (typeof NARRATIVE_TRANSITION_STATES)[number];

export interface ScrollRange {
  readonly start: number;
  readonly end: number;
}

export interface StoryNodeLoadingRequirements {
  readonly retainOrigin?: boolean;
  readonly preloadAdjacent?: boolean;
}

/** A single narrative beat bound to scroll range and district metadata. */
export interface StoryNode {
  readonly id: StoryNodeId;
  readonly title: string;
  readonly districtId: DistrictId;
  readonly cameraProfileId: string;
  readonly transitionKind: DistrictTransitionKind;
  readonly scrollRange: ScrollRange;
  readonly loadingRequirements: StoryNodeLoadingRequirements;
  readonly optional?: boolean;
  readonly revisitable?: boolean;
  readonly checkpoint?: boolean;
  readonly enabled?: boolean;
}

export interface NarrativeEdge {
  readonly from: StoryNodeId;
  readonly to: StoryNodeId;
  readonly condition?: string;
}

export interface NarrativeChapter {
  readonly id: ChapterId;
  readonly title: string;
  readonly nodeIds: readonly StoryNodeId[];
  readonly scrollRange: ScrollRange;
  readonly mood?: Mood;
}

/** Complete narrative graph — single source of truth for story navigation. */
export interface NarrativeGraph {
  readonly id: string;
  readonly title: string;
  readonly entryNodeId: StoryNodeId;
  readonly chapters: readonly NarrativeChapter[];
  readonly nodes: readonly StoryNode[];
  readonly edges: readonly NarrativeEdge[];
}

/** Scene navigation state owned exclusively by SceneDirector. */
export interface SceneState {
  readonly graphId: string | null;
  readonly currentNodeId: StoryNodeId | null;
  readonly previousNodeId: StoryNodeId | null;
  readonly currentChapterId: ChapterId | null;
  readonly currentDistrictId: DistrictId | null;
  readonly totalProgress: number;
  readonly nodeLocalProgress: number;
  readonly navigationDirection: NavigationDirection;
  readonly transitionState: NarrativeTransitionState;
  readonly loadingState: SceneLoadingState;
  readonly preloadQueue: readonly DistrictId[];
  readonly checkpointNodeId: StoryNodeId | null;
  readonly narrativePaused: boolean;
  readonly storyStarted: boolean;
  readonly storyCompleted: boolean;
}

export const NARRATIVE_INTENT_TYPES = [
  "none",
  "progress",
  "nodeEnter",
  "nodeExit",
  "chapterEnter",
  "chapterExit",
] as const;

export type NarrativeIntentType = (typeof NARRATIVE_INTENT_TYPES)[number];

/** Pure resolution output from NarrativeDirector — no side effects. */
export interface NarrativeIntent {
  readonly type: NarrativeIntentType;
  readonly node: StoryNode | null;
  readonly previousNode: StoryNode | null;
  readonly chapter: NarrativeChapter | null;
  readonly previousChapter: NarrativeChapter | null;
  readonly totalProgress: number;
  readonly nodeLocalProgress: number;
  readonly direction: NavigationDirection;
}
