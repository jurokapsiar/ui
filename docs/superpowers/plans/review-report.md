# Independent final review — pinned source design system

**Verdict: changes requested before distributing a reviewed pin.** The architecture and core/Fluent integration substantially meet the specification, but Base extraction has concrete public-API and standalone-rendering defects, plus accessibility regressions in the migrated showcase.

**Severity totals:** Critical: 0. Important: 4. Minor: 1.

## Scope and verification

Reviewed the design specification, implementation plan, all 4,421 lines of `/tmp/opencode/ui-pinned-review.diff`, and every new file under `src/design-system/core/`, `src/design-system/base/`, `fixtures/consumer/`, plus `FluentProvider.tsx`, its test, `sourceBoundary.test.ts`, and `docs/consuming-design-system.md`. Inspected existing Fluent setup/components and installed upstream implementations where relevant.

Accepted the coordinator's fresh verification: `bun run lint`, all 46 tests in 10 files, `bun run build`, and `bun run build:consumer` passed. Those checks were not repeated. Additional narrowly scoped investigation used Vite SSR module loading and React static rendering for the public Field, Slider and Fluent provider APIs, and the existing color conversion utility for badge contrast. The first inline investigation command had a parenthesis typo; the corrected command completed successfully. No implementation files were edited; no agents, commits or pushes were used.

The additional SSR probe demonstrated that Fluent setup renders on a server without `document`, a valid field incorrectly renders its error, and the plain slider control has no class or layout style. Layout/focus findings below are based on emitted DOM, CSS and upstream behavior; no browser pixel measurement was performed.

## Important findings

### I1 — `Field.Error` replaces the upstream validation component with `Field.Description`

**Evidence:** `src/design-system/base/components.tsx:190–196`, specifically line 195. The compound spread includes the real upstream Error, then overrides it with `styledPart(FieldPrimitive.Description, styles.fieldError)`.

**Defect:** Public `Field.Error` always renders a paragraph as a description. It loses upstream conditional validity matching, the `match` prop, generated validation messages, and the upstream `HTMLDivElement` ref type. Installed upstream `field/error/FieldError.d.ts:10–19` declares those props/ref; `FieldError.js:43–51,72–74` implements conditional rendering. This directly violates preservation of primitive props/ref typing and accessible upstream behavior.

**Concrete reproduction:** Static rendering of `<Field.Root><Input /><Field.Error>Required error</Field.Error></Field.Root>` with a valid field emitted `<p ... class="...fieldError...">Required error</p>`. The actual upstream Error would return null while valid. A real consumer cannot use `<Field.Error match="valueMissing">…</Field.Error>` with the intended API.

**Why current checks pass:** Migrated `TextFieldDemo.tsx:35–43,66–77` conditionally mounts the error itself, reproducing the old description-based demo behavior and concealing the broken public compound API. Base tests only exercise Button and Checkbox.

**Required correction:** Style `FieldPrimitive.Error`. Preserve the demos' external-validation behavior using the upstream supported visibility override where needed. Verify valid/invalid rendering, `match`, message association and the correct ref type.

### I2 — The styled Slider still needs showcase-only layout to have a usable track

**Evidence:** `src/design-system/base/components.tsx:102–109` exports `Control: SliderPrimitive.Control` unchanged. `components.module.css:240–243` gives Root a flex layout and 240px width, but gives Control no width/flex growth/display rules. All migrated slider demos supply `className="flex items-center w-full"` on Control (`src/components/BaseUIDesignSystem/demos/SliderDemo.tsx:54,88,127,155`).

**Defect:** With ordinary public compound composition and no Tailwind classes, Control is an auto-sized flex item. Track has no intrinsic width; its thumb is absolutely positioned, and its percentage-width indicator provides no useful intrinsic horizontal size. The Control can shrink to zero width, collapsing the track and pointer coordinate range. This is required component layout, not showcase page presentation.

**Concrete reproduction:** The public SSR composition `Slider.Root defaultValue={50}` → `Slider.Control` → `Slider.Track` → Indicator and Thumb emitted a Control `<div ... tabindex="-1">` with no class or inline layout. Thumb was absolutely positioned at 50%, while Root alone carried the fixed-width class. Installed upstream `slider/control/SliderControl.js:353–407` supplies handlers/state/tabIndex, not the missing styling; pointer calculations divide by the control's measured size (`:146–162`).

