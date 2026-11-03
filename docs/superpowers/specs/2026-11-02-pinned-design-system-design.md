# Centrally maintained source design system

## Intent and execution constraints

Applications consume centrally maintained components through pinned Git updates, without publishing an internal npm package. The user requested parallel, in-place implementation using Azure Foundry `gpt-6-luna` and `gpt-6.1-sol`, and explicitly prohibited further commits. React and upstream Base UI/Fluent dependencies remain consumer-installed dependencies.

## Distribution boundary

This repository remains the central source repository and showcase. The reusable subtree is `src/design-system/`, with independent `core`, `base`, and `fluent` source entry points. Consumers add this repository as a submodule at a pinned commit, compile its source with their bundler, and install compatible upstream dependencies in their own application. No installed dependency tree or showcase code is part of the runtime contract.

## Shared runtime

Move token definitions, presets, conversion utilities and exporters into `core`, preserving compatibility exports at their old paths for showcase callers. Export a `ThemeProvider`, `useTheme`, and static default token CSS. The runtime owns token state only; showcase component selection, pane persistence and navigation remain in the showcase context. Preserve preset selection, patching and reset behavior. Root-level token application supports portals, must restore prior values on teardown, and must be safe to import/render on a server. Document one document-wide theme owner; independently scoped concurrent themes are outside this change.

## Base UI

Extract styled, reusable wrappers into `base`, using existing demo styling and primitives rather than introducing another library or redesign. Expose the compound APIs required by the showcase, along with button/form and simpler component wrappers. Migrate demonstrations to exercise the exported wrappers. Keep presentation/layout CSS in the showcase and runtime CSS under the reusable subtree. Do not collapse Base and Fluent APIs into an artificial interchangeable abstraction.

## Fluent UI

Retain the existing wrapped components. Add a public `FluentProvider` encapsulating the headless provider, root reset scope, sizing context and base stylesheet. Consumers compose it inside `ThemeProvider`. Migrate the showcase view to this public setup, leaving showcase layout and editor behavior in the view.

## Integration and validation

Document exact dependency requirements, source aliases, CSS Modules and stylesheet setup, clone initialization, pinned update review and React deduplication. Provide a consumer smoke fixture that imports only public runtime entries and can be built independently from showcase modules. Verify type checking, existing and new meaningful runtime tests, showcase production build, and isolated consumer build. Review the complete diff with `gpt-6.1-sol` and address concrete findings. Do not commit, push, add a fake submodule to this repository, or alter upstream provider configuration.
