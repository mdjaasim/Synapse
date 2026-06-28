"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AI_ASSISTANT } from "@synapse/config";
import {
  contextualSuggestions,
  defaultMockResponse,
  loadSession,
  matchMockResponse,
  saveSession,
  streamMockTokens,
} from "@synapse/ai";
import type { DistrictId } from "@synapse/types";
import { useAIStore } from "../../hooks/use-ai";
import { useExperienceContext } from "../../providers/ExperienceProvider";
import { useScene } from "../../hooks/use-scene";
import { useStoresContext } from "../../providers/StoresProvider";

/** Digital Jaasim — mock streaming chat with session memory. No external API. */
export function AIInterface() {
  const engine = useExperienceContext();
  const scene = useScene();
  const { settings } = useStoresContext();
  const isOpen = useAIStore((s) => s.isOpen);
  const messages = useAIStore((s) => s.messages);
  const isTyping = useAIStore((s) => s.isTyping);
  const suggestions = useAIStore((s) => s.suggestions);
  const setOpen = useAIStore((s) => s.setOpen);
  const addMessage = useAIStore((s) => s.addMessage);
  const updateMessage = useAIStore((s) => s.updateMessage);
  const setTyping = useAIStore((s) => s.setTyping);
  const setSuggestions = useAIStore((s) => s.setSuggestions);
  const clearConversation = useAIStore((s) => s.clearConversation);
  const [draft, setDraft] = useState("");
  const fabRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const visitedRef = useRef<DistrictId[]>([]);

  const inAiChapter = scene.currentDistrictId === "ai-observatory";

  useEffect(() => {
    const session = loadSession();
    if (session?.messages.length) {
      for (const m of session.messages) {
        addMessage(m);
      }
      visitedRef.current = [...session.visitedDistricts];
      setSuggestions(contextualSuggestions(visitedRef.current));
    }
  }, [addMessage, setSuggestions]);

  useEffect(() => {
    if (scene.currentDistrictId && !visitedRef.current.includes(scene.currentDistrictId)) {
      visitedRef.current.push(scene.currentDistrictId);
      setSuggestions(contextualSuggestions(visitedRef.current));
    }
  }, [scene.currentDistrictId, setSuggestions]);

  useEffect(() => {
    saveSession({ messages, visitedDistricts: visitedRef.current });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) {
        return;
      }
      setOpen(true);
      addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      });
      setDraft("");
      setTyping(true);

      await new Promise((r) => window.setTimeout(r, 400));

      const match = matchMockResponse(trimmed) ?? defaultMockResponse();
      const assistantId = crypto.randomUUID();
      addMessage({
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
      });

      const reducedMotion = settings.getState().reducedMotion;
      let accumulated = "";
      for await (const chunk of streamMockTokens(match.response, reducedMotion)) {
        accumulated += chunk;
        updateMessage(assistantId, accumulated);
      }

      if (match.suggestions) {
        setSuggestions(match.suggestions);
      }
      if (match.navigateToDistrict) {
        engine.bus.publish("ai.navigationRequested", {
          districtId: match.navigateToDistrict,
        });
      }

      setTyping(false);
    },
    [addMessage, engine.bus, isTyping, setOpen, setSuggestions, setTyping, settings, updateMessage],
  );

  const displaySuggestions = suggestions.length > 0 ? suggestions : AI_ASSISTANT.suggestions;

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={() => {
          setOpen(!isOpen);
          if (!isOpen && messages.length === 0) {
            addMessage({
              id: crypto.randomUUID(),
              role: "assistant",
              content: AI_ASSISTANT.greeting,
              createdAt: Date.now(),
            });
            setSuggestions(contextualSuggestions(visitedRef.current));
          }
        }}
        className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 min-h-11 rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${
          inAiChapter
            ? "border-cyan-700/60 bg-cyan-950/80 text-cyan-200"
            : "border-neutral-700 bg-neutral-900/90 text-neutral-400 hover:text-neutral-200"
        }`}
        aria-expanded={isOpen}
        aria-controls="ai-dialog"
      >
        Talk to Jaasim
      </button>

      {isOpen ? (
        <div
          ref={dialogRef}
          id="ai-dialog"
          className="fixed bottom-[max(5rem,calc(env(safe-area-inset-bottom)+3.5rem))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 flex w-[min(100vw-2rem,24rem)] flex-col rounded-xl border border-neutral-800 bg-black/90 shadow-2xl backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Digital Jaasim"
        >
          <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-neutral-200">{AI_ASSISTANT.name}</p>
              <p className="text-[10px] text-neutral-600">Digital Jaasim · mock streaming</p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearConversation();
                visitedRef.current = [];
                setSuggestions(AI_ASSISTANT.suggestions);
              }}
              className="text-[10px] text-neutral-600 hover:text-neutral-400"
              aria-label="Clear conversation"
            >
              Clear
            </button>
          </header>

          <div
            className="flex max-h-64 flex-col gap-3 overflow-y-auto px-4 py-3"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-sm leading-relaxed ${
                  m.role === "user" ? "text-right text-neutral-300" : "text-left text-neutral-400"
                }`}
              >
                {m.content}
                {m.role === "assistant" && isTyping && m.content.length === 0 ? (
                  <span className="inline-block animate-pulse">▋</span>
                ) : null}
              </div>
            ))}
            {isTyping && messages[messages.length - 1]?.role === "user" ? (
              <p className="text-xs text-neutral-600" aria-live="polite">
                Digital Jaasim is thinking…
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1 border-t border-neutral-800 px-3 py-2">
            {displaySuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={isTyping}
                className="min-h-8 rounded-full border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500 hover:border-neutral-600 disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 border-t border-neutral-800 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask anything…"
              disabled={isTyping}
              aria-label="Message to Digital Jaasim"
              className="min-h-11 flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 outline-none focus-visible:border-cyan-700 focus-visible:ring-1 focus-visible:ring-cyan-800"
            />
            <button
              type="submit"
              disabled={isTyping || !draft.trim()}
              className="min-h-11 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
