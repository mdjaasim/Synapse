/**
 * Theme tokens. SYNAPSE is dark, cinematic, and calm by default. These tokens
 * are the single source of truth consumed by the application ThemeProvider.
 */

export interface ThemeColors {
  readonly background: string;
  readonly foreground: string;
  readonly muted: string;
  readonly accent: string;
}

export interface MotionTokens {
  /** Base transition durations in milliseconds. */
  readonly fast: number;
  readonly base: number;
  readonly slow: number;
}

export interface ThemeTokens {
  readonly colors: ThemeColors;
  readonly motion: MotionTokens;
}

export const THEME: ThemeTokens = {
  colors: {
    background: "#05060a",
    foreground: "#e6e8ef",
    muted: "#9aa0b4",
    accent: "#5b8cff",
  },
  motion: {
    fast: 150,
    base: 300,
    slow: 600,
  },
};
