"use client";

import type { ReactNode } from "react";
import { AccessibilityProvider } from "./AccessibilityProvider";
import { AIProvider } from "./AIProvider";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { AnimationProvider } from "./AnimationProvider";
import { EnvironmentProvider } from "./EnvironmentProvider";
import { CameraProvider } from "./CameraProvider";
import { ExperienceProvider } from "./ExperienceProvider";
import { PerformanceProvider } from "./PerformanceProvider";
import { QueryProvider } from "./QueryProvider";
import { ScrollProvider } from "./ScrollProvider";
import { StoresProvider } from "./StoresProvider";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Composes every application provider in dependency order.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ExperienceProvider>
        <StoresProvider>
          <CameraProvider>
            <AnimationProvider>
              <EnvironmentProvider>
                <ScrollProvider>
                  <ThemeProvider>
                    <AccessibilityProvider>
                      <PerformanceProvider>
                        <AIProvider>
                          <AnalyticsProvider>{children}</AnalyticsProvider>
                        </AIProvider>
                      </PerformanceProvider>
                    </AccessibilityProvider>
                  </ThemeProvider>
                </ScrollProvider>
              </EnvironmentProvider>
            </AnimationProvider>
          </CameraProvider>
        </StoresProvider>
      </ExperienceProvider>
    </QueryProvider>
  );
}
