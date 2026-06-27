"use client";

import { THEME, type ThemeTokens } from "@synapse/config";
import { createSafeContext } from "@synapse/hooks";
import { useEffect, type ReactNode } from "react";

const [ThemeContext, useThemeContext] = createSafeContext<ThemeTokens>("ThemeProvider");

export { useThemeContext };

/** Exposes theme tokens and applies them as CSS custom properties. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-background", THEME.colors.background);
    root.style.setProperty("--color-foreground", THEME.colors.foreground);
    root.style.setProperty("--color-muted", THEME.colors.muted);
    root.style.setProperty("--color-accent", THEME.colors.accent);
    root.dataset.theme = "dark";
  }, []);

  return <ThemeContext.Provider value={THEME}>{children}</ThemeContext.Provider>;
}
