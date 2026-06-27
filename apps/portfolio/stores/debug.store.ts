import { createStore, type StoreApi } from "zustand/vanilla";

/** Developer/debug UI state (Layer 2). */
export interface DebugState {
  readonly showOverlay: boolean;
  readonly showInspector: boolean;
  readonly showStats: boolean;
}

export interface DebugActions {
  setShowOverlay(value: boolean): void;
  setShowInspector(value: boolean): void;
  setShowStats(value: boolean): void;
  reset(): void;
}

export type DebugStoreState = DebugState & DebugActions;

export type DebugStore = StoreApi<DebugStoreState>;

const INITIAL_STATE: DebugState = {
  showOverlay: false,
  showInspector: false,
  showStats: false,
};

/** Factory for a fresh debug store. Never a module-scope singleton. */
export function createDebugStore(): DebugStore {
  return createStore<DebugStoreState>((set) => ({
    ...INITIAL_STATE,
    setShowOverlay: (showOverlay) => set({ showOverlay }),
    setShowInspector: (showInspector) => set({ showInspector }),
    setShowStats: (showStats) => set({ showStats }),
    reset: () => set({ ...INITIAL_STATE }),
  }));
}
