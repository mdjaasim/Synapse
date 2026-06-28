import type {
  DistrictFrameworkSnapshot,
  DistrictId,
  DistrictTransitionKind,
  SynapseEventBus,
} from "@synapse/types";
import type { WorldRoot } from "../root/world-root";
import type { BaseDistrict, DistrictContext } from "./base-district";
import { bootstrapDistrictRegistry } from "./district-registry.bootstrap";
import { createDistrictRegistry, DistrictRegistry } from "./district-registry";
import { createDistrictLifecycle, DistrictLifecycle } from "./district-lifecycle";
import { createDistrictState, DistrictState } from "./district-state";
import {
  createDistrictResourceManager,
  DistrictResourceManager,
} from "./district-resource-manager";
import { createDistrictLoader, DistrictLoader } from "./district-loader";
import { createDistrictManager, DistrictManager } from "./district-manager";
import {
  createDistrictTransitionManager,
  DistrictTransitionManager,
} from "./district-transition-manager";
import { createDistrictEventBridge, DistrictEventBridge } from "./district-event-bridge";
import { createTransitionRegistry, TransitionRegistry } from "./transitions/transition-registry";

/** Camera operations the controller orchestrates — injected from @synapse/camera. */
export interface DistrictCameraAdapter {
  focusDistrict(manifest: BaseDistrict["manifest"]): void;
  transitionTo(manifest: BaseDistrict["manifest"], profileId: string): void;
}

export interface DistrictControllerOptions {
  readonly worldRoot: WorldRoot;
  readonly bus: SynapseEventBus;
  readonly camera: DistrictCameraAdapter;
  readonly getContext: () => DistrictContext | null;
  readonly maxActive?: number;
}

/**
 * Generic district orchestrator. All behavior is driven by registered
 * manifests — no district-specific logic lives here.
 */
export class DistrictController {
  readonly registry: DistrictRegistry;
  readonly worldRoot: WorldRoot;
  readonly lifecycle: DistrictLifecycle;
  readonly state: DistrictState;
  readonly resources: DistrictResourceManager;
  readonly loader: DistrictLoader;
  readonly manager: DistrictManager;
  readonly transitions: DistrictTransitionManager;
  readonly eventBridge: DistrictEventBridge;
  readonly #transitionRegistry: TransitionRegistry;
  readonly #camera: DistrictCameraAdapter;
  readonly #getContext: () => DistrictContext | null;
  #initialized = false;

  constructor({ worldRoot, bus, camera, getContext, maxActive }: DistrictControllerOptions) {
    this.registry = createDistrictRegistry();
    bootstrapDistrictRegistry(this.registry);
    this.worldRoot = worldRoot;

    this.lifecycle = createDistrictLifecycle();
    this.state = createDistrictState();
    this.resources = createDistrictResourceManager();
    this.loader = createDistrictLoader({
      registry: this.registry,
      lifecycle: this.lifecycle,
      state: this.state,
      resources: this.resources,
    });
    const managerOptions: {
      worldRoot: WorldRoot;
      lifecycle: DistrictLifecycle;
      maxActive?: number;
    } = { worldRoot, lifecycle: this.lifecycle };
    if (maxActive !== undefined) {
      managerOptions.maxActive = maxActive;
    }
    this.manager = createDistrictManager(managerOptions);
    this.#transitionRegistry = createTransitionRegistry();
    this.transitions = createDistrictTransitionManager({
      registry: this.registry,
      state: this.state,
      transitions: this.#transitionRegistry,
      bus,
    });
    this.#camera = camera;
    this.#getContext = getContext;

    this.eventBridge = createDistrictEventBridge({
      bus,
      lifecycle: this.lifecycle,
      state: this.state,
    });
  }

  async ensureLoaded(id: DistrictId): Promise<void> {
    if (this.loader.isLoaded(id)) {
      return;
    }
    const ctx = this.#requireContext();
    await this.loader.load(id, ctx);
  }

  async initialize(initialId: DistrictId = "origin"): Promise<void> {
    if (this.#initialized) {
      return;
    }
    const ctx = this.#requireContext();
    await this.loader.load(initialId, ctx);
    await this.enterDistrict(initialId);
    this.#initialized = true;
  }

  async navigateTo(to: DistrictId, requestedTransition?: DistrictTransitionKind): Promise<void> {
    const ctx = this.#requireContext();
    const from = this.state.getCurrentDistrict();
    const kind = this.transitions.resolveKind(to, requestedTransition);

    if (from === to) {
      return;
    }

    if (from) {
      await this.exitDistrict(from);
    }

    this.transitions.run(from, to, kind);

    if (!this.loader.isLoaded(to)) {
      await this.loader.load(to, ctx);
    }

    await this.enterDistrict(to);
  }

  async enterDistrict(id: DistrictId): Promise<void> {
    const district = this.#requireLoaded(id);
    const manifest = district.manifest;

    this.lifecycle.transition(id, "entering");
    this.state.setPhase(id, "entering");
    this.eventBridge.publishLifecycleChanged(id);

    district.enter();
    this.manager.mount(district);
    this.state.setMounted(id, true);

    this.lifecycle.transition(id, "active");
    this.state.setPhase(id, "active");
    this.lifecycle.transition(id, "focused");
    this.state.setPhase(id, "focused");

    this.#camera.transitionTo(manifest, manifest.transitionPreferences.cameraProfileId);
    this.#camera.focusDistrict(manifest);

    this.eventBridge.publishEnter(id);
  }

  async exitDistrict(id: DistrictId): Promise<void> {
    const district = this.loader.getInstance(id);
    if (!district) {
      return;
    }

    this.lifecycle.transition(id, "leaving");
    this.state.setPhase(id, "leaving");
    this.eventBridge.publishLifecycleChanged(id);

    district.exit();
    this.manager.unmount(id);
    this.state.setMounted(id, false);

    this.lifecycle.transition(id, "dormant");
    this.state.setPhase(id, "dormant");

    const manifest = district.manifest;
    if (manifest.streamingPolicy.unloadWhenDormant) {
      this.loader.unload(id);
    }

    this.eventBridge.publishExit(id);
  }

  update(delta: number): void {
    for (const id of this.state.getSnapshot().activeDistrictIds) {
      const phase = this.lifecycle.getPhase(id);
      if (!this.lifecycle.isUpdateEligible(phase)) {
        continue;
      }
      const district = this.loader.getInstance(id);
      district?.update(delta);
    }
  }

  getSnapshot(): DistrictFrameworkSnapshot {
    return this.state.getSnapshot();
  }

  getManifest(id: DistrictId) {
    return this.registry.getManifest(id);
  }

  dispose(): void {
    this.loader.dispose();
    this.manager.dispose();
    this.resources.dispose();
    this.lifecycle.dispose();
    this.state.dispose();
    this.transitions.dispose();
    this.eventBridge.dispose();
    this.registry.dispose();
    this.#transitionRegistry.dispose();
    this.#initialized = false;
  }

  #requireContext(): DistrictContext {
    const ctx = this.#getContext();
    if (!ctx) {
      throw new Error("DistrictContext is not available.");
    }
    return ctx;
  }

  #requireLoaded(id: DistrictId): BaseDistrict {
    const district = this.loader.getInstance(id);
    if (!district) {
      throw new Error(`District "${id}" is not loaded.`);
    }
    return district;
  }
}

export function createDistrictController(options: DistrictControllerOptions): DistrictController {
  return new DistrictController(options);
}
