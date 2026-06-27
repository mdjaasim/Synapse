"use client";

import type { ThemeTokens } from "@synapse/config";
import { useThemeContext } from "../providers/ThemeProvider";

/** Returns the active theme tokens. */
export function useTheme(): ThemeTokens {
  return useThemeContext();
}
