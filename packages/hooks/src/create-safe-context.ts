import { createContext, useContext, type Context } from "react";

/**
 * Creates a typed React context plus a hook that throws when consumed outside
 * its provider. Shared by every application provider to avoid repeating the
 * null-check boilerplate.
 */
export function createSafeContext<T>(name: string): readonly [Context<T | null>, () => T] {
  const context = createContext<T | null>(null);
  context.displayName = name;

  function useSafeContext(): T {
    const value = useContext(context);
    if (value === null) {
      throw new Error(`${name} must be used within its provider.`);
    }
    return value;
  }

  return [context, useSafeContext] as const;
}
