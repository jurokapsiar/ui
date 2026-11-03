# Compose interfaces with the internal design systems

## Start with a working page

Open **Task workspace** above the component list in the showcase. Switch between **Base UI** and **Fluent UI** to see the two compositions. Each page uses all 18 component families in a productive task interface; individual component demonstrations remain available for deeper variant exploration.

Use these source files as examples:

- `src/components/TaskWorkspace/BaseTaskWorkspace.tsx`
- `src/components/TaskWorkspace/FluentTaskWorkspace.tsx`
- `src/components/TaskWorkspace/TaskWorkspace.module.css`
- `src/components/TaskWorkspace/workspaceModel.ts`

The workspace is an in-memory demo. Task completion, filtering, draft editing, deletion, settings and progress run locally. Sync demonstrates an activity state; it does not contact a service. The attachment wording is informational, not a file-upload or Google Drive integration.

## 1. Choose one component system

Use the public source entries, rather than raw upstream imports or CSS copied from individual demos:

```tsx
import { ThemeProvider, useTheme } from '../design-system/core';
import * as Base from '../design-system/base';
// Or:
import * as Fluent from '../design-system/fluent';
```

Adapt relative paths to your file. External applications can use the `@internal-ds` alias from the [consumer guide](consuming-design-system.md).

Mount one document-wide `ThemeProvider` at the application boundary. Fluent interfaces additionally use `FluentProvider` beneath it. The showcase already mounts those providers; its demo pages must not nest new ones. Root tokens are deliberately available to portaled overlays. Load font assets at application level; component declarations do not download fonts.

## 2. Map intent to a component

| Intent / family | Base public API | Fluent public API | Workspace example / useful states |
| --- | --- | --- | --- |
| Buttons | `Button` | `Button` | New task, Edit, Save, Cancel, destructive delete, disabled action |
| Icon buttons | `IconButton`, `IconToggle` | `Button` with `icon`, `ToggleButton` | Pin/unpin, More, close; give every icon-only control an accessible name |
| Chips | `Toggle`, `ChipInput`, `ChipRemove` | `InteractionTag`, `InteractionTagPrimary`, `TagGroup`, `Tag` | Active/completed filters, selected and removable filter |
| Lists | `List`, `ListItem`, `ListText`, `ListHeadline`, `ListSupport` | `List`, `ListItem`, `ListRow` | Tasks with actions, compact activity list |
| Text field | `Field.Root/Label/Description/Error`, `Input` | `Field`, `Input` | Outlined search, filled project name, title/error |
| Select | `Select.Root/Trigger/Value/Portal/Positioner/Popup/Item` | `Dropdown`, `Option` | Project owner and task list |
| Checkbox | `Checkbox.Root/Indicator` | `Checkbox` | Task completion and derived mixed Select visible state |
| Switch | `Switch.Root/Thumb` | `Switch` | On/off local preferences, disabled administrator-managed preference |
| Radio | `RadioGroup`, `Radio.Root/Indicator` | `RadioGroup`, `Radio` | Low/normal/high planning defaults |
| Slider | `Slider.Root/Control/Track/Indicator/Thumb` | `Slider` | Stepped weekly focus budget with a visible numeric value |
| Progress | `Progress.Root/Track/Indicator` | `ProgressBar` | Completion derived from task state; activity/indeterminate state |
| Tabs | `Tabs.Root/List/Tab/Panel` | `TabList`, `Tab` plus labelled tabpanel elements | Tasks and Activity with keyboard navigation |
| Tooltip | `Tooltip.Provider/Root/Trigger/Portal/Positioner/Popup` | `Tooltip` | Pin and More hints on focus and hover |
| Menu | `Menu.Root/Trigger/Portal/Positioner/Popup/Item` | `Menu/Trigger/Popover/List/Item` exports | Row actions, Pin, Delete, unavailable actions |
| Dialog | `Dialog.Root/Portal/Backdrop/Popup/Title/Description/Close` | `Dialog`, `DialogSurface`, `DialogBody`, `DialogTitle`, `DialogActions` | Confirm deletion; Cancel retains data |
| Accordion | `Accordion.Root/Item/Header/Trigger/Panel` | `Accordion`, `AccordionItem`, `AccordionHeader`, `AccordionPanel` | Project context and workflow guidance |
| Collapsible | `Collapsible.Root/Trigger/Panel` | `Collapsible` | Advanced settings disclosure |
| Popover | `Popover.Root/Trigger/Portal/Positioner/Popup/Close` | `Popover`, `PopoverTrigger`, `PopoverSurface` | Draft task editor opened by Edit |

