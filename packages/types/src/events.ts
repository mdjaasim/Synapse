/**
 * The canonical, typed event contract for SYNAPSE.
 *
 * Events follow `domain.action` naming and are immutable. The Event Bus
 * implementation lives in @synapse/engine; this module owns only the contract
 * so that every package can depend on it without importing the engine.
 */

import type { DistrictId, Mood, WorldPhase } from "./experience";
import type { CursorVariant } from "./interaction";

/** Map of event name to its immutable payload. */
export interface EventMap {
  "experience.worldPhaseChanged": { readonly phase: WorldPhase };
  "experience.moodChanged": { readonly mood: Mood };
  "experience.storyProgress": { readonly progress: number };
  "world.enterDistrict": { readonly districtId: DistrictId };
  "world.exitDistrict": { readonly districtId: DistrictId };
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
