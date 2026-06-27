"use client";

import { useStore } from "zustand";
import { useAnalyticsContext } from "../providers/AnalyticsProvider";
import type { AnalyticsStoreState } from "../stores/analytics.store";

/** Subscribes to a slice of session analytics state. */
export function useAnalyticsStore<T>(selector: (state: AnalyticsStoreState) => T): T {
  const store = useAnalyticsContext();
  return useStore(store, selector);
}
