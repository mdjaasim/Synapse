"use client";

import type { ReactNode } from "react";
import { AccessibilityProvider } from "./AccessibilityProvider";
import { AIProvider } from "./AIProvider";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { ExperienceProvider } from "./ExperienceProvider";
import { PerformanceProvider } from "./PerformanceProvider";
import { QueryProvider } from "./QueryProvider";
import { StoresProvider } from "./StoresProvider";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Composes every application provider in dependency order. Performance depends
 * on Experience; Accessibility depends on Stores.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ExperienceProvider>
        <StoresProvider>
          <ThemeProvider>
            <AccessibilityProvider>
              <PerformanceProvider>
                <AIProvider>
                  <AnalyticsProvider>{children}</AnalyticsProvider>
                </AIProvider>
              </PerformanceProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </StoresProvider>
      </ExperienceProvider>
    </QueryProvider>
  );
}
