# Task 2 — Base reusable components

## Result

Implemented the public Base source entry at `src/design-system/base/index.ts`, exporting styled wrappers for the existing Base showcase component set. The runtime wrappers forward primitive props and refs, merge consumer `className` values with their default CSS-module classes, retain named compound parts, and import styles only from `src/design-system/base/components.module.css`. The public entry includes `Button` for the consumer fixture.

Migrated all Base showcase demos to the reusable wrappers. `BaseUIDemos.module.css` now contains showcase page/card layout styling only; component styling lives in the Base runtime stylesheet.

## Files

- `src/design-system/base/index.ts`
- `src/design-system/base/components.tsx`
- `src/design-system/base/components.module.css`
- `src/design-system/base/components.test.tsx`
- `src/components/BaseUIDesignSystem/demos/BaseUIDemos.module.css`
- `src/components/BaseUIDesignSystem/demos/AccordionDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/ButtonsDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/CheckboxDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/ChipsDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/CollapsibleDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/DialogDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/IconButtonsDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/ListsDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/MenuDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/PopoverDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/ProgressDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/RadioDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/SelectDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/SliderDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/SwitchDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/TabsDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/TextFieldDemo.tsx`
- `src/components/BaseUIDesignSystem/demos/TooltipDemo.tsx`

## Verification

- `rtk bun run lint` — passed (`tsc --noEmit`).
- `rtk bun run test` — passed: 10 test files, 46 tests.
- `rtk bun run test -- src/design-system/base/components.test.tsx src/design-system/sourceBoundary.test.ts` — passed: 2 files, 5 tests, including the Base consumer import boundary.
- `rtk bun run build:consumer` — passed; fixture built with the public `Base.Button` import.
- `rtk bun run build` — passed.
- `rtk git diff --check -- src/design-system/base src/components/BaseUIDesignSystem` — passed.
- The new representative tests verify Button native props, refs, custom class merging and click behavior, plus styled Checkbox compound rendering and checked-state interaction. The test first failed because the public Base entry was absent, then passed after implementation.

## Concerns

No Task 2 issues remain. Builds report the repository's existing Vite `__dirname` config warning and a non-blocking bundle-size warning; both builds exit successfully.
