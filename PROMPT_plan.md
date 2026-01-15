# Planning Mode: FastReader Speed Reading App

## Phase 0: Orient

0a. Study `specs/*` with up to 250 parallel Sonnet subagents to learn the application specifications.

0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand the plan so far.

0c. Study `src/lib/*` with up to 250 parallel Sonnet subagents to understand shared utilities & components.

0d. For reference, the application source code is in `src/*`.

## Phase 1: Gap Analysis & Planning

1. Study @IMPLEMENTATION_PLAN.md (if present; it may be incorrect) and use up to 500 Sonnet subagents to study existing source code in `src/*` and compare it against `specs/*`. Use an Opus subagent to analyze findings, prioritize tasks, and create/update @IMPLEMENTATION_PLAN.md as a bullet point list sorted in priority of items yet to be implemented. Ultrathink. Consider searching for TODO, minimal implementations, placeholders, skipped/flaky tests, and inconsistent patterns. Study @IMPLEMENTATION_PLAN.md to determine starting point for research and keep it up to date with items considered complete/incomplete using subagents.

IMPORTANT: Plan only. Do NOT implement anything. Do NOT assume functionality is missing; confirm with code search first. Treat `src/lib` as the project's standard library for shared utilities and components. Prefer consolidated, idiomatic implementations there over ad-hoc copies.

ULTIMATE GOAL: We want to achieve a FastReader-style speed reading application with RSVP display, OVP highlighting, speed control (50-350 WPM), multi-format file parsing (TXT, PDF, EPUB, DOCX), progress tracking, and comprehension warnings above 350 WPM. The app should be a PWA-capable React + TypeScript + Vite web application with comprehensive test coverage. Consider missing elements and plan accordingly. If an element is missing, search first to confirm it doesn't exist, then if needed author the specification at specs/FILENAME.md. If you create a new element then document the plan to implement it in @IMPLEMENTATION_PLAN.md using a subagent.

## Critical Constraints

- Maximum speed: 350 WPM (scientific research shows comprehension degrades significantly above this)
- Warning system required for speeds approaching/exceeding 350 WPM
- All core functionality must have test coverage
- TypeScript strict mode enabled
- Follow React best practices and modern patterns
