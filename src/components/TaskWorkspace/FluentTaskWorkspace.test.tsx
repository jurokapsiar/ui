// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FluentProvider } from '../../design-system/fluent';
import { ThemeProvider } from '../../design-system/core';
import { FluentTaskWorkspace } from './FluentTaskWorkspace';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => {
    root.render(
      <ThemeProvider>
        <FluentProvider>
          <FluentTaskWorkspace />
        </FluentProvider>
      </ThemeProvider>,
    );
  });
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const click = (element: Element | null) => {
  expect(element).not.toBeNull();
  act(() => (element as HTMLElement).click());
};

const button = (name: string): HTMLButtonElement | null =>
  [...document.querySelectorAll('button')].find((candidate) =>
    candidate.getAttribute('aria-label') === name || candidate.textContent?.trim() === name,
  ) ?? null;

const replaceInputValue = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

describe('FluentTaskWorkspace', () => {
  it('renders all 18 Fluent families as real workspace regions', () => {
    expect(host.querySelector('[data-workspace="fluent"]')).not.toBeNull();
    const covered = new Set([...host.querySelectorAll('[data-component]')].map((node) => node.getAttribute('data-component')));
    expect(covered).toEqual(new Set([
      'switch', 'popover', 'dialog', 'slider', 'checkbox', 'tabs', 'tooltip', 'accordion', 'menu', 'progress',
      'radio', 'collapsible', 'buttons', 'chips', 'icon-buttons', 'lists', 'select', 'text-field',
    ]));
  });

  it('filters tasks and recalculates completion when a task is checked', () => {
    expect(host.textContent).toContain('2 / 6 complete');
    click(button('Active'));
    expect(host.textContent).toContain('Review the launch brief');
    expect(host.textContent).not.toContain('Organize release assets');

    click(host.querySelector('[aria-label="Complete task: Review the launch brief"]'));
    expect(host.textContent).toContain('3 / 6 complete');
    click(button('Completed'));
    expect(host.textContent).toContain('Review the launch brief');
    expect(host.textContent).toContain('Organize release assets');
  });

  it('discards a dismissed editor draft and saves only after an explicit Save', () => {
    click(button('Edit task: mv'));
    const titleField = document.querySelector<HTMLInputElement>('[aria-label="Task title"]');
    expect(titleField?.value).toBe('mv');
    replaceInputValue(titleField!, 'Launch kickoff');
    click(button('Close editor'));

    click(button('Edit task: mv'));
    expect(document.querySelector<HTMLInputElement>('[aria-label="Task title"]')?.value).toBe('mv');
    replaceInputValue(document.querySelector<HTMLInputElement>('[aria-label="Task title"]')!, 'Launch kickoff');
    click(button('Save'));

    expect(host.textContent).toContain('Launch kickoff');
    expect(host.textContent).not.toContain('Edit task: mv');
    expect(document.body.textContent).toContain('Task saved');
  });

  it('opens exactly one new draft without changing rows or counts, then cancels or saves', () => {
    click(button('New task'));
    expect(document.querySelectorAll('input[aria-label="Task title"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-popover-surface][data-open]')).toHaveLength(1);
    expect(host.querySelector('[aria-label="Tasks"]')?.children).toHaveLength(6);
    expect(host.querySelector('header')?.textContent).toContain('6 tasks · 2 completed');
    click(button('Cancel'));
    expect(document.querySelector('input[aria-label="Task title"]')).toBeNull();
    expect(document.activeElement).toBe(button('New task'));
    click(button('New task'));
    replaceInputValue(document.querySelector<HTMLInputElement>('[aria-label="Task title"]')!, 'New launch task');
    click(button('Save'));
    expect(host.querySelector('[aria-label="Tasks"]')?.children).toHaveLength(7);
    expect(host.querySelector('header')?.textContent).toContain('7 tasks · 2 completed');
    expect(document.querySelector('input[aria-label="Task title"]')).toBeNull();
    expect(document.activeElement).toBe(button('New task'));
  });

  it('creates a draft independently of Active, Completed, search and Activity views', () => {
    for (const view of ['Active', 'Completed', 'Activity']) {
      click(button(view));
      click(button('New task'));
      expect(document.querySelectorAll('input[aria-label="Task title"]')).toHaveLength(1);
      expect(host.querySelector('header')?.textContent).toContain('6 tasks · 2 completed');
      click(button('Close editor'));
    }
    click(button('Tasks'));
    replaceInputValue(host.querySelector<HTMLInputElement>('[aria-label="Search tasks"]')!, 'no matching task');
    click(button('New task'));
    replaceInputValue(document.querySelector<HTMLInputElement>('[aria-label="Task title"]')!, 'Visible saved draft');
    click(button('Save'));
    expect(host.querySelector('[aria-label="Tasks"]')?.textContent).toContain('Visible saved draft');
  });

  it('uses gridcells for interactive tasks and ordinary listitems for activity', () => {
    const tasks = host.querySelector('[aria-label="Tasks"]')!;
    expect(tasks.getAttribute('role')).toBe('grid');
    for (const row of tasks.children) {
      expect(row.getAttribute('role')).toBe('row');
      expect(row.querySelectorAll(':scope > [role="gridcell"]')).toHaveLength(3);
    }
    click(button('Activity'));
    const activity = host.querySelector('[aria-label="Recent activity"]')!;
    expect(activity.getAttribute('role')).toBe('list');
    expect([...activity.children].every((row) => row.getAttribute('role') === 'listitem')).toBe(true);
    expect(host.querySelector('main')).toBeNull();
  });

  it('portals a named nonmodal editor, keeps controls tabbable and discards on Escape', () => {
    const edit = button('Edit task: mv')!;
    expect(edit.textContent?.trim()).toBe('Edit');
    click(edit);
    const surface = document.querySelector<HTMLElement>('[data-popover-surface]')!;
    expect(surface.parentElement).toBe(document.body);
    expect(surface.getAttribute('aria-label')).toBe('Edit task');
    expect(surface.getAttribute('popover')).toBe('auto');
    expect(surface.getAttribute('aria-modal')).not.toBe('true');
    const title = surface.querySelector<HTMLInputElement>('[aria-label="Task title"]')!;
    expect(title.tabIndex).toBe(0);
    expect(document.activeElement).toBe(title);
    replaceInputValue(title, 'Discard on escape');
    act(() => title.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })));
    expect(document.querySelector('input[aria-label="Task title"]')).toBeNull();
    expect(document.activeElement).toBe(edit);
    click(edit);
    expect(document.querySelector<HTMLInputElement>('[aria-label="Task title"]')?.value).toBe('mv');
  });

  it('commits project naming and filters completed tasks without changing completion counts', () => {
    replaceInputValue(host.querySelector<HTMLInputElement>('input[aria-label="Project name"]')!, 'Release planning');
    click(button('Save settings'));
    expect(host.querySelector('h1')?.textContent).toBe('Release planning');
    expect(host.querySelector('[aria-label="Breadcrumb"]')?.textContent).toContain('Release planning');
    replaceInputValue(host.querySelector<HTMLInputElement>('input[aria-label="Project name"]')!, '');
    click(button('Save settings'));
    expect(host.querySelector('h1')?.textContent).toBe('Release planning');
    expect(host.querySelector('[role="status"]')?.textContent).not.toContain('settings saved');
    click(host.querySelector('[aria-label="Show completed tasks"]'));
    expect(host.querySelector('[aria-label="Tasks"]')?.children).toHaveLength(4);
    expect(host.textContent).toContain('2 / 6 complete');
  });

  it('applies default priority only to a saved new task', () => {
    click(host.querySelector('input[type="radio"][value="high"]'));
    click(button('New task'));
    replaceInputValue(document.querySelector<HTMLInputElement>('[aria-label="Task title"]')!, 'Priority task');
    click(button('Save'));
    const row = [...host.querySelector('[aria-label="Tasks"]')!.children].find((item) => item.textContent?.includes('Priority task'));
    expect(row?.textContent).toContain('High priority');
  });

  it('associates end-time validation only with end time and title validation only with title', () => {
    click(button('Edit task: mv'));
    click(button('Add end time'));
    const end = document.querySelector<HTMLInputElement>('[aria-label="Task end time"]')!;
    replaceInputValue(end, '09:00');
    click(button('Save'));
    const title = document.querySelector<HTMLInputElement>('[aria-label="Task title"]')!;
    expect(title.getAttribute('aria-invalid')).not.toBe('true');
    expect(end.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(end.getAttribute('aria-describedby')!)?.textContent).toContain('End time must be after');
    replaceInputValue(end, '11:00');
    replaceInputValue(title, '');
    click(button('Save'));
    expect(title.getAttribute('aria-invalid')).toBe('true');
    expect(end.getAttribute('aria-invalid')).not.toBe('true');
    expect(document.getElementById(title.getAttribute('aria-describedby')!)?.textContent).toContain('Add a task title');
  });

  it('saves a revealed schedule, deadline and list while keeping nested selection inside the editor', () => {
    click(button('Edit task: mv'));
    expect(document.querySelector('[aria-label="Task date"]')).toBeNull();
    expect(document.querySelector('[data-popover-surface]')?.textContent).toContain('or a Google Drive attachment');
    click(button('Change task date'));
    replaceInputValue(document.querySelector<HTMLInputElement>('[aria-label="Task date"]')!, '2026-11-04');
    replaceInputValue(document.querySelector<HTMLInputElement>('[aria-label="Task time"]')!, '12:00');
    click(button('Add deadline'));
    replaceInputValue(document.querySelector<HTMLInputElement>('[aria-label="Task deadline"]')!, '2026-11-05');
    click(button('Task list'));
    click([...document.querySelectorAll('[role="option"]')].find((option) => option.textContent?.includes('Personal'))!);
    expect(document.querySelectorAll('input[aria-label="Task title"]')).toHaveLength(1);
    click(button('Save'));
    const row = [...host.querySelector('[aria-label="Tasks"]')!.children].find((item) => item.textContent?.includes('mv'))!;
    expect(row.textContent).toContain('Wednesday, November 4 · 12:00pm');
    expect(row.textContent).toContain('Personal');
    expect(row.textContent).toContain('Due Thursday, November 5');
  });

  it('clears a removed description in committed task state', () => {
    click(button('Edit task: Review the launch brief'));
    expect(document.querySelector<HTMLTextAreaElement>('[aria-label="Task description"]')?.value).toContain('Align on scope');
    click(button('Remove description'));
    click(button('Save'));
    click(button('Edit task: Review the launch brief'));
    expect(document.querySelector('[aria-label="Task description"]')).toBeNull();
    click(button('Add description'));
    expect(document.querySelector<HTMLTextAreaElement>('[aria-label="Task description"]')?.value).toBe('');
  });
});
