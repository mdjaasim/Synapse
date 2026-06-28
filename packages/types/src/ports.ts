/**
 * Command ports for SceneDirector orchestration.
 * Defined in @synapse/types so @synapse/engine never imports world/camera/animation.
 */

import type { CameraPoseSnapshot } from "./camera";
import type {
  DistrictTransitionKind,
  DistrictManifest,
  DistrictFrameworkSnapshot,
} from "./district";
import type { DistrictId } from "./experience";

export interface DistrictCommandPort {
  navigateTo(to: DistrictId, transitionKind?: DistrictTransitionKind): Promise<void>;
  ensureLoaded(id: DistrictId): Promise<void>;
  isLoaded(id: DistrictId): boolean;
  getManifest(id: DistrictId): DistrictManifest;
  getSnapshot(): DistrictFrameworkSnapshot;
}

export interface CameraFlightPlan {
  readonly profileId: string;
  readonly departurePose: CameraPoseSnapshot;
  readonly arrivalPose: CameraPoseSnapshot;
  readonly interruptible?: boolean;
}

export interface CameraCheckpoint {
  readonly nodeId: string;
  readonly pose: CameraPoseSnapshot;
}

export interface CameraCommandPort {
  focusDistrict(manifest: DistrictManifest): void;
  transitionTo(manifest: DistrictManifest, profileId: string): void;
  saveCheckpoint(nodeId: string): CameraCheckpoint;
  restoreCheckpoint(checkpoint: CameraCheckpoint): void;
  beginFlight(plan: CameraFlightPlan): void;
  interruptFlight(): void;
  savePose(): CameraPoseSnapshot;
  restorePose(pose: CameraPoseSnapshot): void;
}

export interface AnimationCommandPort {
  registerTimeline(definition: unknown): void;
  scrubTimeline(id: string, progress: number): void;
  interruptTimeline(id: string): void;
  getScrollProgress(): number;
}
