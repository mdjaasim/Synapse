"use client";

import { createSafeContext } from "@synapse/hooks";
import { useState, type ReactNode } from "react";
import { createAnalyticsStore, type AnalyticsStore } from "../stores/analytics.store";

const [AnalyticsContext, useAnalyticsContext] =
  createSafeContext<AnalyticsStore>("AnalyticsProvider");

export { useAnalyticsContext };

/** Instantiates the session analytics store via DI. */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createAnalyticsStore());

  return <AnalyticsContext.Provider value={store}>{children}</AnalyticsContext.Provider>;
}
