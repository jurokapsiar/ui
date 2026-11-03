# Consume the design system through pinned Git updates

This repository is the central source and showcase. Applications compile the public TypeScript and CSS Module source directly; no internal package publication or prebuilt library is required.

## 1. Add the central repository

Run these commands in the consuming application's repository:

```sh
git submodule add https://github.com/jurokapsiar/ui.git vendor/design-system
git -C vendor/design-system checkout <reviewed-commit-or-tag>
```

The application's Git submodule entry records the exact central commit. Commit that pointer in the application as part of its normal review process. Do not run `bun install` inside the submodule: dependencies belong to the consuming application.

On a fresh clone or in CI:

```sh
git submodule update --init --recursive
```

The central repository includes showcase code, but applications import only `vendor/design-system/src/design-system/` public entry points. It is not necessary to build or serve the showcase.

## 2. Install consumer dependencies

The current compatible dependency ranges are:

| Dependency | Version | Required by |
| --- | --- | --- |
| `react` | `^19.0.1` | Core and both component systems |
| `react-dom` | `^19.0.1` | Rendering and portals |
| `@base-ui-components/react` | `^1.0.0-rc.0` | Base components |
| `@fluentui/react-headless-components-preview` | `0.3.2` | Fluent components |
| `@fluentui/react-icons` | `^2.0.345` | Fluent component icons |

For an application using both systems:

```sh
bun add 'react@^19.0.1' 'react-dom@^19.0.1' '@base-ui-components/react@^1.0.0-rc.0' '@fluentui/react-headless-components-preview@0.3.2' '@fluentui/react-icons@^2.0.345'
```

Retain the application's lockfile. Review dependency changes alongside central-source updates, especially the pinned Fluent preview dependency. Applications need a React/TypeScript-capable bundler with CSS Modules, CSS imports, and modern CSS support (cascade layers, OKLCH and `color-mix`). The component runtime does not require Tailwind or the showcase's Phosphor icons.

## 3. Configure source imports

For a Vite application, merge this into its existing configuration:

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@internal-ds': fileURLToPath(new URL('./vendor/design-system/src/design-system', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
});
```

Add the matching paths to the application's TypeScript configuration:

```json
{
  "compilerOptions": {
    "paths": {
      "@internal-ds/*": ["./vendor/design-system/src/design-system/*"]
    }
  }
}
```

Keep existing path mappings. The build must transform the imported source and CSS Modules, rather than treat this subtree as an already-built dependency. Keep one React installation and do not bring the central repository's `node_modules` into the consumer.

## 4. Compose the runtime

```tsx
import { ThemeProvider } from '@internal-ds/core';
import { Button as BaseButton } from '@internal-ds/base';
import { Button as FluentButton, FluentProvider } from '@internal-ds/fluent';

export function App() {
  return (
    <ThemeProvider>
      <BaseButton>Base action</BaseButton>
      <FluentProvider>
        <FluentButton appearance="primary">Fluent action</FluentButton>
      </FluentProvider>
    </ThemeProvider>
  );
}
```

Public runtime entries are `core`, `base`, and `fluent`. Do not import `DesignSystemContext`, component lists, demo files or `src/index.css` from an application. Those belong to the showcase.

The providers load their runtime stylesheet setup; component modules load their CSS Modules. The core default stylesheet is also available at `@internal-ds/core/theme.css` for static token use. Use `useTheme` inside `ThemeProvider` to select presets, patch tokens and reset changes. Base and Fluent APIs remain separate; alias conflicting names at the import site.

Use one document-wide `ThemeProvider`. Its token variables are applied to the document root so portaled overlays inherit the active theme. Independently scoped concurrent themes are not supported by this integration. The runtime restores previously present root token values when the theme owner unmounts. Runtime modules support server import/render; your framework must support their stylesheet imports and emit the default CSS for the initial render.

The cascade order is `theme, base, components, utilities`. If your app uses Tailwind, declare the same order before app styles. Utilities intentionally take priority over layered component styles. App-wide resets and font assets remain the application's responsibility; the runtime declares font families but does not download fonts.

## 5. Review and pin an update

Run these commands in the consuming application:

```sh
git -C vendor/design-system fetch origin --tags
git -C vendor/design-system log --oneline HEAD..<candidate-commit-or-tag>
git -C vendor/design-system diff HEAD..<candidate-commit-or-tag> -- src/design-system package.json
git -C vendor/design-system checkout <candidate-commit-or-tag>
```

Run the application's type checks, tests and production build. Review the submodule pointer and lockfile changes together before committing the update in the application. CI should use `git submodule update --init --recursive`, not `--remote`, so it reproduces the reviewed pointer. Rollback consists of restoring the earlier submodule pointer and matching lockfile.

Make shared component changes in the central repository and distribute them through new pinned updates. Application-specific behavior should be composed with local wrappers and supported props, rather than edits inside the application's submodule checkout.

## Maintainer verification

From this central repository:

```sh
bun run lint
bun run test
bun run build
bun run build:consumer
```

`fixtures/consumer` exercises the public entries with a separate Vite configuration and no showcase CSS or Tailwind plugin. Its output is `dist/consumer-smoke/`.
