"use client";

import type { ReactNode } from "react";

function ScrollSection({
  label,
  title,
  children,
  minHeight = "min-h-screen",
}: {
  label: string;
  title: string;
  children: ReactNode;
  minHeight?: string;
}) {
  return (
    <section className={`flex ${minHeight} flex-col items-center justify-center px-6 py-16`}>
      <p className="text-xs uppercase tracking-[0.5em] text-neutral-600">{label}</p>
      <h2 className="mt-4 text-2xl font-light tracking-tight text-neutral-200 md:text-4xl">
        {title}
      </h2>
      <div className="mt-6 max-w-2xl text-center text-sm leading-relaxed text-neutral-400">
        {children}
      </div>
    </section>
  );
}

function ProjectCard({
  name,
  tagline,
  description,
  tech,
}: {
  name: string;
  tagline: string;
  description: string;
  tech: readonly string[];
}) {
  return (
    <article className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 p-5 text-left transition-colors hover:border-neutral-600">
      <h3 className="text-sm font-medium text-neutral-200">{name}</h3>
      <p className="mt-1 text-xs text-neutral-500">{tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-neutral-400">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-neutral-700 px-2 py-0.5 text-[10px] text-neutral-500"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

export { ScrollSection, ProjectCard };
