"use client";

import type { AIStoreState } from "@synapse/ai";
import { useStore } from "zustand";
import { useAIContext } from "../providers/AIProvider";

/** Subscribes to a slice of AI conversation state. */
export function useAIStore<T>(selector: (state: AIStoreState) => T): T {
  const store = useAIContext();
  return useStore(store, selector);
}