These are different APIs, not interchangeable names. Follow each public component's TypeScript props and working composition.

### Lists with interactive controls

In Base, use native list semantics and ordinary labelled controls in each row. Do not put a row-wide button around other buttons or inputs.

In Fluent, `navigationMode="composite"` makes a grid. Its `ListItem` rows must have direct `role="gridcell"` children containing the relevant focus targets. An ordinary activity list does not need composite navigation. Do not add `role="grid"` to a plain list to silence a mismatch. Inspect the actual DOM and use the library's supported navigation mode.

### Trigger composition

Use the real Menu/Popover trigger so the library receives its reference, anchor, keyboard behavior and ARIA relationship. A manual click handler on an unrelated icon button is not a substitute. When wrapping a trigger with Tooltip, keep one DOM button and forward its props/ref through the supported `render` or child composition.

## 3. Use an explicit emphasis vocabulary

| Intent | Base | Fluent |
| --- | --- | --- |
| Primary action | `data-variant="filled"` | `appearance="primary"` |
| Secondary outlined action | `data-variant="outlined"` | `appearance="outline"` |
| Quiet / tertiary action | `data-variant="text"` | `appearance="subtle"` |
| Tonal selection/action | `data-variant="tonal"` | `appearance="tonal"` |
| Destructive action | `data-variant="danger"` | `appearance="danger"` |
| Filled field | `data-variant="filled"` on `Input` | `appearance="filled"` on `Input` |
| Disabled | `disabled` | `disabled` |

Reserve the filled accent for the main action within a region: New task on the page, Save in the editor. Use quiet actions for secondary rows and Cancel. A destructive action belongs in the confirmation dialog, with text explaining what will change. Show disabled controls only when their unavailable state has a reason.

Component variants are separate from page layout. A page-level class should adjust width/alignment/padding when needed, while the component's variant selects its emphasis and state styling.

**Theme tokens take precedence over reference-image styling.** Do not turn every theme's buttons into pills to match an image. Use `--radius-control` with the system's base-radius fallback: Substance supplies `9999px`, Enterprise supplies a small corner, and Brutalist supplies square corners. The same rule applies to popup/field radii, border width, elevation, spacing, touch targets, label weight/tracking, fonts and motion. Keep the composition from the reference while allowing its visual treatment to follow the selected preset and live token edits.

## 4. Rationalize styles with shared tokens

Use a small, predictable layout vocabulary:

- **Canvas and cards:** `--color-neutral-bg`, `--color-neutral-surface`, and `--color-neutral-border` define surfaces; borders establish grouping before shadows.
- **Text hierarchy:** `--color-neutral-text` for headings/body, `--color-neutral-text-muted` for metadata. Keep labels visible and supporting copy subordinate without making it illegible.
- **Accent:** `--color-brand-primary`, `--color-on-primary`, and `--color-brand-tint` define primary actions and soft emphasis. Use the component's derived ink token for small brand-colored text where raw primary has insufficient contrast.
- **Geometry:** use spacing/radius/touch-target tokens for controls. Page-specific structure can use a shared 8px rhythm, 16–24px card padding, 20–24px section gaps, and a responsive two-column grid. Those are layout decisions, not a new token system.
- **Typography:** inherit `--font-family-body`; page titles are about 28–34px, region titles 14–16px, controls/body 13–14px, metadata 11–12px. Avoid introducing another font to distinguish a section.
- **Focus and motion:** preserve upstream focus behavior and the internal focus-ring styling. Do not reset `outline` without replacing it. Honor reduced-motion preferences and avoid gratuitous transitions.

CSS Modules keep page styles local. Prefer logical sizing/spacing (`inline-size`, `padding-inline`) for new layout rules. Avoid scattered inline color/radius declarations; use classes and tokens. Inline values are appropriate for state-derived progress percentages.

### Style the painted slot

Base compound parts generally paint on the element you style (`Select.Trigger`, `Popover.Popup`). Fluent components may paint on nested slots: an `Input` has a root and input, and a `Dropdown` has a button slot. Assign the custom class to the actual root/slot that owns the border/background. Styling only a surrounding Field leaves the nested default border visible. Use public slot props or scoped selectors tied to the working example; do not target generated CSS hash names.

## 5. Compose the task editor

The reference editor is an overlay composition, not a new UI primitive:

