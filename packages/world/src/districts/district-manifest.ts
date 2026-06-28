import type {
  DistrictCameraDefaults,
  DistrictManifest,
  DistrictStreamingPolicy,
  DistrictTransitionPreferences,
  Mood,
} from "@synapse/types";
import type { DistrictId } from "@synapse/types";

export interface StubManifestOptions {
  readonly id: DistrictId;
  readonly name: string;
  readonly mood: Mood;
  readonly description: string;
  readonly developerLabel: string;
  readonly center: { readonly x: number; readonly y: number; readonly z: number };
  readonly radius: number;
  readonly cameraPosition: { readonly x: number; readonly y: number; readonly z: number };
  readonly cameraTarget?: { readonly x: number; readonly y: number; readonly z: number };
  readonly fov?: number;
  readonly loadingPriority: number;
  readonly memoryBudgetBytes: number;
  readonly streamingPolicy?: Partial<DistrictStreamingPolicy>;
  readonly transitionPreferences?: Partial<DistrictTransitionPreferences>;
}

const DEFAULT_STREAMING: DistrictStreamingPolicy = {
  tier: "normal",
  preloadAdjacent: false,
  unloadWhenDormant: true,
};

const DEFAULT_TRANSITION: DistrictTransitionPreferences = {
  preferred: "crossfade",
  allowed: ["fade", "crossfade", "camera-flight", "blackout"],
  cameraProfileId: "instant",
};

/** Builds a complete district manifest from declarative options. */
export function createDistrictManifest(options: StubManifestOptions): DistrictManifest {
  const target = options.cameraTarget ?? options.center;
  const cameraDefaults: DistrictCameraDefaults = {
    primaryTargetId: "default",
    targets: [
      {
        id: "default",
        position: options.cameraPosition,
        target,
        fov: options.fov ?? 42,
      },
    ],
  };

  return {
    id: options.id,
    name: options.name,
    mood: options.mood,
    description: options.description,
    developerLabel: options.developerLabel,
    bounds: { center: options.center, radius: options.radius },
    cameraDefaults,
    loadingPriority: options.loadingPriority,
    transitionPreferences: {
      ...DEFAULT_TRANSITION,
      ...options.transitionPreferences,
    },
    streamingPolicy: {
      ...DEFAULT_STREAMING,
      ...options.streamingPolicy,
    },
    memoryBudgetBytes: options.memoryBudgetBytes,
  };
}