**Why current checks pass:** Showcase utility classes supply the missing layout; the no-Tailwind fixture renders only Base and Fluent buttons (`fixtures/consumer/main.tsx:13–15`). Import-closure tests cannot detect a layout dependence expressed through demo class names.

**Required correction:** Put the required Control layout in the reusable Base stylesheet/wrapper, preserving class/render overrides. Exercise a plain slider composition without showcase CSS or Tailwind, including a nonzero track and pointer interaction.

### I3 — Accordion extraction changes the inset focus ring to an outward ring that is clipped

**Evidence:** `src/design-system/base/components.module.css:125–144` includes `.accordionTrigger:focus-visible` in a shared rule with `outline-offset: 2px`. The accordion root still has `overflow: hidden` (`:294`), and its trigger fills the root width (`:297`). The previous tracked stylesheet explicitly used `outline-offset: -2px` for accordion triggers (review diff lines 897–900).

**Defect:** Keyboard focus outlines now extend beyond the trigger and are clipped at the root's left/right edges and at the first/last outer edges. With zero-margin headings, as in the showcase reset, a single closed item can lose the whole visible focus outline because its trigger fills the clipping container. Multi-item demos also lose the side/top portions of the intended ring. This is an accessibility regression, not an aesthetic objection.

**Why current checks pass:** No Base accordion keyboard/focus test or visual verification covers clipping; semantic interaction tests would not detect it.

**Required correction:** Retain the accordion-specific inset focus treatment, or otherwise guarantee a visible ring within the clipping boundary. Verify keyboard focus on a single closed item and the first/last items of a multi-item accordion.

### I4 — Migrated showcase badges regress to unreadable brand-colored text on the Brutalist preset

**Evidence:** `src/components/BaseUIDesignSystem/demos/BaseUIDemos.module.css:58–66` now uses `--color-brand-primary` for `.contractBadge` text on `--color-neutral-bg`. The previous rule used `--ds-brand-ink` (review diff lines 277–282). The reusable stylesheet intentionally retains the Brutalist darker ink derivation (`src/design-system/base/components.module.css:28–30`).

**Defect:** Selecting the supported Brutalist preset makes small badge text hazard yellow on a light background. Its foreground/background contrast is approximately **1.42:1**, calculated using the existing `contrastRatio` helper and the actual preset tokens (`core/themeTokens.ts:366,369`). This falls well below the 4.5:1 requirement for this small text and discards the previous preset-aware legibility correction.

**Why current checks pass:** Builds and token tests do not evaluate the changed showcase badge foreground/background pair.

**Required correction:** Restore the legible preset-aware ink token or an equivalent accessible foreground while preserving the original showcase presentation. Check the badge on Brutalist and the dark presets.

## Minor finding

### M1 — Static core CSS does not establish the documented complete layer order

**Evidence:** `src/design-system/core/theme.css:1` starts directly with `@layer theme {`; Base and Fluent styles establish `@layer theme, base, components, utilities`, but core-only/static consumers do not receive that declaration. `docs/consuming-design-system.md:97,101` exposes static CSS and describes the complete cascade order, while only specifically asking Tailwind applications to declare it.

**Impact:** A core-only consumer importing `theme.css`, then declaring utilities before base/component layers, fixes utilities earlier in the cascade. A later full-order statement cannot reorder already-created layers. The supplied both-system fixture is not affected because Base/Fluent also declare the order. This is a limited static-entry integration inconsistency rather than a current showcase blocker.

**Suggested correction:** Establish the complete order in the static public CSS as well, or document the required first declaration for all layered consumers.

## Task-by-task compliance and quality