1. **Popover trigger:** a visible Edit button with an accessible task-specific name.
2. **Popup surface:** ~448px wide with viewport-bounded vertical scrolling. Use the neutral-surface/brand-tint, large-radius, border-width and high-elevation tokens; Substance's large radius is 28px, but other presets keep their own shape. Padding and row gaps come from the spacing tokens.
3. **Close:** one top-right icon button with an accessible name and the configured minimum touch target. Let its theme define shape, hover and focus treatment.
4. **Title:** unboxed underlined 22px input, offset to align with the row content. Use the display-font token for its font family and token-driven stroke/focus colors. Its label may be visually hidden but must remain accessible.
5. **Schedule row:** clock icon, textual date/time and outlined Add end time action. Its radius and touch target follow the theme; only a pill-shaped control token makes it a pill. Reveal labelled date/time controls when editing the schedule.
6. **Deadline / description rows:** disclosure actions reveal editable controls. Attachment wording stays informational unless an actual integration exists.
7. **List row:** filled select/dropdown with an accent underline on the painted trigger slot. Use the field-radius token, neutral-surface-hover token and configured border width, rather than hardcoded corners or stroke.
8. **Footer:** quiet Cancel and primary Save with the configured control radius, label weight/tracking, spacing, minimum touch target and motion. Substance renders Save fully rounded; other presets retain their own corners.

Keep the editor's structure in its own function/component and its style rules in one CSS module. Desktop and narrow-screen layout should use the same form, not divergent copies.

### Draft lifecycle

The working model separates editable fields from task completion/pin/priority:

```ts
import { createTaskDraft, saveTaskDraft, validateTaskDraft } from './workspaceModel';

// Opening Edit:
const freshDraft = createTaskDraft(committedTask);

// Saving:
const error = validateTaskDraft(draft);
if (!error) {
  const nextTasks = saveTaskDraft(tasks, committedTask.id, draft);
  // Commit nextTasks, announce success, close, and return focus to Edit.
}
```

For page state, store `tasks`, an editor target id, a separate `draft`, and validation state. Opening initializes a fresh draft. Typing updates only that draft. Save validates a nonblank title and end time after start time; an error names and describes the relevant input. X, Cancel, Escape and outside dismissal discard the draft. A new task stays outside committed rows/counts until Save. Unrelated completion/pin changes are preserved by `saveTaskDraft`.

Do not enable task autosave that contradicts explicit Save/Cancel behavior. Preference demos should affect real local state and their labels should accurately describe it.

### Native overlays and composite lists

The Fluent headless Popover can render a native modal dialog when `trapFocus` is enabled. Native modal dismissal and focus behavior differ from a nonmodal auto-popover. Use the working editor's light-dismiss composition for this reference, and name its surface. Render its surface outside a composite task row's DOM/navigation boundary so row handlers do not steal editor Tab/Escape. A React portal retains context but also bubbles React events; isolate editor keyboard events from row navigation where needed without preventing the native dismissal default.

Base uses its public portal/positioner and collision padding. On either system, nested dropdowns must remain usable without being mistaken for an outside click. Never repair positioning by hardcoding document coordinates.

## 6. Verify a composed page

State/unit checks and real-browser checks have different jobs:

- Verify search/filtering, mixed selection, progress and pin state from real task data.
- Edit → type → Cancel → reopen must restore committed values. Edit → Save must update the row and close. Blank title or invalid time must keep the editor open and associate its error correctly.
- New task must show exactly one editor and leave rows/counts unchanged on cancellation.
- Delete → Cancel retains a task; confirm removes it.
- Inspect real list/grid/tabpanel/dialog roles and accessible names, not just coverage markers.
- Use keyboard Tab/Shift+Tab/Escape, ArrowDown menu opening, and dropdown selection in a real browser. Check focus return and menu anchoring.
- At 360–390px, check page overflow, popup bounds, expanded schedule/description scrolling and unobscured Save.
- Compare actual screenshots across both systems and theme presets. A passing build does not prove slot styling matches the reference.

Run `bun run lint`, `bun run test`, `bun run build`, and `bun run build:consumer` before handing over a change. The reusable runtime must remain independent of these showcase modules.

### Browser regression for theme tokens

With the showcase dev server running, use:

```sh
bun run test:theme-browser
```

This checks both editors under Enterprise, Substance, Brutalist and Obsidian, then changes live tokens while each editor is open. Assertions cover actual painted control/surface/field radii, borders, colors, shadows, spacing, touch targets, fonts, label weight/tracking, focus/error states and reduced motion. It exercises revealed date/time/deadline fields as well as the default editor.

The script uses Node's built-in WebSocket support and a locally installed Chromium; it does not add an npm browser dependency. For another installation or server URL:

```sh
CHROMIUM_BIN=chromium APP_URL=http://127.0.0.1:3000 bun run test:theme-browser
```

Browser profiles and reports are written to the operating system's temporary directory. `WORKSPACE_THEME_REPORT` can specify a report path.
