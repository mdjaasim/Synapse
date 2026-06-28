"use client";

import { useCallback, useState } from "react";
import { AI_ASSISTANT } from "@synapse/config";
import type { DistrictId } from "@synapse/types";
import { useAIStore } from "../../hooks/use-ai";
import { useExperienceContext } from "../../providers/ExperienceProvider";
import { useScene } from "../../hooks/use-scene";

function matchResponse(input: string): (typeof AI_ASSISTANT.responses)[number] | null {
  const lower = input.toLowerCase();
  for (const rule of AI_ASSISTANT.responses) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule;
    }
  }
  return null;
}

/** Placeholder AI chat — canned PRD-sourced responses, no external API. */
export function AIInterface() {
  const engine = useExperienceContext();
  const scene = useScene();
  const isOpen = useAIStore((s) => s.isOpen);
  const messages = useAIStore((s) => s.messages);
  const setOpen = useAIStore((s) => s.setOpen);
  const addMessage = useAIStore((s) => s.addMessage);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);

  const inAiChapter = scene.currentDistrictId === "ai-observatory";

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
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

      window.setTimeout(() => {
        const rule = matchResponse(trimmed);
        const reply =
          rule?.response ??
          "I'm not sure about that yet — but ask me about projects, Fuze, engineering, or how I think.";
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          createdAt: Date.now(),
        });
        if (rule && "navigateToDistrict" in rule && rule.navigateToDistrict) {
          engine.bus.publish("ai.navigationRequested", {
            districtId: rule.navigateToDistrict as DistrictId,
          });
        }
        setTyping(false);
      }, 600);
    },
    [addMessage, engine.bus, setOpen],
  );

  return (
    <>
      <button
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
          }
        }}
        className={`fixed bottom-6 right-6 z-40 rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${
          inAiChapter
            ? "border-cyan-700/60 bg-cyan-950/80 text-cyan-200"
            : "border-neutral-700 bg-neutral-900/90 text-neutral-400 hover:text-neutral-200"
        }`}
        aria-expanded={isOpen}
      >
        Talk to Jaasim
      </button>

      {isOpen ? (
        <div
          className="fixed bottom-20 right-6 z-40 flex w-[min(100vw-2rem,24rem)] flex-col rounded-xl border border-neutral-800 bg-black/90 shadow-2xl backdrop-blur-md"
          role="dialog"
          aria-label="Digital Jaasim"
        >
          <header className="border-b border-neutral-800 px-4 py-3">
            <p className="text-sm font-medium text-neutral-200">{AI_ASSISTANT.name}</p>
            <p className="text-[10px] text-neutral-600">Canned responses · PRD personality</p>
          </header>

          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-sm leading-relaxed ${
                  m.role === "user" ? "text-right text-neutral-300" : "text-left text-neutral-400"
                }`}
              >
                {m.content}
              </div>
            ))}
            {typing ? (
              <p className="text-xs text-neutral-600">Digital Jaasim is thinking…</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1 border-t border-neutral-800 px-3 py-2">
            {AI_ASSISTANT.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500 hover:border-neutral-600"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 border-t border-neutral-800 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-neutral-600"
            />
            <button
              type="submit"
              className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-300"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
