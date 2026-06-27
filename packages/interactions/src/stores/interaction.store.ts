import { createStore, type StoreApi } from "zustand/vanilla";
import type { CursorVariant, InteractionState } from "@synapse/types";

export interface InteractionActions {
  setHovered(id: string | null): void;
  setFocused(id: string | null): void;
  setSelected(id: string | null): void;
  setCursorVariant(variant: CursorVariant): void;
  setPointerDown(isDown: boolean): void;
  reset(): void;
}

export type InteractionStoreState = InteractionState & InteractionActions;

export type InteractionStore = StoreApi<InteractionStoreState>;

const INITIAL_STATE: InteractionState = {
  hoveredId: null,
  focusedId: null,
  selectedId: null,
  cursorVariant: "default",
  isPointerDown: false,
};

/** Factory for a fresh interaction store. Never a module-scope singleton. */
export function createInteractionStore(): InteractionStore {
  return createStore<InteractionStoreState>((set) => ({
    ...INITIAL_STATE,
    setHovered: (hoveredId) => set({ hoveredId }),
    setFocused: (focusedId) => set({ focusedId }),
    setSelected: (selectedId) => set({ selectedId }),
    setCursorVariant: (cursorVariant) => set({ cursorVariant }),
    setPointerDown: (isPointerDown) => set({ isPointerDown }),
    reset: () => set({ ...INITIAL_STATE }),
  }));
}
