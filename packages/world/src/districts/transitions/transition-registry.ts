import type { DistrictTransitionKind } from "@synapse/types";

export interface TransitionHandler {
  readonly kind: DistrictTransitionKind;
  /** Phase 5A: instant completion. Phase 5B adds visual effects. */
  execute(): void;
}

/** Registered transition handlers — visuals deferred to Phase 5B. */
export class TransitionRegistry {
  readonly #handlers = new Map<DistrictTransitionKind, TransitionHandler>();

  register(handler: TransitionHandler): void {
    this.#handlers.set(handler.kind, handler);
  }

  get(kind: DistrictTransitionKind): TransitionHandler {
    const handler = this.#handlers.get(kind);
    if (!handler) {
      throw new Error(`Transition handler "${kind}" is not registered.`);
    }
    return handler;
  }

  has(kind: DistrictTransitionKind): boolean {
    return this.#handlers.has(kind);
  }

  dispose(): void {
    this.#handlers.clear();
  }
}

function createInstantHandler(kind: DistrictTransitionKind): TransitionHandler {
  return { kind, execute() {} };
}

/** Creates a registry with all six transition kinds (instant stubs). */
export function createTransitionRegistry(): TransitionRegistry {
  const registry = new TransitionRegistry();
  const kinds: DistrictTransitionKind[] = [
    "fade",
    "portal",
    "camera-flight",
    "shader-dissolve",
    "blackout",
    "crossfade",
  ];
  for (const kind of kinds) {
    registry.register(createInstantHandler(kind));
  }
  return registry;
}
