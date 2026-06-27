import { createStore, type StoreApi } from "zustand/vanilla";
import type { CameraState, CameraTransition, Vec3 } from "@synapse/types";

export interface CameraActions {
  setPosition(position: Vec3): void;
  setTarget(target: Vec3): void;
  setTransition(transition: CameraTransition): void;
  setCinematic(cinematicId: string | null): void;
  reset(): void;
}

export type CameraStoreState = CameraState & CameraActions;

export type CameraStore = StoreApi<CameraStoreState>;

const ORIGIN: Vec3 = { x: 0, y: 0, z: 0 };

const INITIAL_STATE: CameraState = {
  position: { x: 0, y: 0, z: 10 },
  target: ORIGIN,
  transition: "idle",
  activeCinematicId: null,
};

/** Factory for a fresh camera store. Never a module-scope singleton. */
export function createCameraStore(): CameraStore {
  return createStore<CameraStoreState>((set) => ({
    ...INITIAL_STATE,
    setPosition: (position) => set({ position }),
    setTarget: (target) => set({ target }),
    setTransition: (transition) => set({ transition }),
    setCinematic: (activeCinematicId) => set({ activeCinematicId }),
    reset: () => set({ ...INITIAL_STATE }),
  }));
}
