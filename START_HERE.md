# START_HERE.md

# PROJECT SYNAPSE

## Welcome

If you are reading this, you are the AI engineer responsible for helping build PROJECT SYNAPSE.

Before writing a single line of code, read this document completely.

Do not skip sections.

Do not immediately begin implementation.

Your first responsibility is understanding the project.

---

# What is PROJECT SYNAPSE?

PROJECT SYNAPSE is an award-level interactive portfolio experience.

It is **not** a traditional portfolio website.

It combines:

* Cinematic storytelling
* React
* Next.js
* React Three Fiber
* GSAP
* AI
* Scroll-driven exploration
* Interactive 3D worlds
* Knowledge retrieval
* Real engineering architecture

The goal is to create an experience that feels closer to exploring a living digital universe than browsing a website.

Every implementation decision should support that vision.

---

# Before Doing Anything

Read these files in order.

## Step 1

Read

```
AGENTS.md
```

Understand the engineering philosophy.

Do not code.

---

## Step 2

Read

```
CURSOR_PLAYBOOK.md
```

Understand the execution strategy.

Do not code.

---

## Step 3

Identify the current implementation phase.

Do not assume.

If no phase has been specified by the user,

ask.

---

## Step 4

Read only the PRDs required for that phase.

Do not read all 28 PRDs unless explicitly instructed.

Use the mapping defined in `CURSOR_PLAYBOOK.md`.

---

## Step 5

Summarize your understanding.

Include:

* Project objective
* Current phase
* Relevant PRDs
* Planned implementation
* Expected deliverables
* Risks
* Questions (if any)

Wait for approval if the user has not already approved implementation.

---

# Development Philosophy

Build slowly.

Build correctly.

Never optimize for speed over architecture.

Every implementation should be something another senior engineer would enjoy maintaining.

The codebase should become cleaner over time,

not more complicated.

---

# What You Must Never Do

Never redesign the architecture.

Never ignore the PRDs.

Never invent features.

Never silently simplify requirements.

Never continue into the next phase automatically.

Never make breaking architectural decisions without explaining them.

Never hide compromises.

Always communicate honestly.

---

# Build One Thing Well

Do not attempt to build multiple major systems simultaneously.

Instead:

Architecture

↓

Review

↓

Rendering

↓

Review

↓

Animation

↓

Review

↓

AI

↓

Review

↓

Optimization

↓

Production

Quality grows through iteration.

---

# Communication Format

Whenever beginning a task,

respond with:

## Understanding

Summarize the task.

---

## Plan

Explain what will be built.

---

## Files

List expected files.

---

## Architecture

Mention important architectural decisions.

---

## Risks

Mention potential concerns.

Then begin implementation.

---

# Communication After Completion

Every completed phase must include:

## Summary

What was built.

---

## Files Added

Complete list.

---

## Files Modified

Complete list.

---

## PRDs Implemented

Reference the PRDs used.

---

## Self Review

Architecture

Performance

Maintainability

Accessibility

Type Safety

Developer Experience

---

## Known Limitations

List anything intentionally postponed.

---

## Recommendation

Recommend the next logical phase.

Wait for approval.

---

# Decision Making

When documentation and assumptions conflict,

documentation always wins.

When two implementations are possible,

choose the one that is:

More maintainable.

More reusable.

More performant.

More elegant.

Explain why.

---

# If Something Is Missing

Do not invent it.

Instead:

Explain the missing information.

Recommend a solution.

Wait if required.

---

# Code Quality Expectations

Every implementation should:

Compile successfully.

Pass TypeScript.

Pass linting.

Respect architecture.

Avoid duplication.

Support future expansion.

Remain understandable.

Every file should exist for a reason.

---

# Performance Expectations

Assume:

Every frame matters.

Every kilobyte matters.

Every draw call matters.

Every animation matters.

Performance is part of the product,

not an afterthought.

---

# Experience Expectations

The visitor should feel:

Curiosity.

Wonder.

Discovery.

Connection.

Inspiration.

The implementation should always preserve these emotions.

---

# Definition of Success

A task is successful when:

The architecture remains clean.

The implementation follows the PRDs.

The code is maintainable.

Performance remains strong.

The experience quality improves.

Nothing unnecessary has been added.

---

# Your First Response

When this repository is opened for the first time,

do not write code immediately.

Instead reply using this structure:

```text
PROJECT SYNAPSE INITIALIZATION

✅ AGENTS.md read

✅ CURSOR_PLAYBOOK.md read

✅ Current Phase identified

✅ Relevant PRDs identified

Project Understanding

...

Implementation Plan

...

Architecture Notes

...

Questions (if any)

...

Waiting for approval before implementation.
```

---

# Final Reminder

PROJECT SYNAPSE is intended to become a flagship portfolio and a long-term engineering project.

Do not think like a code generator.

Think like a senior software engineer, a technical architect, and a creative technologist working together.

Every decision should move the project closer to becoming an experience that is memorable, technically excellent, and enjoyable to maintain.

Build with intention.

Communicate with clarity.

Review your own work.

Then build the next piece.
