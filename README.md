# PROJECT SYNAPSE

An award-level interactive portfolio experience built as a reusable engine.

> The portfolio is simply the first application built using the SYNAPSE Engine.

## Architecture

This is a pnpm + Turborepo monorepo. Applications live in `apps/`, and the
reusable engine lives in `packages/`. Applications depend on packages; packages
never depend on an application. Dependencies always flow downward (see
`24.md` — Document 23, Monorepo & Package Architecture).

```text
synapse/
├── apps/
│   └── portfolio/        # Next.js (App Router) application shell
└── packages/
    ├── engine/           # Experience engine, timeline, scene director, event bus
    ├── world/            # Districts, world graph, environmental systems
    ├── renderer/         # React Three Fiber canvas, lighting, post-processing
    ├── animation/        # GSAP timelines, registry, motion tokens
    ├── camera/           # Camera controller, rigs, spline paths
    ├── interactions/     # Hover, focus, selection, cursor, input mapping
    ├── particles/        # Particle systems, behaviors, simulation
    ├── shaders/          # Shader registry, library, compilation
    ├── materials/        # Material tokens, presets, factory
    ├── ai/               # Knowledge retrieval, conversation, memory
    ├── ui/               # Reusable interface components
    ├── assets/           # Asset registry, streaming, loading
    ├── config/           # Constants, feature flags, theme tokens
    ├── hooks/            # Shared reusable React hooks
    ├── types/            # Global TypeScript definitions
    └── utils/            # Pure helper functions
```

Packages are consumed directly as TypeScript source via Next.js
`transpilePackages`; there is no per-package build step at this stage.

## Requirements

- Node `>= 24` (see `.nvmrc`)
- pnpm (managed via Corepack — `packageManager` field in `package.json`)

## Getting started

```bash
corepack enable
pnpm install
pnpm dev          # run all dev tasks via Turborepo
```

## Scripts

| Script              | Description                                |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Run dev tasks across the workspace (Turbo) |
| `pnpm build`        | Build all workspace packages and apps      |
| `pnpm lint`         | Lint all workspaces                        |
| `pnpm type-check`   | Type-check all workspaces (strict)         |
| `pnpm format`       | Format the repository with Prettier        |
| `pnpm format:check` | Verify formatting without writing          |

Linting and formatting are enforced on staged files before every commit via
Husky + lint-staged.

## Build phases

Development follows the phased plan in `CURSOR_PLAYBOOK.md`. This repository is
currently at **Phase 0 — Repository Initialization** (foundation only, no
features). Do not begin a new phase without explicit approval.