| Task | Assessment | Evidence and qualifications |
| --- | --- | --- |
| 1 — Core runtime | Substantially compliant | `core/index.ts:1–10` exports the agreed runtime, token/preset types, conversions and serializers. Legacy files are compatibility re-exports. `ThemeProvider.tsx:22–54` preserves preset selection, patches and targeted/full reset; `:56–87` snapshots/restores inline values, CSS priorities and preset metadata and removes unset optional variables. No browser access occurs during import/render. `DesignSystemContext.tsx:21–56` composes runtime state with showcase selection/pane state. Static CSS covers enterprise required variables; tests cover defaults, reset, cleanup, server rendering and compatibility. M1 is the remaining static-layer inconsistency. |
| 2 — Base reusable components | Partially compliant; corrections required | All existing demo families migrate to the public entry, with runtime CSS separated from showcase layout. `styledPart` forwards refs, render callbacks and remaining props and combines both string/state-callback class names (`components.tsx:23–55`). Compound spreads retain many unused primitive parts, generic Roots are retained directly where needed, and native presentation tags remain thin wrappers. However I1 breaks a primitive API, I2 leaves essential layout in showcase classes, and I3/I4 regress accessibility. Representative Button/Checkbox tests are meaningful but too narrow to expose these defects. |
| 3 — Fluent public setup | Compliant for specified scope | `FluentProvider.tsx:1–24` imports runtime CSS, reads core touch-target sizing, supports explicit override and owns the upstream provider and reset-root wrapper. `fluent/index.ts:16–19` exports it and its props. The view uses public setup and retains editor/layout responsibility (`FluentDesignSystemView.tsx:46–60`). Existing Fluent component API separation is retained. Provider sizing tests cover inherited updates and explicit override; the additional public provider/Button SSR probe passed without a browser document. |
| 4 — Distribution integration | Mostly compliant; smoke coverage is limited | Documentation dependency ranges match `package.json:15–23`, including the exact Fluent preview pin. Alias and TypeScript path examples point at the runtime subtree; CSS Modules, stylesheet imports, modern CSS, React deduplication, consumer-owned dependencies, clone initialization, reviewed-pointer updates and rollback are described. Fixture config uses React/Vite without Tailwind, and public imports have no showcase modules. However its two-button composition misses I2 and does not exercise actual aliased/nested-vendor consumption. |
| 5 — Whole-change validation/review | Verification and independent review performed; remediation pending | Coordinator's four fresh required checks are reported passing. This report supplies the requested independent complete-diff/new-file review. Concrete findings still need correction and affected verification before the task's remediation requirement is fulfilled. |

## Integration assessment

- **Public source boundary:** Actual core/Base imports stay inside the runtime or reference declared upstream packages. Fluent's new provider depends only on core, size and its existing stylesheet/upstream provider. `sourceBoundary.test.ts:18–39` checks transitive relative imports, stylesheet imports and exclusion of showcase context/tests. No new dependency on showcase imports or Tailwind was found in runtime code.
- **Real-consumer dependency resolution:** For the documented `app/vendor/design-system/` placement without a submodule dependency installation, bare imports can resolve upward to `app/node_modules`; the Vite alias targets that nested source, and React/React DOM deduplication is explicitly set. The documented dependency list matches the runtime's upstream families. No definite resolution defect was found. The fixture's shared repository installation proves compilation/import isolation, not a fresh external application installation; it must not be described as stronger evidence than that.
- **CSS/default setup:** Enterprise defaults are imported by core through ThemeProvider before effects are needed; Base and Fluent import their own component CSS, and FluentProvider imports its base/reset CSS. The application remains responsible for app-wide resets and font assets as documented. Essential slider layout is still missing from the reusable boundary (I2), independently of that reset responsibility.
- **Document ownership, portals and cleanup:** Root-level tokens allow overlays to inherit the active theme. Snapshot/cleanup preserves prior inline priorities and metadata and removes variables that did not previously exist. Optional-token clearing avoids stale preset variables. The documented single-owner limitation matches implementation. No concrete cleanup/reset/SSR defect was found in the specified ownership model.
- **API/ref/render preservation:** The general Base wrapper delegates rendering and callback props without introducing extra DOM. Button's broad `HTMLElement` ref matches the installed upstream Button API. State class-name callbacks are resolved through a forwarding function; a `render` callback remains unchanged in forwarded props. The clear exception is Field.Error (I1). Existing Fluent wrappers were retained rather than redesigned.
- **Showcase preservation:** Demo content, controls, controlled state and most compound structure remain intact. Added presentation wrappers and variant data attributes generally replace the previous local classes. The extraction is not exact CSS preservation: I3/I4 are observable regressions. Additional non-blocking drift includes the removed fixed-width select checkmark container (`SelectDemo.tsx:46–51` versus now-unused `components.module.css:347`) and simplified Substance switch motion/hover styling. These are not elevated as separate runtime blockers.

## Recommended disposition

Correct I1–I4 before approving the centrally maintained pin; address M1 alongside the CSS corrections if practical. Run affected Field/Slider/accordion/accessibility checks, then the required project checks after implementation changes. Extend the standalone composition enough to cover the slider's required runtime layout. The current passing suite/builds remain valid evidence of compilation and tested paths, but do not override the reproduced public API defect or the identified CSS/accessibility defects.
