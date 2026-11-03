# Pinned Source Design System Implementation Plan

> **For agentic workers:** Use the parallel worker task scopes below. All changes are in place; no commits or pushes are permitted.

**Goal:** Make both styled component systems consumable as centrally maintained source pinned by Git submodule.

**Architecture:** `src/design-system/core`, `base`, and `fluent` form independent public source entry points. The existing application remains the showcase and consumes those runtime APIs. Consumers install upstream dependencies and compile source directly.

**Tech Stack:** React 19, TypeScript, Vite, CSS Modules, Base UI, headless Fluent UI, Bun and Vitest.

**Spec:** `docs/superpowers/specs/2026-11-02-pinned-design-system-design.md`

## Global Constraints

- No commits or pushes.
- Parallel workers use `azure-foundry/gpt-6-luna`; final independent review uses `azure-foundry/gpt-6.1-sol`.
- Edit in the existing working directory; do not create worktrees.
- No new upstream UI dependency or internal npm publication.
- The reusable runtime cannot import showcase components or their CSS.
- Preserve separate Base and Fluent APIs and existing showcase behavior.

## Review Focus

- A plain consumer without the editor must receive default tokens before runtime effects.
- Portaled overlays must inherit document-wide theme tokens.
- Unmounting the theme owner must restore prior document token values.
- Optional token reset and preset selection must not retain stale custom variables.
- Consumer compilation must not depend on showcase imports, its Tailwind pipeline or a second React installation.

## Task 1: Core runtime (parallel worker A)

**Own:** `src/design-system/core/**`, token/conversion compatibility files and tests, `DesignSystemContext.tsx` and its tests.

**Produces:** `core/index.ts` exports `ThemeProvider`, `useTheme`, tokens, presets, conversion and export utilities. `useTheme()` exposes `tokens`, `activePresetId`, `activePreset`, `selectPreset`, `updateToken`, `updateTokens`, `resetTokens`. `core/theme.css` supplies enterprise default variables.

- [x] Move token and utility implementation into core; preserve old import paths as re-exports.
- [x] Add meaningful tests for theme defaults, preset/patch/reset, optional variable removal, server rendering and root cleanup.
- [x] Implement runtime provider and static theme defaults; runtime imports no showcase state.
- [x] Compose the runtime provider into the existing showcase provider; preserve pane and selection APIs.
- [x] Run targeted core/context tests; report files, commands and remaining issues.

## Task 2: Base reusable components (parallel worker B)

**Own:** `src/design-system/base/**`, `src/components/BaseUIDesignSystem/**`.

**Consumes:** shared CSS token names already declared by `tokenExport.ts`; no dependency on new provider implementation.

**Produces:** public Base entry and styled component APIs covering the existing showcase component set.

- [x] Read each demo and its CSS; identify primitive composition and component styles versus showcase layout.
- [x] Extract reusable component styles and thin typed wrappers, preserving refs, primitive props, data attributes and class overrides.
- [x] Keep named compound primitive parts where composition is required; preserve accessible upstream behavior.
- [x] Migrate demonstrations to exported styled wrappers and leave demo-only layout styles in showcase.
- [x] Add meaningful rendering/interaction tests for representative public APIs and run targeted tests/type checking.

## Task 3: Fluent public setup (parallel worker C)

**Own:** `src/design-system/fluent/**`, `src/components/FluentDesignSystem/FluentDesignSystemView.tsx`.

**Consumes:** `useTheme` from `../core`, returning `tokens.touchTargetMin`.

**Produces:** `FluentProvider` exported from Fluent public entry, combining upstream provider, root reset scope, sizing context and stylesheet.

- [x] Add typed provider with children and optional explicit size override, using core theme tokens for default size.
- [x] Migrate showcase view to provider; remove duplicate headless setup.
- [x] Verify runtime does not import showcase code and retains its CSS layer contract.
- [x] Add provider tests covering inherited sizing and explicit override; run focused checks.

## Task 4: Distribution integration (coordinator after worker completion)

**Own:** README, consumer documentation, fixture/config files, package scripts and integration tests. Do not edit worker-owned files concurrently.

- [x] Document installation of exact upstream dependency ranges from package.json, source aliases and CSS entry points.
- [x] Document Git submodule initialization and updates that pin a reviewed commit; explain source ownership and single document-wide theme.
- [x] Add isolated consumer smoke app importing only core/Base/Fluent public APIs with no Tailwind requirement.
- [x] Build that consumer and verify runtime import closure excludes showcase and resolves consumer dependencies.

## Task 5: Whole-change validation and review

- [x] Run `bun run lint`, `bun run test`, `bun run build` and the isolated consumer build.
- [x] Dispatch Azure `gpt-6.1-sol` for read-only whole-diff review against the spec, including runtime import closure and consumer use.
- [x] Resolve concrete findings, rerun affected checks, and report results and the uncommitted change summary.
