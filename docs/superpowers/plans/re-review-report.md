# Scoped re-review — I1, I2, I3, I4 and M1

**Verdict: all five findings ADDRESSED. No concrete new breakage identified from these fixes.**

This closes the findings from `review-report.md` within the requested remediation scope. This is a scoped re-review, not a new whole-system audit.

## Scope and verification basis

Read `docs/superpowers/plans/fix-report.md` and the current Base wrappers, component CSS/tests, TextFieldDemo, SliderDemo, showcase CSS, core static CSS/public-entry tests, and consumer fixture. No separate `badgeContrast.test.ts` is present; badge coverage is included in `src/design-system/base/components.test.tsx:157–180`.

Accepted the recorded post-fix verification in `fix-report.md:15–27`: lint passed, all 51 tests in 10 files passed, showcase and consumer builds passed, and Chromium measured the plain slider root/control/track at 240px with pointer input changing 50 to 88. Chromium also verified all five closed showcase accordion triggers were focus-visible with `outline-offset: -2px` inside their clipping roots. No tests, builds or browser checks were repeated for this re-review.

## Finding verdicts

### I1 — Field.Error primitive behavior: ADDRESSED

- `src/design-system/base/components.tsx:190–196` now wraps `FieldPrimitive.Error`, rather than Description. The existing typed forwarding helper (`:43–55`) consequently preserves the actual Error props, render/state callbacks and `HTMLDivElement` ref type.
- `src/components/BaseUIDesignSystem/demos/TextFieldDemo.tsx:25–28,69–72` uses `match={true}` for the externally controlled errors, preserving their visibility while leaving native validity matching available to consumers.
- `src/design-system/base/components.test.tsx:72–120` covers a valid custom-error match remaining absent, an invalid match displaying generated validation text, message association through `aria-describedby`, the div ref, and forced external visibility.

The wrong primitive/API and unconditional-error defect are resolved. No concrete new demo or public-API breakage found in this change.

### I2 — Slider depends on showcase layout: ADDRESSED

- `src/design-system/base/components.tsx:102–109` now styles Slider.Control through the same forwarding helper as the other compound parts.
- `src/design-system/base/components.module.css:240–244` supplies Control's required flex layout, growth, centering and full width alongside the existing Root/Track styling.
- `src/components/BaseUIDesignSystem/demos/SliderDemo.tsx:53–58,88–93,127–133,157–162` removes the structural utility classes from all four compositions. The disabled demo retains only disabled presentation classes.
- `fixtures/consumer/main.tsx:14–21` includes a plain compound slider without showcase classes. `components.test.tsx:122–146` checks the runtime class and declarations; the recorded Chromium 240px measurement and 50-to-88 pointer change supply the real layout/interaction evidence beyond those static assertions.

Essential horizontal slider layout now belongs to the runtime boundary. No concrete new breakage found in the fixes.

### I3 — Accordion focus ring clipping: ADDRESSED

- `src/design-system/base/components.module.css:295–299` retains root clipping and restores the trigger-specific inset focus offset.
- The narrowly targeted rule at `:383–384` also sets the inset outside the cascade layer, allowing it to beat the showcase's unlayered global focus-offset rule. It targets the module-scoped accordion trigger and changes only the offset, rather than globally changing focus styles.
- `src/design-system/base/components.test.tsx:148–155` checks that the inset override is outside the layer. The recorded Chromium check verifies the effective offset on all five closed showcase triggers.

The effective focus treatment is now inset in the previously failing integration, resolving the clipping defect. No concrete new breakage identified from this targeted correction.

### I4 — Showcase badge contrast: ADDRESSED

- `src/components/BaseUIDesignSystem/demos/BaseUIDemos.module.css:58–66`, specifically line 63, restores `--ds-brand-ink` as the badge foreground.
- `src/design-system/base/components.module.css:4–5,28–30` provides the normal and darker Brutalist ink derivations within the runtime stylesheet, preserving the direction of the runtime/showcase dependency boundary.
- `src/design-system/base/components.test.tsx:157–180` checks the restored selector/token contract and light/dark contrast cases. The remediation report records approximately 5.72:1 for Brutalist and 7.22:1 for Obsidian using the existing color helper; these are reported calculated values, not new browser measurements by this reviewer.

The newly introduced raw hazard-yellow foreground is removed and the original preset-aware ink treatment restored. No concrete new breakage found.

### M1 — Static core layer order: ADDRESSED

- `src/design-system/core/theme.css:1` now establishes `@layer theme, base, components, utilities;` before its token layer.
- `src/design-system/core/index.test.ts:34–38` asserts that this is the static public entry's first declaration. Existing enterprise-default coverage remains at `:25–32`.

Core-only/static consumers now receive the complete intended order without requiring Base or Fluent CSS to establish it. No concrete new breakage found.

## Disposition

**Approve the remediation of I1, I2, I3, I4 and M1.** No remaining blocker was identified within this scoped re-review. No implementation files were edited, no subagents were used, and no commits or pushes were performed.
