# CURSOR_PLAYBOOK.md

# PROJECT SYNAPSE — Development Playbook

Version 1.0

---

# Purpose

This document defines how an AI coding agent should build PROJECT SYNAPSE.

This is not a product specification.

This is an execution guide.

The objective is to ensure the implementation remains faithful to the vision, follows the defined architecture, and progresses in small, reviewable milestones.

Never attempt to build the entire project in one iteration.

---

# Mandatory Reading Order

Before writing any code, read these documents in order:

1. AGENTS.md

2. Relevant PRDs for the current phase only

3. Existing codebase

Only after understanding all three should implementation begin.

---

# Global Development Rules

Always build incrementally.

Never implement multiple major systems in one iteration.

Never skip review.

Never continue automatically after completing a phase.

Always wait for user approval.

---

# Standard Workflow

Every task follows this sequence.

```text
Read

↓

Understand

↓

Summarize

↓

Plan

↓

Implement

↓

Self Review

↓

Performance Review

↓

Architecture Review

↓

Report

↓

Wait for Approval
```

Skipping any step is not allowed.

---

# Communication Style

Communicate like a senior software engineer.

Responses should be:

Clear

Concise

Technical

Honest

Never exaggerate progress.

Never hide limitations.

Always explain important architectural decisions.

---

# Phase Overview

The implementation is divided into nine phases.

---

## Phase 0

Repository Initialization

Read

AGENTS.md

PRDs 21–24

Tasks

Initialize repository.

Configure tooling.

Configure TypeScript.

Configure linting.

Configure formatting.

Configure folder structure.

Configure packages.

Do NOT build features.

Deliverable

A clean architectural foundation.

STOP.

Wait for approval.

---

## Phase 1

Core Architecture

Read

PRDs 21–24

Tasks

Application shell.

Experience Engine.

Package architecture.

Stores.

Event Bus.

Basic routing.

Providers.

No animations.

No Three.js world.

Deliverable

Architecture skeleton.

STOP.

---

## Phase 2

Rendering Foundation

Read

PRDs 16–20

PRDs 25–27

Tasks

Canvas.

Renderer.

Camera.

Lighting.

Materials.

Shader framework.

Origin Void.

Basic atmosphere.

No project districts.

Deliverable

First explorable world.

STOP.

---

## Phase 3

Animation Systems

Read

PRD 25

Tasks

Animation Engine.

Timeline Registry.

Scroll synchronization.

Motion tokens.

Camera transitions.

Debug timeline.

Deliverable

Stable cinematic animation framework.

STOP.

---

## Phase 4

Particle & Environment

Read

PRDs 17–19

PRD 26

Tasks

Particle Engine.

Fog.

Atmosphere.

Energy rivers.

Environmental simulation.

World breathing.

Deliverable

Living universe.

STOP.

---

## Phase 5

District Framework

Read

PRDs 1–12

16–20

Tasks

District Manager.

Origin.

Knowledge Forest.

Engineering Core.

Client Worlds.

Navigation.

Streaming.

Deliverable

Full navigable universe structure.

STOP.

---

## Phase 6

AI Integration

Read

PRDs 13–15

Tasks

Knowledge system.

Conversation.

Navigation.

AI Observatory.

Memory.

Chat.

Deliverable

Working Digital Jaasim.

STOP.

---

## Phase 7

Projects & Content

Read

Relevant project documentation.

Resume.

LinkedIn.

Knowledge files.

Tasks

Import projects.

Create project worlds.

Populate AI knowledge.

Project interactions.

Media.

Deliverable

Complete portfolio content.

STOP.

---

## Phase 8

Optimization & Production

Read

PRD 28

Tasks

Performance.

Accessibility.

SEO.

Analytics.

Deployment.

Testing.

Optimization.

Deliverable

Production-ready build.

STOP.

Project complete.

---

# Build Philosophy

Do not chase visible progress.

Build foundations first.

A strong architecture accelerates every future feature.

---

# Coding Standards

Strict TypeScript.

No any.

No ignored errors.

No dead code.

No duplicated logic.

No placeholder implementations unless explicitly requested.

---

# Architecture Rules

Never violate package boundaries.

Never bypass the Event Bus.

Never duplicate stores.

Never place rendering logic inside UI.

Never place business logic inside components.

Never tightly couple independent systems.

---

# Animation Rules

Never create GSAP timelines inside presentation components.

Register every timeline.

Reuse animation tokens.

Support reverse playback.

Support cleanup.

Support interruption.

---

# Three.js Rules

Dispose resources.

Reuse geometry.

Reuse materials.

Use instancing.

Avoid unnecessary allocations.

Never mutate unrelated scene objects.

---

# AI Rules

Never invent knowledge.

Never fabricate experiences.

Always retrieve from approved knowledge.

Maintain personality consistency.

Respect guardrails.

---

# Performance Rules

Assume every feature affects FPS.

Before introducing visual complexity, ask:

Is this necessary?

Can this be reused?

Can this be cheaper?

Can this be deferred?

---

# When Unsure

If documentation is ambiguous:

Summarize the ambiguity.

Offer possible approaches.

Recommend one.

Wait if the decision changes architecture.

Do not guess.

---

# Definition of Done (Per Phase)

A phase is complete only if:

The requested scope is implemented.

Architecture remains clean.

No TypeScript errors exist.

No lint errors exist.

No console errors exist.

Performance has not regressed.

The implementation matches the relevant PRDs.

A self-review has been completed.

---

# Required Completion Report

At the end of every phase provide:

## Phase Summary

What was implemented.

---

## Files Created

Complete list.

---

## Files Modified

Complete list.

---

## Architecture Decisions

Important implementation choices.

---

## Performance Notes

Potential bottlenecks.

Optimizations applied.

---

## Risks

Current limitations.

Future considerations.

---

## PRD Compliance

List which PRDs were implemented.

Highlight any intentional deviations.

---

## Recommended Next Phase

Explain what should happen next.

Then wait for user approval.

---

# Self Review Checklist

Before submitting work ask:

Did I follow the architecture?

Did I duplicate anything?

Can anything be simplified?

Did I introduce technical debt?

Does this remain scalable?

Would another engineer understand this?

Would this pass a professional code review?

---

# Failure Recovery

If implementation becomes inconsistent:

Stop.

Do not continue adding features.

Identify the architectural issue.

Explain the root cause.

Propose a refactor.

Wait for approval before proceeding.

---

# Definition of Success

PROJECT SYNAPSE succeeds when:

The architecture remains elegant.

The experience feels cinematic.

Performance remains excellent.

The AI feels authentic.

Every system is reusable.

Future expansion is straightforward.

Visitors remember the experience long after leaving.

---

# Final Instruction

Do not optimize for speed.

Optimize for craftsmanship.

Every commit should move PROJECT SYNAPSE closer to becoming an award-winning interactive experience.

Build deliberately.

Review honestly.

Iterate continuously.

Never sacrifice long-term quality for short-term progress.
