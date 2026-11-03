# Remediation report — review findings I1–I4 and M1

Addressed the findings in `docs/superpowers/plans/review-report.md` within the requested Base runtime/demo/test, core CSS/test, and consumer fixture scope.

## Fixes

- **I1 — `Field.Error`:** `src/design-system/base/components.tsx` now styles `FieldPrimitive.Error`, preserving upstream validity matching, generated messages, the `match` prop, and its `HTMLDivElement` ref. Externally validated fields in `TextFieldDemo.tsx` use the upstream-supported `match={true}` visibility override. The regression covers a valid matching field, an invalid custom-error match, generated text, `aria-describedby` association, the div ref, and externally forced visibility.
- **I2 — slider layout:** Base now styles `Slider.Control` with flex layout, growth, centering, and full width in `components.module.css`. The slider demos no longer supply the structural `flex items-center w-full` classes. The no-Tailwind consumer fixture now includes an unadorned compound slider.
- **I3 — accordion focus:** Accordion triggers retain a `-2px` inset focus offset. A narrowly scoped unlayered override preserves that inset against the app’s unlayered global `:focus-visible` rule, which otherwise wins over layered Base component styles. The regression checks the clipped root and override declaration.
- **I4 — badge contrast:** Showcase badges now inherit `--ds-brand-ink`, without importing runtime CSS from the showcase stylesheet. The Base runtime token remains preset-aware, including its darker Brutalist derivation. Regression checks verify the token declarations and at least 4.5:1 contrast for Brutalist and Obsidian; computed using the existing contrast helper, the ratios are approximately **5.72:1** and **7.22:1**.
- **M1 — static layer order:** `core/theme.css` now begins with `@layer theme, base, components, utilities;`. The core CSS test asserts this public static-entry prelude.

## Verification

Final checks after the last source change:

| Check | Result |
| --- | --- |
| `rtk bun run lint` | Passed (`tsc --noEmit`) |
| `rtk bun run test` | Passed — 10 test files, 51 tests |
| `rtk bun run build` | Passed |
| `rtk bun run build:consumer` | Passed |

Chromium headless (`/snap/bin/chromium`, version 156.0.8078.47) exercised both layout and focus in a real browser:

- The no-Tailwind fixture rendered a 240px slider root, control, and track. The control computed to `display: flex`, `align-items: center`, and `flex: 1 1 0%`. A pointer click at 88% of the control changed the range input from **50** to **88**.
- In the app’s closed accordion demo, all five triggers matched `:focus-visible`, computed `outline-offset: -2px`, and remained within their clipped accordion roots. This verified the final unlayered override against the app’s global focus rule.

The builds report the existing large-chunk advisory, and Vite reports its `__dirname` config-loader advisory during app checks; neither check failed. Temporary preview servers and the headless Chromium process started for these checks were stopped afterward.
