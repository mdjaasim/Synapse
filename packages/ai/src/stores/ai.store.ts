import { createStore, type StoreApi } from "zustand/vanilla";
import type { AIState, ChatMessage, DistrictId } from "@synapse/types";

export interface AIActions {
  addMessage(message: ChatMessage): void;
  setTyping(isTyping: boolean): void;
  setSuggestions(suggestions: readonly string[]): void;
  setPendingNavigation(districtId: DistrictId | null): void;
  setOpen(isOpen: boolean): void;
  clearConversation(): void;
}

export type AIStoreState = AIState & AIActions;

export type AIStore = StoreApi<AIStoreState>;

const INITIAL_STATE: AIState = {
  messages: [],
  isTyping: false,
  suggestions: [],
  pendingNavigation: null,
  isOpen: false,
};

/** Factory for a fresh AI store. Never a module-scope singleton. */
export function createAIStore(): AIStore {
  return createStore<AIStoreState>((set) => ({
    ...INITIAL_STATE,
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setTyping: (isTyping) => set({ isTyping }),
    setSuggestions: (suggestions) => set({ suggestions }),
    setPendingNavigation: (pendingNavigation) => set({ pendingNavigation }),
    setOpen: (isOpen) => set({ isOpen }),
    clearConversation: () => set({ messages: [], suggestions: [], pendingNavigation: null }),
  }));
}
