import type { DistrictTransitionKind } from "@synapse/types";

export interface NarrativeTransitionHandler {
  readonly kind: DistrictTransitionKind;
  execute(): void;
}

/** Narrative-layer transition handlers — Phase 5B instant completion. */
export class TransitionHandlerRegistry {
  readonly #handlers = new Map<DistrictTransitionKind, NarrativeTransitionHandler>();

  register(handler: NarrativeTransitionHandler): void {
    this.#handlers.set(handler.kind, handler);
  }

  get(kind: DistrictTransitionKind): NarrativeTransitionHandler {
    const handler = this.#handlers.get(kind);
    if (!handler) {
      throw new Error(`Narrative transition handler "${kind}" is not registered.`);
    }
    return handler;
  }

  dispose(): void {
    this.#handlers.clear();
  }
}

export function createTransitionHandlerRegistry(): TransitionHandlerRegistry {
  const registry = new TransitionHandlerRegistry();
  const kinds: DistrictTransitionKind[] = [
    "fade",
    "portal",
    "camera-flight",
    "shader-dissolve",
    "blackout",
    "crossfade",
  ];
  for (const kind of kinds) {
    registry.register({ kind, execute: () => undefined });
  }
  return registry;
}
