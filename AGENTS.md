# Building interfaces in this repository

This repo contains centrally maintained, source-distributed Base and Fluent design systems, plus their showcase. Use the public styled components to build interfaces.

- Read `docs/agent-ui-composition.md` for component selection, variants, styling, and editor composition recipes.
- Read `docs/consuming-design-system.md` when using these sources in another application through a pinned Git submodule.
- Public imports: `src/design-system/core`, `src/design-system/base`, and `src/design-system/fluent`.
- Working examples: `src/components/TaskWorkspace/BaseTaskWorkspace.tsx` and `FluentTaskWorkspace.tsx`.
- Shared example styling/data: `TaskWorkspace.module.css` and `workspaceModel.ts` beside those pages.

Keep Base and Fluent composition APIs separate. Reuse tokens and layout vocabulary; do not invent a universal adapter or import showcase files into the runtime. Prefer existing styled wrappers over importing upstream primitives directly. CSS Modules are used for component/layout styling; upstream state and accessibility behavior should remain intact.

Reference images guide composition, not fixed theme styling. Preserve token-driven control/field/surface radii, colors, borders, shadows, spacing, touch targets, fonts and motion. Substance's pill-control token must not become an unconditional pill style in other themes.

Checks: `bun run lint`, `bun run test`, `bun run build`, and `bun run build:consumer`. For overlays, test real-browser keyboard/dismissal/positioning as well as state tests; jsdom does not verify native popover/dialog behavior or geometry.

For workspace theme changes, run `bun run test:theme-browser` with the dev server running. This checks preset differences and live token overrides against computed browser styles.
