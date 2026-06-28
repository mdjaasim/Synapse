import { AI_ASSISTANT } from "@synapse/config";
import type { ChatMessage, DistrictId } from "@synapse/types";

export interface MockMatchResult {
  readonly response: string;
  readonly navigateToDistrict?: DistrictId;
  readonly suggestions?: readonly string[];
}

export function matchMockResponse(input: string): MockMatchResult | null {
  const lower = input.toLowerCase();
  for (const rule of AI_ASSISTANT.responses) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      const nav =
        "navigateToDistrict" in rule && rule.navigateToDistrict
          ? (rule.navigateToDistrict as DistrictId)
          : undefined;
      return {
        response: rule.response,
        ...(nav ? { navigateToDistrict: nav } : {}),
      };
    }
  }
  return null;
}

export function defaultMockResponse(): MockMatchResult {
  return {
    response:
      "I'm not sure about that yet — but ask me about projects, Fuze, engineering, or how I think.",
    suggestions: AI_ASSISTANT.suggestions.slice(0, 3),
  };
}

/** Simulates token streaming for mock responses — no backend required. */
export async function* streamMockTokens(
  text: string,
  reducedMotion: boolean,
): AsyncGenerator<string> {
  if (reducedMotion) {
    yield text;
    return;
  }
  const chunkSize = 2;
  const delayMs = 18;
  for (let i = 0; i < text.length; i += chunkSize) {
    yield text.slice(i, i + chunkSize);
    await new Promise((r) => window.setTimeout(r, delayMs));
  }
}

const SESSION_KEY = "synapse-ai-session";

export interface SessionSnapshot {
  readonly messages: readonly ChatMessage[];
  readonly visitedDistricts: readonly DistrictId[];
}

export function loadSession(): SessionSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionSnapshot) : null;
  } catch {
    return null;
  }
}

export function saveSession(snapshot: SessionSnapshot): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded — session memory is best-effort */
  }
}

export function contextualSuggestions(visited: readonly DistrictId[]): readonly string[] {
  const base = [...AI_ASSISTANT.suggestions];
  if (!visited.includes("project-galaxy")) {
    return base;
  }
  if (!visited.includes("ai-observatory")) {
    return ["Tell me about SYNAPSE", "How do you approach engineering?", "What drives your work?"];
  }
  return ["What's your engineering philosophy?", "Tell me about Fuze", "How can we connect?"];
}
