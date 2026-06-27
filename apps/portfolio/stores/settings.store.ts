import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { STORAGE_PREFIX } from "@synapse/config";

export type ThemeMode = "dark";

/** Persisted application settings (Layer 2). */
export interface SettingsState {
  readonly theme: ThemeMode;
  readonly reducedMotion: boolean;
  readonly language: string;
  readonly developerMode: boolean;
  readonly aiSidebarOpen: boolean;
}

export interface SettingsActions {
  setReducedMotion(value: boolean): void;
  setLanguage(language: string): void;
  setDeveloperMode(value: boolean): void;
  setAiSidebarOpen(value: boolean): void;
  toggleAiSidebar(): void;
}

export type SettingsStoreState = SettingsState & SettingsActions;

const INITIAL_STATE: SettingsState = {
  theme: "dark",
  reducedMotion: false,
  language: "en",
  developerMode: false,
  aiSidebarOpen: false,
};

/** No-op storage used on the server where localStorage is unavailable. */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

/**
 * Factory for a persisted settings store. Hydration is skipped at creation and
 * triggered explicitly on the client to avoid SSR mismatches.
 */
export function createSettingsStore() {
  return createStore<SettingsStoreState>()(
    persist(
      (set) => ({
        ...INITIAL_STATE,
        setReducedMotion: (reducedMotion) => set({ reducedMotion }),
        setLanguage: (language) => set({ language }),
        setDeveloperMode: (developerMode) => set({ developerMode }),
        setAiSidebarOpen: (aiSidebarOpen) => set({ aiSidebarOpen }),
        toggleAiSidebar: () => set((state) => ({ aiSidebarOpen: !state.aiSidebarOpen })),
      }),
      {
        name: `${STORAGE_PREFIX}:settings`,
        skipHydration: true,
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? window.localStorage : noopStorage,
        ),
        partialize: (state) => ({
          theme: state.theme,
          reducedMotion: state.reducedMotion,
          language: state.language,
          developerMode: state.developerMode,
          aiSidebarOpen: state.aiSidebarOpen,
        }),
      },
    ),
  );
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;
