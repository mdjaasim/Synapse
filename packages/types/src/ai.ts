/**
 * AI-domain types: chat messages and the conversation state shape.
 */

import type { DistrictId } from "./experience";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  readonly id: string;
  readonly role: ChatRole;
  readonly content: string;
  readonly createdAt: number;
}

/** AI conversation state. Owned by @synapse/ai (Layer "AI"). */
export interface AIState {
  readonly messages: readonly ChatMessage[];
  readonly isTyping: boolean;
  readonly suggestions: readonly string[];
  readonly pendingNavigation: DistrictId | null;
  readonly isOpen: boolean;
}
