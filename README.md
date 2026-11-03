# UI Design Systems

A React and Vite showcase for exploring Base UI and Fluent UI components. It includes component demonstrations, shared design tokens, theme presets, and token customization. Inter is used for body and heading typography.

## Internal design system

The reusable source lives in `src/design-system/core`, `src/design-system/base`, and `src/design-system/fluent`. Applications can consume this repository as a Git submodule pinned to a reviewed commit, without publishing an internal npm package.

See [consumer setup and pinned updates](docs/consuming-design-system.md) for dependencies, public imports, providers, CSS setup, and CI instructions.

Both systems include a **Task workspace** demo with all 18 component families and a working task-edit popover. See [agent UI composition guidance](docs/agent-ui-composition.md) for component mappings, variants, styling rationale, and overlay/state recipes.

## Use Base UI or Fluent UI in another project as a Git submodule

The consuming application compiles this repository's styled TypeScript components and CSS Modules directly. Its Git history pins the design system to an exact central commit; no internal npm package or separate design-system build is needed. The steps below assume an existing React + TypeScript + Vite application. Other bundlers need equivalent source aliases, React deduplication, and support for TSX, CSS imports, and CSS Modules.

### 1. Add and pin the submodule

Run these commands from the **consuming application's repository root**. Set `UI_REF` to a reviewed commit SHA or tag containing the public `core`, `base`, and `fluent` source entries:

```sh
UI_REF="<reviewed-commit-or-tag>"
git submodule add https://github.com/jurokapsiar/ui.git vendor/design-system
git -C vendor/design-system fetch origin --tags
git -C vendor/design-system checkout --detach "$UI_REF"
git add .gitmodules vendor/design-system
```

Commit `.gitmodules` and the `vendor/design-system` submodule pointer through the application's normal review process. The pointer records the selected commit, so updates are explicit rather than automatically following the central repository's latest branch.

For a fresh application clone:

```sh
git clone --recurse-submodules "<application-repository-url>"
```

For an existing clone, or in CI after checkout:

```sh
git submodule update --init --recursive
```

### 2. Install dependencies in the application

The submodule supplies **your styled component source**, not installed dependencies. Install dependencies in the consuming application, keep its lockfile, and do not run `bun install` inside `vendor/design-system`.

Both systems use React 19:

```sh
bun add 'react@^19.0.1' 'react-dom@^19.0.1'
```

For **Base UI**, add:

```sh
bun add '@base-ui-components/react@^1.0.0-rc.0'
```

For **Fluent UI**, add:

```sh
bun add '@fluentui/react-headless-components-preview@0.3.2' '@fluentui/react-icons@^2.0.345'
```

Install both sets if the application uses both systems. These are the current compatible ranges from this repository's `package.json`; review that file when upgrading the pinned source. Tailwind and the showcase's dependencies are not required by the component runtime.

### 3. Configure source resolution

Merge the following `resolve` configuration into the application's **root `vite.config.ts`**, keeping its existing plugins and settings:

```ts
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@internal-ds': fileURLToPath(
        new URL('./vendor/design-system/src/design-system', import.meta.url),
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
});
```

Add the matching alias to the application's TypeScript configuration. This example assumes `tsconfig.json` is at the application root; paths are relative to the configuration file that declares them:

```json
{
  "compilerOptions": {
    "paths": {
      "@internal-ds/*": ["./vendor/design-system/src/design-system/*"]
    }
  }
}
```

Retain existing `compilerOptions` and path mappings. Ensure the React application configuration includes Vite's `vite/client` types for stylesheet imports. If your project splits its configuration into `tsconfig.app.json` and `tsconfig.node.json`, put this alias in the application configuration used to check the TSX files.

The alias imports source for the application's bundler to compile. Keep one React installation; do not install another dependency tree in the submodule or import its showcase application.

### 4. Compose the chosen system

**Base UI — `src/App.tsx`:**

```tsx
import { ThemeProvider } from '@internal-ds/core';
import { Button } from '@internal-ds/base';

export function App() {
  return (
    <ThemeProvider>
      <Button data-variant="filled" onClick={() => console.log('Saved')}>
        Save
      </Button>
    </ThemeProvider>
  );
}
```

**Fluent UI — `src/App.tsx`:**

```tsx
import { ThemeProvider } from '@internal-ds/core';
import { Button, FluentProvider } from '@internal-ds/fluent';

export function App() {
  return (
    <ThemeProvider>
      <FluentProvider>
        <Button appearance="primary" onClick={() => console.log('Saved')}>
          Save
        </Button>
      </FluentProvider>
    </ThemeProvider>
  );
}
```

Render the chosen `App` from the application's `src/main.tsx` (the example assumes the existing HTML has a `root` element):

```tsx
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

Keep any existing application-wide stylesheet imports in this entry file. Mount **one document-wide `ThemeProvider`**; Fluent additionally needs `FluentProvider` beneath it. If both systems appear in the same application, share that theme provider and alias conflicting component names at import sites. Their component/composition APIs remain separate.

Providers import their runtime stylesheet setup, and components import their CSS Modules. No import of the showcase's `src/index.css` is needed. The static default tokens are also available through `@internal-ds/core/theme.css` for applications that need token CSS without mounting the provider. The cascade order is `theme, base, components, utilities`; use the same order in application styles. The application owns its global reset and font assets.

`ThemeProvider` starts with the Enterprise preset. Inside it, `useTheme()` exposes `selectPreset`, `updateToken`, `updateTokens`, and `resetTokens`. For example, a descendant can call `selectPreset('substance')` or `updateTokens({ radiusControl: '8px' })`. Tokens apply to the document root so portaled overlays inherit them; components should follow token-defined shapes, colors, borders, spacing, elevation, touch targets, fonts, and motion.

Public imports are limited to `@internal-ds/core`, `@internal-ds/base`, and `@internal-ds/fluent`, plus their documented stylesheets. Do not import demo pages, `DesignSystemContext`, component catalogues, or other showcase modules into application runtime code.

### 5. Review and pin an update

From the consuming application's repository root:

```sh
NEXT_UI_REF="<candidate-commit-or-tag>"
git -C vendor/design-system fetch origin --tags
git -C vendor/design-system log --oneline "HEAD..$NEXT_UI_REF"
git -C vendor/design-system diff "HEAD..$NEXT_UI_REF" -- src/design-system package.json
git -C vendor/design-system checkout --detach "$NEXT_UI_REF"
```

Update the application's dependency ranges and lockfile if the candidate requires it, then run its type checks, tests, production build, and relevant browser checks. After verification, stage the reviewed pointer:

```sh
git add vendor/design-system
```

Commit that pointer together with any dependency changes through application review. CI should initialize the **recorded** pointer with `git submodule update --init --recursive`; do not use `--remote` to fetch an unreviewed latest version during builds. To roll back, restore the earlier application commit's pointer and matching lockfile, then run the initialization command again.

Make centrally shared changes in this repository and distribute them through reviewed pins. Compose app-specific additions with local wrappers and supported props. See [the full consumer guide](docs/consuming-design-system.md) and [agent composition recipes](docs/agent-ui-composition.md) for more detail.

## Requirements

- [Bun](https://bun.sh/) (the repository includes `bun.lock`)

## Initialize and run

From the repository root:

```sh
bun install
bun run dev
```

Vite serves the app at <http://localhost:3000>.

## Other commands

```sh
bun run build    # Build the production app into dist/
bun run build:consumer # Build the independent public-source consumer smoke app
bun run preview  # Preview the production build
bun run lint     # Type-check the project
bun run test     # Run the test suite
bun run clean    # Remove generated build output
```
