# Task workspace implementation brief

The human approved a bounded showcase addition: equivalent Task workspace pages for Base and Fluent covering all 18 families with meaningful states, a task Edit popover matching their reference, and agent composition guidance. No commits/pushes. Edit in place. Do not spawn subagents or change provider configuration. Other workers and the coordinator are editing disjoint files. Do not modify runtime components unless you report a concrete blocker first.

## Ownership

- Base worker owns only `src/components/TaskWorkspace/BaseTaskWorkspace.tsx` and `BaseTaskWorkspace.test.tsx`.
- Fluent worker owns only `src/components/TaskWorkspace/FluentTaskWorkspace.tsx` and `FluentTaskWorkspace.test.tsx`.
- Coordinator owns shared model, icons, CSS, navigation/view integration, and docs. You may request missing shared styles in your report rather than overwrite the stylesheet.

## Shared interfaces (read these files first)

- `workspaceModel.ts`: `WorkspaceTask`, `TaskDraft`, `INITIAL_TASKS`, `TASK_LISTS`, `createTaskDraft(task)`, `validateTaskDraft(draft): string`, `saveTaskDraft(tasks,id,draft)`, `formatTaskDate(date)`, `formatTaskTime(time)`.
- `TaskWorkspace.module.css`: named classes for the shared layout/editor. Import it as `styles`.
- `WorkspaceIcon.tsx`: `WorkspaceIcon({name,size?})`; names edit, clock, deadline, description, list, close, plus, more, check, star, chevron, calendar.
- Public primitives: Base from `../../design-system/base`; Fluent from `../../design-system/fluent`. Theme/provider already wrap the showcase, so do NOT mount another ThemeProvider/FluentProvider inside the page. Use `useState` for page-local state. Shared model types do not include effort; own settings local state.

## Exports and composition

Export `BaseTaskWorkspace` or `FluentTaskWorkspace` as a named React component, no required props. Render a root `styles.workspace` with `data-workspace="base"` or `"fluent"`. Use all component APIs from your own system; no runtime component reimplementation through raw buttons/inputs except native textarea/date/time controls inside labelled fields where necessary.

Use a unified productive task-workspace layout: breadcrumb Workspace / Product launch; title Product launch; subtitle Tuesday, November 3 · 6 tasks · 2 completed; header New task and secondary Share/Sync action. Primary area tasks with Tasks/Activity tabs, All/Active/Completed filter chips, search, and task rows. Side column contains real project settings/progress/disclosures. Keep UI compact and credible, do not turn it into 18 unrelated demo cards or add marketing prose. All 18 families should be discoverable in this page; show secondary states/variants where meaningful, not every possible combination.

### Component coverage

- Buttons: primary New task/Save, secondary Edit, subtle Cancel, disabled optional action, destructive dialog action.
- Icon buttons: task pin toggle and more actions with accessible names; disabled action where sensible.
- Chips/tags: interactive All/Active/Completed, removable active filter or selection tag.
- Lists: task rows with headline/meta/check/edit actions; compact Activity list as second list variant.
- Text fields: search outlined, a filled project-name/list field, validation on user input.
- Select/dropdown: list selection in editor, project owner/team selection.
- Checkbox: checked/unchecked tasks and indeterminate Select all computed from visible task state; never hardcode an unrelated state.
- Switch: notification and autosave preference toggles plus one disabled organizational preference.
- Radio group: normal/high/low effort or priority setting, include one disabled choice only if labelled as unavailable.
- Slider: interactive weekly focus budget with visible current value; optional disabled secondary setting.
- Progress: completion percentage updates from tasks; sync action may show real temporary indeterminate state.
- Tabs: Tasks and Activity content, wired correctly for accessibility (Fluent TabList needs explicit tab panels).
- Tooltip: labelled pin/more icon controls have hints that work on focus and hover.
- Menu: row More menu with toggle pin and Delete task; disabled unavailable action if useful.
- Dialog: confirmation before deletion, Cancel retains task, destructive confirm removes it.
- Accordion: About this project/Workflow guidance with two meaningful items; initial closed/open states.
- Collapsible: Advanced settings reveals extra preference controls.
- Popover: each Edit opens reference editor, save/cancel semantics below. Do not rely on hover to open it.

Add `data-component` markers to real component regions using IDs: switch, popover, dialog, slider, checkbox, tabs, tooltip, accordion, menu, progress, radio, collapsible, buttons, chips, icon-buttons, lists, select, text-field. A marker alone is not a substitute for using a family. Closed overlays can be marked on their trigger/region. Sidebar lists count remains 18; page is a separate navigation entry.

## Reference editor

Popover width ~448px, pale token-derived surface, 28px radius, subtle border/shadow; no arrow; close X top-right. Use `styles.editorPopup` on actual popup/surface, not outer root. Title field underlined, 22px, offset to align with row text. Vertical rows: clock + date/time and outlined pill Add end time, helper Does not repeat; target icon + Add deadline (reveals date field); description icon + Add description or a Google Drive attachment (reveals textarea; do not fake an upload/integration); list icon + filled list dropdown with accent underline; bottom-right pill Save. Default first task is `mv` on Tuesday November 3 2026 at 10:30am in jurokapsiar's list, matching the reference content.

Date/time are editable via accessible labelled native date/time inputs revealed by a Change schedule button or inline compact controls. Add end time inserts a labelled input and may be removed. Deadline and description are editable. List selects from TASK_LISTS. Draft initialized fresh on each Edit. Controlled popover open state must discard draft on X/Escape/outside dismissal; Save validates title/end time, updates real task title/description/date/time/deadline/list, announces success in role=status, closes and returns focus. Cancel reopening restores committed values. Do not write task state on every keystroke. New task creates a local task and opens editor; preferably avoid retaining empty new tasks on cancel.

Keep popup scrollable and collision-aware; minimum viewport 360px. On small screens fields stack and no horizontal overflow. Respect active theme and inherited fonts. Inline styles only for state-derived values, not duplicated color/geometry styling.

## Verification/report

Use meaningful tests for page filtering/completion/editor draft/save/cancel and component coverage. Prefer real primitives; do not mock the entire UI library. Initial missing page is expected test failure. Run focused tests/typecheck when dependencies exist; other worker changes may be incomplete. Do not fix other worker files. Coordinator performs full integrated checks and browser testing. Report implementation, files, checks, remaining concerns, and needed shared CSS to `/tmp/opencode/workspace-base-report.md` or `/tmp/opencode/workspace-fluent-report.md`. User already approved: continue without approval questions. Use apply_patch and rtk where supported.
