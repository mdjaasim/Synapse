/**
 * The canonical, typed event contract for SYNAPSE.
 *
 * Events follow `domain.action` naming and are immutable. The Event Bus
 * implementation lives in @synapse/engine; this module owns only the contract
 * so that every package can depend on it without importing the engine.
 */

import type { DistrictLifecyclePhase, DistrictTransitionKind } from "./district";
import type { DistrictId, Mood, WorldPhase } from "./experience";
import type { CursorVariant } from "./interaction";
import type { ChapterId, NavigationDirection, StoryNodeId } from "./narrative";

/** Map of event name to its immutable payload. */
export interface EventMap {
  "experience.worldPhaseChanged": { readonly phase: WorldPhase };
  "experience.moodChanged": { readonly mood: Mood };
  "experience.storyProgress": { readonly progress: number };
  "world.enterDistrict": { readonly districtId: DistrictId };
  "world.exitDistrict": { readonly districtId: DistrictId };
  "district.lifecycleChanged": {
    readonly districtId: DistrictId;
    readonly phase: DistrictLifecyclePhase;
  };
  "district.transitionStarted": {
    readonly kind: DistrictTransitionKind;
    readonly from: DistrictId | null;
    readonly to: DistrictId;
  };
  "district.transitionCompleted": {
    readonly kind: DistrictTransitionKind;
    readonly from: DistrictId | null;
    readonly to: DistrictId;
  };
  "world.focusArtifact": { readonly artifactId: string };
  "interaction.hover": { readonly id: string | null };
  "interaction.select": { readonly id: string | null };
  "interaction.cursorChanged": { readonly variant: CursorVariant };
  "ai.conversationStarted": Record<string, never>;
  "ai.conversationEnded": Record<string, never>;
  "ai.navigationRequested": { readonly districtId: DistrictId };
  "performance.fpsSampled": { readonly fps: number };
  "animation.registered": { readonly id: string };
  "animation.started": { readonly id: string };
  "animation.completed": { readonly id: string };
  "animation.interrupted": { readonly id: string };
  "animation.reversed": { readonly id: string };
  "animation.failed": { readonly id: string; readonly reason: string };
  "animation.disposed": { readonly id: string };
  "story.started": { readonly graphId: string; readonly entryNodeId: StoryNodeId };
  "story.completed": { readonly graphId: string };
  "story.nodeEnter": {
    readonly nodeId: StoryNodeId;
    readonly districtId: DistrictId;
    readonly chapterId: ChapterId | null;
  };
  "story.nodeExit": {
    readonly nodeId: StoryNodeId;
    readonly districtId: DistrictId;
  };
  "story.chapterEnter": { readonly chapterId: ChapterId; readonly title: string };
  "story.chapterExit": { readonly chapterId: ChapterId };
  "story.transitionStarted": {
    readonly kind: DistrictTransitionKind;
    readonly fromNodeId: StoryNodeId | null;
    readonly toNodeId: StoryNodeId;
    readonly fromDistrictId: DistrictId | null;
    readonly toDistrictId: DistrictId;
  };
  "story.transitionCompleted": {
    readonly kind: DistrictTransitionKind;
    readonly fromNodeId: StoryNodeId | null;
    readonly toNodeId: StoryNodeId;
    readonly fromDistrictId: DistrictId | null;
    readonly toDistrictId: DistrictId;
  };
  "story.progress": {
    readonly totalProgress: number;
    readonly nodeLocalProgress: number;
    readonly direction: NavigationDirection;
    readonly nodeId: StoryNodeId | null;
  };
}

export type EventName = keyof EventMap;

export type EventPayload<K extends EventName> = EventMap[K];

export type EventHandler<K extends EventName> = (payload: EventPayload<K>) => void;

export type Unsubscribe = () => void;

/**
 * The public Event Bus contract. Systems communicate exclusively through this
 * interface; no system mutates another system's state directly.
 */
export interface SynapseEventBus {
  publish<K extends EventName>(event: K, payload: EventPayload<K>): void;
  subscribe<K extends EventName>(event: K, handler: EventHandler<K>): Unsubscribe;
  once<K extends EventName>(event: K, handler: EventHandler<K>): Unsubscribe;
  clear(event?: EventName): void;
}
