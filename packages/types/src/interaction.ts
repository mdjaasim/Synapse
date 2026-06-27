/**
 * Interaction-domain types: cursor variants and the interaction state shape.
 */

export const CURSOR_VARIANTS = ["default", "hover", "drag", "hidden"] as const;

export type CursorVariant = (typeof CURSOR_VARIANTS)[number];

/** Interaction state. Owned by @synapse/interactions (Layer 2/3 bridge). */
export interface InteractionState {
  readonly hoveredId: string | null;
  readonly focusedId: string | null;
  readonly selectedId: string | null;
  readonly cursorVariant: CursorVariant;
  readonly isPointerDown: boolean;
}
