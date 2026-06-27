/**
 * @synapse/ai
 *
 * AI conversation state ownership. Knowledge retrieval, prompt assembly, and
 * memory arrive in the AI phase; Phase 1 exposes the AI store factory.
 */

export { createAIStore, type AIActions, type AIStore, type AIStoreState } from "./stores/ai.store";
