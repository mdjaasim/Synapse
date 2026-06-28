"use client";

import {
  AI_ASSISTANT,
  CAREER_MILESTONES,
  CLIENT_PROJECTS,
  CONTACT,
  ENGINEERING_PHILOSOPHY,
  MEMORY_FRAGMENTS,
  PERSONAL_PROJECTS,
  PORTFOLIO_IDENTITY,
  SKILLS,
} from "@synapse/config";
import { ScrollSection, ProjectCard } from "./scroll/ScrollSection";

/** Full narrative scroll journey — drives SceneDirector via scroll progress. */
export function ScrollStage() {
  return (
    <div id="scroll-stage" className="relative w-full" data-slot="scroll-stage">
      {/* Origin Void */}
      <ScrollSection label="Origin" title="Synapse">
        <p>{PORTFOLIO_IDENTITY.tagline}</p>
        <p className="mt-4 text-neutral-500">{PORTFOLIO_IDENTITY.subtitle}</p>
      </ScrollSection>
      <ScrollSection label="Origin" title="Awakening">
        The luminous core breathes. Every movement is choreographed as narrative progress advances.
      </ScrollSection>
      <ScrollSection label="Origin" title="Depth">
        Pull back to observe the void — atmosphere, dust, and the living center of the universe.
      </ScrollSection>
      <ScrollSection label="Origin" title="Horizon">
        The edge of the Origin Void — where discovery begins.
      </ScrollSection>

      {/* Project Galaxy — 5C */}
      <ScrollSection label="Project Galaxy" title="Project Discovery">
        <p>Personal projects as miniature planets — each with its own atmosphere and orbit.</p>
        <div className="mt-8 grid w-full max-w-3xl gap-4 md:grid-cols-1">
          {PERSONAL_PROJECTS.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
        </div>
      </ScrollSection>
      <ScrollSection label="Project Galaxy" title="Orbital Exploration">
        Drift between worlds. SYNAPSE is the star — engineering, storytelling, 3D, and AI in one
        universe.
      </ScrollSection>

      {/* Client Worlds — 5D */}
      <ScrollSection label="Client Worlds" title="Career Timeline">
        <div className="space-y-6 text-left">
          {CAREER_MILESTONES.map((m) => (
            <div key={m.id} className="border-l border-neutral-700 pl-4">
              <h3 className="text-sm font-medium text-neutral-300">{m.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{m.context}</p>
              <p className="mt-2 text-xs text-neutral-600">{m.technologies.join(" · ")}</p>
            </div>
          ))}
        </div>
      </ScrollSection>
      <ScrollSection label="Client Worlds" title="Client Ecosystems">
        <div className="grid w-full max-w-3xl gap-4">
          {CLIENT_PROJECTS.map((c) => (
            <ProjectCard
              key={c.id}
              name={c.name}
              tagline={c.tagline}
              description={c.description}
              tech={c.tech}
            />
          ))}
        </div>
      </ScrollSection>

      {/* Engineering Core — 5E */}
      <ScrollSection label="Engineering Core" title="Systems Lattice">
        <div className="flex flex-wrap justify-center gap-2">
          {SKILLS.map((s) => (
            <span
              key={s.id}
              title={s.description}
              className="cursor-default rounded-full border border-neutral-700 bg-neutral-900/50 px-3 py-1 text-xs text-neutral-400 transition-colors hover:border-cyan-800 hover:text-neutral-200"
            >
              {s.name}
            </span>
          ))}
        </div>
      </ScrollSection>
      <ScrollSection label="Engineering Core" title="Engineering Philosophy">
        <div className="grid w-full max-w-2xl gap-4 text-left">
          {ENGINEERING_PHILOSOPHY.map((p) => (
            <div key={p.id}>
              <h3 className="text-sm font-medium text-neutral-300">{p.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{p.description}</p>
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* Knowledge Forest — 5F */}
      <ScrollSection label="Knowledge Forest" title={PORTFOLIO_IDENTITY.name}>
        <p>{PORTFOLIO_IDENTITY.about[0]}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {PORTFOLIO_IDENTITY.roles.map((r) => (
            <span key={r} className="text-[10px] uppercase tracking-wider text-neutral-600">
              {r}
            </span>
          ))}
        </div>
      </ScrollSection>
      <ScrollSection label="Knowledge Forest" title="Growth">
        <p>{PORTFOLIO_IDENTITY.about[1]}</p>
        <p className="mt-4 text-neutral-500">{PORTFOLIO_IDENTITY.about[2]}</p>
        <p className="mt-4 text-xs text-neutral-600">
          Interests: {PORTFOLIO_IDENTITY.interests.join(" · ")}
        </p>
      </ScrollSection>

      {/* AI Observatory — 5G */}
      <ScrollSection label="AI Observatory" title="Digital Presence">
        <p>{AI_ASSISTANT.greeting}</p>
        <p className="mt-4 text-neutral-500">
          Open the chat panel in the corner to talk to Digital Jaasim.
        </p>
      </ScrollSection>
      <ScrollSection label="AI Observatory" title="Talk to Jaasim">
        <p>
          Ask about projects, engineering philosophy, career goals, or what caught your attention
          first.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {AI_ASSISTANT.suggestions.map((s) => (
            <span
              key={s}
              className="rounded-full border border-neutral-800 px-3 py-1 text-xs text-neutral-500"
            >
              {s}
            </span>
          ))}
        </div>
      </ScrollSection>

      {/* Memory Stream — 5H */}
      <ScrollSection label="Memory Stream" title={CONTACT.headline}>
        <p>{CONTACT.description}</p>
        <div className="mt-8 grid w-full max-w-md gap-3">
          {CONTACT.methods.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-3 text-left"
            >
              <p className="text-sm text-neutral-300">{m.label}</p>
              <p className="text-xs text-neutral-600">{m.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-neutral-700">{CONTACT.note}</p>
      </ScrollSection>
      <ScrollSection label="Memory Stream" title="Infinite Future" minHeight="min-h-[70vh]">
        <p>{CONTACT.endingCopy}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {MEMORY_FRAGMENTS.map((f) => (
            <span key={f} className="text-xs italic text-neutral-600">
              {f}
            </span>
          ))}
        </div>
        <p className="mt-12 text-xs text-neutral-700">End of journey — scroll up to revisit</p>
      </ScrollSection>
    </div>
  );
}
