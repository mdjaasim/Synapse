# AGENTS.md

# PROJECT SYNAPSE — AI Engineering Constitution

Version 1.0

---

# Read This First

If you are an AI coding agent (Cursor, Claude Code, Codex, Windsurf, Cline, Roo Code, or similar), this is the first document you must read before making any changes to this repository.

This file defines the permanent engineering philosophy of PROJECT SYNAPSE.

It is intentionally concise compared to the PRDs.

The PRDs explain **what** to build.

This document explains **how you should think while building it.**

---

# Mission

You are helping build **PROJECT SYNAPSE**.

SYNAPSE is not a typical portfolio.

It is an award-level interactive digital experience combining:

* Storytelling
* 3D Graphics
* React
* Three.js
* GSAP
* AI
* Scroll-driven cinematography
* Interactive exploration

The goal is **not** to maximize code output.

The goal is to maximize experience quality.

Every engineering decision should improve immersion.

---

# Primary Objective

Every implementation should satisfy all four goals simultaneously.

1. Beautiful

2. Performant

3. Maintainable

4. Expandable

If one goal conflicts with another, prefer the solution that preserves long-term architecture.

---

# Project Philosophy

The visitor should never feel they are browsing a website.

They should feel they are exploring a living digital universe.

Every line of code should contribute toward this illusion.

---

# Source of Truth

The repository contains multiple design documents.

Priority order is:

1.

Approved User Instructions

↓

2.

Project PRDs

↓

3.

AGENTS.md

↓

4.

CURSOR_PLAYBOOK.md

↓

5.

Existing Codebase

↓

6.

Reasonable Engineering Assumptions

Never invent architecture when documentation already exists.

---

# Golden Rules

Always prefer architecture over shortcuts.

Always prefer readability over cleverness.

Always prefer reusable systems over duplicated code.

Always prefer consistency over novelty.

Always optimize after correctness, never before.

Never break an existing architectural boundary.

---

# Engineering Principles

Every system should have:

One responsibility.

One owner.

One public interface.

One predictable lifecycle.

Avoid "god objects."

Avoid hidden behavior.

Avoid magic.

---

# Think Like an Engine Builder

Do not think:

"I need to build this component."

Instead think:

"What reusable system should exist that makes this component trivial?"

Systems first.

Features second.

---

# Never Do These Things

Never create large files without necessity.

Never duplicate logic.

Never duplicate state.

Never hardcode values that belong in configuration.

Never bypass the architecture.

Never ignore performance implications.

Never leave TODOs instead of proper implementations without explicitly marking them and explaining why.

Never silently remove existing functionality.

Never invent features that are not requested.

Never simplify the vision without asking.

Never replace technologies defined in the PRDs unless explicitly instructed.

---

# Code Standards

Strict TypeScript only.

No `any`.

Prefer composition over inheritance.

Prefer pure functions.

Prefer immutable updates.

Prefer explicit naming.

Prefer self-documenting code.

Keep modules focused.

Every exported API should have a clear purpose.

---

# Architecture Standards

Business logic must remain separate from UI.

Rendering must remain separate from business logic.

Animation must remain separate from rendering.

State ownership must remain explicit.

Packages must communicate through defined interfaces.

No circular dependencies.

---

# Performance Philosophy

Performance is a product feature.

Assume every frame matters.

Optimize for:

GPU

Memory

Network

Bundle Size

Interaction Latency

Scroll Smoothness

Animation Stability

If an effect harms the experience more than it improves it,

remove or redesign it.

---

# Accessibility Philosophy

Accessibility is required.

Reduced Motion must work.

Keyboard navigation must work.

Semantic HTML should be used whenever appropriate.

Never sacrifice accessibility for visual novelty.

---

# Animation Philosophy

Animation exists to communicate.

Not decorate.

Every animation should answer:

Why does this move?

If the answer is "because it looks cool",

reconsider the animation.

---

# Three.js Philosophy

Three.js is the renderer.

Not the application.

Avoid placing business logic inside rendering code.

Prefer reusable abstractions.

Dispose resources correctly.

Share materials.

Reuse geometry.

Instance whenever appropriate.

---

# AI Philosophy

The AI represents Mohamed Jaasim.

It must remain authentic.

Never fabricate experiences.

Never exaggerate achievements.

Never invent projects.

Never hallucinate technical knowledge.

If uncertain,

admit uncertainty.

Truth is more valuable than confidence.

---

# Visual Philosophy

SYNAPSE should feel:

Elegant

Premium

Minimal

Cinematic

Calm

Confident

Not flashy.

Not noisy.

Not overwhelming.

Quality comes from restraint.

---

# Communication Style

When responding to the user during development:

Be concise.

Be technical.

Be honest.

Explain trade-offs.

Highlight risks.

Suggest improvements when appropriate.

Never pretend something is finished when it is not.

---

# Decision Making

When multiple valid implementations exist:

Prefer:

Maintainability

↓

Performance

↓

Developer Experience

↓

Implementation Speed

↓

Micro-optimizations

Think in years.

Not days.

---

# Handling Uncertainty

If requirements are unclear:

Do not guess.

Instead:

Summarize the ambiguity.

Present options.

Recommend one.

Wait for confirmation if the decision changes architecture.

---

# Self Review

Before considering any task complete, review:

Architecture

Code Quality

Type Safety

Performance

Accessibility

Error Handling

Maintainability

Consistency

Developer Experience

If improvements exist,

mention them.

---

# Working Process

Every implementation should follow:

Understand

↓

Plan

↓

Build

↓

Review

↓

Refactor

↓

Verify

↓

Report

Never skip planning.

Never skip review.

---

# Completion Report Format

After every completed task provide:

## Summary

What was built.

---

## Files Added

List all new files.

---

## Files Modified

List modified files.

---

## Architecture Decisions

Important implementation decisions.

---

## Risks

Current limitations.

---

## Recommendations

Suggested next step.

---

## Ready For Review

Wait for approval before major architectural changes.

---

# Definition of Success

Success is not measured by:

Number of files.

Lines of code.

Speed of implementation.

Success is measured by:

Architecture quality.

Experience quality.

Maintainability.

Performance.

Scalability.

Developer clarity.

Visitor delight.

---

# Final Reminder

PROJECT SYNAPSE is intended to become a flagship portfolio.

Every implementation should be something a senior engineer would be proud to maintain and a visitor would be excited to explore.

When in doubt, build less—but build it exceptionally well.
