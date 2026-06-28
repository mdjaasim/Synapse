import type { DistrictId, SynapseEventBus } from "@synapse/types";
import type { DistrictLifecycle } from "./district-lifecycle";
import type { DistrictState } from "./district-state";

export interface DistrictEventBridgeOptions {
  readonly bus: SynapseEventBus;
  readonly lifecycle: DistrictLifecycle;
  readonly state: DistrictState;
  readonly onNavigationRequested?: (districtId: DistrictId) => void;
}

/**
 * Publishes district lifecycle and world events to the event bus.
 * Districts never import each other — all coordination flows through here.
 */
export class DistrictEventBridge {
  readonly #bus: SynapseEventBus;
  readonly #lifecycle: DistrictLifecycle;
  readonly #state: DistrictState;
  readonly #unsubs: Array<() => void> = [];

  constructor({ bus, lifecycle, state, onNavigationRequested }: DistrictEventBridgeOptions) {
    this.#bus = bus;
    this.#lifecycle = lifecycle;
    this.#state = state;

    if (onNavigationRequested) {
      this.#unsubs.push(
        bus.subscribe("ai.navigationRequested", ({ districtId }) => {
          onNavigationRequested(districtId);
        }),
      );
    }
  }

  publishLifecycleChanged(districtId: DistrictId): void {
    const phase = this.#lifecycle.getPhase(districtId);
    this.#bus.publish("district.lifecycleChanged", { districtId, phase });
  }

  publishEnter(districtId: DistrictId): void {
    this.#state.setCurrentDistrict(districtId);
    this.#bus.publish("world.enterDistrict", { districtId });
    this.publishLifecycleChanged(districtId);
  }

  publishExit(districtId: DistrictId): void {
    this.#bus.publish("world.exitDistrict", { districtId });
    this.publishLifecycleChanged(districtId);
  }

  dispose(): void {
    for (const unsub of this.#unsubs) {
      unsub();
    }
    this.#unsubs.length = 0;
  }
}

export function createDistrictEventBridge(
  options: DistrictEventBridgeOptions,
): DistrictEventBridge {
  return new DistrictEventBridge(options);
}
