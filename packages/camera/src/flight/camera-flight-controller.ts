import type { CameraFlightPlan, CameraCheckpoint } from "@synapse/types";
import type { CameraController } from "../controller/camera-controller";

export type CameraFlightState = "idle" | "active" | "interrupted";

/**
 * Camera flight architecture — Phase 5B snaps instantly via CameraController.
 * GSAP tweening deferred to a later phase.
 */
export class CameraFlightController {
  readonly #controller: CameraController;
  #state: CameraFlightState = "idle";
  #checkpoints = new Map<string, CameraCheckpoint>();
  #activePlan: CameraFlightPlan | null = null;

  constructor(controller: CameraController) {
    this.#controller = controller;
  }

  get state(): CameraFlightState {
    return this.#state;
  }

  get activePlan(): CameraFlightPlan | null {
    return this.#activePlan;
  }

  beginFlight(plan: CameraFlightPlan): void {
    this.#activePlan = plan;
    this.#state = "active";
    this.#controller.restorePose(plan.arrivalPose);
    this.#state = "idle";
    this.#activePlan = null;
  }

  interruptFlight(): void {
    if (this.#state === "active") {
      this.#state = "interrupted";
      this.#activePlan = null;
    }
  }

  saveCheckpoint(nodeId: string): CameraCheckpoint {
    const checkpoint: CameraCheckpoint = {
      nodeId,
      pose: this.#controller.savePose(),
    };
    this.#checkpoints.set(nodeId, checkpoint);
    return checkpoint;
  }

  restoreCheckpoint(checkpoint: CameraCheckpoint): void {
    this.#controller.restorePose(checkpoint.pose);
  }

  getCheckpoint(nodeId: string): CameraCheckpoint | undefined {
    return this.#checkpoints.get(nodeId);
  }

  dispose(): void {
    this.#checkpoints.clear();
    this.#activePlan = null;
    this.#state = "idle";
  }
}

export function createCameraFlightController(controller: CameraController): CameraFlightController {
  return new CameraFlightController(controller);
}
