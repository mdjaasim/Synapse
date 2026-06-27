import { createStore, type StoreApi } from "zustand/vanilla";

export interface AnalyticsEvent {
  readonly name: string;
  readonly at: number;
  readonly data?: Readonly<Record<string, unknown>>;
}

/** Session analytics (Layer 2). */
export interface AnalyticsState {
  readonly events: readonly AnalyticsEvent[];
  readonly discoveries: readonly string[];
  readonly sessionStartedAt: number;
}

export interface AnalyticsActions {
  track(name: string, data?: Record<string, unknown>): void;
  markDiscovery(id: string): void;
  reset(): void;
}

export type AnalyticsStoreState = AnalyticsState & AnalyticsActions;

export type AnalyticsStore = StoreApi<AnalyticsStoreState>;

/** Factory for a fresh analytics store. Never a module-scope singleton. */
export function createAnalyticsStore(): AnalyticsStore {
  return createStore<AnalyticsStoreState>((set) => ({
    events: [],
    discoveries: [],
    sessionStartedAt: Date.now(),
    track: (name, data) =>
      set((state) => ({
        events: [...state.events, { name, at: Date.now(), ...(data ? { data } : {}) }],
      })),
    markDiscovery: (id) =>
      set((state) =>
        state.discoveries.includes(id) ? state : { discoveries: [...state.discoveries, id] },
      ),
    reset: () => set({ events: [], discoveries: [] }),
  }));
}
