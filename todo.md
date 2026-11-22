# Design system TODO: learnings from the wealth2 consumer app

Found while building `wealth2` against the vendored design system (`vendor/design-system`).

- [ ] **Remove layout defaults from base wrappers.** `tabsRoot` has `max-width: 460px` and `display: flex`; it silently narrowed whole screens and a chart. `radioGroupRoot` is a flex column, so category chips stacked full width. `radioRoot` is an 18px circle. Wrappers should set no max-width, and group direction or layout should be a prop or variant. Consumers currently need `!max-w-none` or `flex-direction: row` overrides.
- [ ] **Document specificity and layer order.** Tailwind utilities, CSS modules and the design system's `@layer components` compete, and overrides worked by luck. State the intended order. Prefer `data-variant` or props over class overrides.
- [ ] **Add a pill/chip toggle group component.** Three screens reused `Toggle` plus a hand-written `.chips`/`.chip` class. Provide `ToggleGroup` or `Chips` with the active pill built in. Note that moving from `Tabs` to toggles changes roles (`tab` to `button`, `aria-selected` to `aria-pressed`) and breaks tests.
- [ ] **Package the token pane for consumers.** `useTheme` already exposes live tokens, `updateTokens` and `resetTokens`. The pane depends on `useDesignSystem`, `Icons/phosphor`, `Tip` and `@phosphor-icons/core`, so porting meant copying six files and rewriting imports. Export `TokenPane` from `@internal-ds/base` with `open` and `onClose` props and a preset select inside.
- [ ] **Add page chrome components.** A sticky title strip with an overlapping first card needed global CSS (`.strip`, `.topBand`, `--strip-h`) in the app. Add `PageHeader` and `Card` that use the surface, border, radius and shadow tokens. The hand-written `.card` mixed `radius-base` and `radius-lg`.
- [ ] **Document the sticky-header pattern.** Wrapper groups defeat `position: sticky`; `display: contents` on the wrapper fixes it.
- [ ] **Ship a jsdom test-setup helper.** The token pane and scrolling need stubs for `matchMedia`, `scrollIntoView` and `scrollTo`.
- [ ] **Turn layout constants into tokens or measure them.** The strip height was a hand-tuned `--strip-h`; any taller header row breaks the overlap with the first card.
- [ ] **Add a consumer checklist.** The 460px cap and stacked chips only showed up in screenshots, and the design system's checks cover its own showcase, not consumer layouts. Check at 390px: full-width containers, chip row direction, touch targets.
