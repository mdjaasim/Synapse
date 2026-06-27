import type {
  EventHandler,
  EventName,
  EventPayload,
  SynapseEventBus,
  Unsubscribe,
} from "@synapse/types";

/**
 * Internal handler storage type. Handlers are stored behind a single
 * `unknown`-payload signature so the map can hold differently-typed handlers;
 * the public methods restore precise types at the boundary.
 */
type StoredHandler = (payload: unknown) => void;

/**
 * A typed, synchronous publish/subscribe Event Bus. This is an instance class
 * (never a module-scope singleton) so each Experience Engine owns its own bus.
 */
export class EventBus implements SynapseEventBus {
  readonly #handlers = new Map<EventName, Set<StoredHandler>>();

  publish<K extends EventName>(event: K, payload: EventPayload<K>): void {
    const handlers = this.#handlers.get(event);
    if (!handlers) return;
    // Copy to allow handlers to (un)subscribe during dispatch.
    for (const handler of [...handlers]) {
      handler(payload);
    }
  }

  subscribe<K extends EventName>(event: K, handler: EventHandler<K>): Unsubscribe {
    const stored = handler as unknown as StoredHandler;
    const handlers = this.#handlers.get(event) ?? new Set<StoredHandler>();
    handlers.add(stored);
    this.#handlers.set(event, handlers);

    return () => {
      handlers.delete(stored);
      if (handlers.size === 0) {
        this.#handlers.delete(event);
      }
    };
  }

  once<K extends EventName>(event: K, handler: EventHandler<K>): Unsubscribe {
    const unsubscribe = this.subscribe(event, (payload) => {
      unsubscribe();
      handler(payload);
    });
    return unsubscribe;
  }

  clear(event?: EventName): void {
    if (event) {
      this.#handlers.delete(event);
    } else {
      this.#handlers.clear();
    }
  }
}

export function createEventBus(): SynapseEventBus {
  return new EventBus();
}
