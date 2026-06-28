import gsap from "gsap";
import type { CameraFlightPlan, CameraCheckpoint } from "@synapse/types";
import type { CameraController } from "../controller/camera-controller";

export type CameraFlightState = "idle" | "active" | "interrupted";

/**
 * Cinematic camera flights between narrative checkpoints.
 * GSAP tweens the controller's narrativePose — scroll scrub remains independent.
 */
export class CameraFlightController {
  readonly #controller: CameraController;
  #state: CameraFlightState = "idle";
  #checkpoints = new Map<string, CameraCheckpoint>();
  #activePlan: CameraFlightPlan | null = null;
  #progress = 0;
  #activeTween: gsap.core.Timeline | null = null;

  constructor(controller: CameraController) {
    this.#controller = controller;
  }

  get state(): CameraFlightState {
    return this.#state;
  }

  get activePlan(): CameraFlightPlan | null {
    return this.#activePlan;
  }

  get progress(): number {
    return this.#progress;
  }

  beginFlight(plan: CameraFlightPlan, reducedMotion = false): Promise<void> {
    this.interruptFlight();
    this.#activePlan = plan;
    this.#state = "active";
    this.#progress = 0;

    if (reducedMotion) {
      this.#controller.restorePose(plan.arrivalPose);
      this.#progress = 1;
      this.#state = "idle";
      this.#activePlan = null;
      return Promise.resolve();
    }

    const pose = this.#controller.narrativePose;
    this.#controller.restorePose(plan.departurePose);

    return new Promise((resolve) => {
      const arrival = plan.arrivalPose;
      const tl = gsap.timeline({
        onUpdate: () => {
          this.#progress = tl.progress();
        },
        onComplete: () => {
          this.#activeTween = null;
          this.#progress = 1;
          this.#state = "idle";
          this.#activePlan = null;
          resolve();
        },
        onInterrupt: () => {
          this.#activeTween = null;
          this.#state = "interrupted";
          this.#activePlan = null;
          resolve();
        },
      });

      tl.to(
        pose.position,
        {
          x: arrival.position.x,
          y: arrival.position.y,
          z: arrival.position.z,
          duration: 2.4,
          ease: "power2.inOut",
        },
        0,
      );
      tl.to(
        pose.target,
        {
          x: arrival.target.x,
          y: arrival.target.y,
          z: arrival.target.z,
          duration: 2.4,
          ease: "power2.inOut",
        },
        0,
      );
      tl.to(
        pose,
        {
          fov: arrival.fov,
          duration: 2.4,
          ease: "power2.inOut",
        },
        0,
      );

      this.#activeTween = tl;
    });
  }

  interruptFlight(): void {
    if (this.#activeTween) {
      this.#activeTween.kill();
      this.#activeTween = null;
    }
    if (this.#state === "active") {
      this.#state = "interrupted";
      this.#activePlan = null;
    }
    this.#controller.interruptTransition();
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
    this.interruptFlight();
    this.#checkpoints.clear();
    this.#activePlan = null;
    this.#state = "idle";
    this.#progress = 0;
  }
}

export function createCameraFlightController(controller: CameraController): CameraFlightController {
  return new CameraFlightController(controller);
}
