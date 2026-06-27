/**
 * @synapse/interactions
 *
 * Interaction state ownership. Hover/focus/selection/cursor logic arrives in
 * later phases; Phase 1 exposes the interaction store factory.
 */

export {
  createInteractionStore,
  type InteractionActions,
  type InteractionStore,
  type InteractionStoreState,
} from "./stores/interaction.store";
