"use client";

import { createAIStore, type AIStore } from "@synapse/ai";
import { createSafeContext } from "@synapse/hooks";
import { useState, type ReactNode } from "react";

const [AIContext, useAIContext] = createSafeContext<AIStore>("AIProvider");

export { useAIContext };

/**
 * Instantiates the AI conversation store via DI. Knowledge retrieval and
 * prompt assembly arrive in the AI phase.
 */
export function AIProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createAIStore());

  return <AIContext.Provider value={store}>{children}</AIContext.Provider>;
}
