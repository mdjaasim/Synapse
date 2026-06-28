/**
 * District framework types (Doc 8 / Doc 16).
 * Districts are fully data-driven via {@link DistrictManifest}.
 */

import type { Vec3 } from "./camera";
import type { DistrictId, Mood } from "./experience";

/** Doc 8 scene lifecycle phases. */
export const DISTRICT_LIFECYCLE_PHASES = [
  "created",
  "prepared",
  "entering",
  "active",
  "focused",
  "leaving",
  "dormant",
  "disposed",
] as const;

export type DistrictLifecyclePhase = (typeof DISTRICT_LIFECYCLE_PHASES)[number];

/** Registered transition kinds (visuals deferred to Phase 5B). */
export const DISTRICT_TRANSITION_KINDS = [
  "fade",
  "portal",
  "camera-flight",
  "shader-dissolve",
  "blackout",
  "crossfade",
] as const;

export type DistrictTransitionKind = (typeof DISTRICT_TRANSITION_KINDS)[number];

/** Spatial bounds for culling and navigation. */
export interface DistrictBounds {
  readonly center: Vec3;
  readonly radius: number;
}

/** A named camera framing target within a district. */
export interface DistrictCameraTarget {
  readonly id: string;
  readonly position: Vec3;
  readonly target: Vec3;
  readonly fov: number;
}

/** Default camera framing declared in district manifest. */
export interface DistrictCameraDefaults {
  readonly primaryTargetId: string;
  readonly targets: readonly DistrictCameraTarget[];
}

/** Streaming tier for progressive load ordering (PRD 17). */
export const STREAMING_TIERS = ["critical", "high", "normal", "low"] as const;

export type StreamingTier = (typeof STREAMING_TIERS)[number];

/** Data-driven streaming policy per district. */
export interface DistrictStreamingPolicy {
  readonly tier: StreamingTier;
  readonly preloadAdjacent: boolean;
  readonly unloadWhenDormant: boolean;
}

/** Data-driven transition preferences per district. */
export interface DistrictTransitionPreferences {
  readonly preferred: DistrictTransitionKind;
  readonly allowed: readonly DistrictTransitionKind[];
  readonly cameraProfileId: string;
}

/**
 * Complete data manifest for a district. New districts are addable by
 * registering a manifest + factory — no controller changes required.
 */
export interface DistrictManifest {
  readonly id: DistrictId;
  readonly name: string;
  readonly mood: Mood;
  readonly description: string;
  /** Label for developer debug panels only — never shown as UI copy. */
  readonly developerLabel: string;
  readonly bounds: DistrictBounds;
  readonly cameraDefaults: DistrictCameraDefaults;
  /** Higher values load first when streaming (0–100). */
  readonly loadingPriority: number;
  readonly transitionPreferences: DistrictTransitionPreferences;
  readonly streamingPolicy: DistrictStreamingPolicy;
  /** Soft memory budget in bytes for resource manager enforcement. */
  readonly memoryBudgetBytes: number;
}

/** Per-district runtime state snapshot. */
export interface DistrictRuntimeState {
  readonly districtId: DistrictId;
  readonly phase: DistrictLifecyclePhase;
  readonly loaded: boolean;
  readonly mounted: boolean;
  readonly memoryBytesEstimate: number;
}

/** Active transition snapshot. */
export interface DistrictTransitionState {
  readonly active: boolean;
  readonly kind: DistrictTransitionKind | null;
  readonly from: DistrictId | null;
  readonly to: DistrictId | null;
  readonly progress: number;
}

/** Full framework snapshot for debug tooling. */
export interface DistrictFrameworkSnapshot {
  readonly currentDistrictId: DistrictId | null;
  readonly loadedDistrictIds: readonly DistrictId[];
  readonly activeDistrictIds: readonly DistrictId[];
  readonly districts: readonly DistrictRuntimeState[];
  readonly transition: DistrictTransitionState;
  readonly totalMemoryBytesEstimate: number;
}
