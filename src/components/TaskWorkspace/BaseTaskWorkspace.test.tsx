// @vitest-environment jsdom
import React, { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { BaseTaskWorkspace } from './BaseTaskWorkspace';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root.render(<BaseTaskWorkspace />));
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function button(label: string) {
  const match = [...document.body.querySelectorAll('button')].find((candidate) => candidate.textContent?.trim() === label || candidate.getAttribute('aria-label') === label);
  if (!match) throw new Error(`Could not find button "${label}"`);
  return match;
}

function changeInput(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value');
  act(() => {
    descriptor?.set?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

describe('BaseTaskWorkspace', () => {
  it('renders the productive task page and all 18 public component families', () => {
    expect(host.querySelector('h1')?.textContent).toBe('Product launch');
    expect(host.querySelector('[data-workspace="base"]')).not.toBeNull();

    const families = ['switch', 'popover', 'dialog', 'slider', 'checkbox', 'tabs', 'tooltip', 'accordion', 'menu', 'progress', 'radio', 'collapsible', 'buttons', 'chips', 'icon-buttons', 'lists', 'select', 'text-field'];
    for (const family of families) {
      expect(host.querySelector(`[data-component="${family}"]`), `missing ${family} component region`).not.toBeNull();
    }
  });

  it('filters visible tasks and derives selection and progress from task completion', () => {
    expect(host.querySelectorAll('[data-task-id]')).toHaveLength(6);
    expect(host.querySelector('[role="checkbox"]')?.getAttribute('aria-checked')).toBe('mixed');

    act(() => button('Active').click());
    expect(host.querySelectorAll('[data-task-id]')).toHaveLength(4);
    expect(host.querySelector('[role="checkbox"]')?.getAttribute('aria-checked')).toBe('false');

    act(() => button('All').click());
    act(() => host.querySelector('[aria-label="Mark mv complete"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(host.querySelector('[data-task-id="mv"]')?.getAttribute('data-completed')).toBe('true');
    expect(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('50');
  });

  it('discards canceled edits and commits a saved task draft', () => {
    act(() => button('Edit mv').click());
    const title = document.body.querySelector<HTMLInputElement>('input[aria-label="Task title"]');
    expect(title).not.toBeNull();
    changeInput(title!, 'Uncommitted title');
    act(() => button('Close editor').click());

    act(() => button('Edit mv').click());
    expect(document.body.querySelector<HTMLInputElement>('input[aria-label="Task title"]')?.value).toBe('mv');
    changeInput(document.body.querySelector<HTMLInputElement>('input[aria-label="Task title"]')!, 'Prepare launch note');
    act(() => button('Save').click());

    expect(host.querySelector('[data-task-id="mv"]')?.textContent).toContain('Prepare launch note');
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Task saved');
  });

  it('requires confirmation before deletion and keeps the task when canceled', () => {
    act(() => button('More actions for mv').click());
    const deleteOption = [...document.body.querySelectorAll('[role="menuitem"]')].find((item) => item.textContent?.trim() === 'Delete task');
    expect(deleteOption).not.toBeUndefined();
    act(() => deleteOption?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
    act(() => button('Cancel').click());
    expect(host.querySelector('[data-task-id="mv"]')).not.toBeNull();

    act(() => button('More actions for mv').click());
    const confirmOption = [...document.body.querySelectorAll('[role="menuitem"]')].find((item) => item.textContent?.trim() === 'Delete task');
    act(() => confirmOption?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    const confirmDelete = [...document.body.querySelectorAll('button')].find((candidate) => candidate.textContent?.trim() === 'Delete task');
    expect(confirmDelete).not.toBeUndefined();
    act(() => confirmDelete?.click());
    expect(host.querySelector('[data-task-id="mv"]')).toBeNull();
  });

  it('shows the More action tooltip on keyboard focus', async () => {
    const more = button('More actions for mv');
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      more.focus();
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    });
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toContain('More task actions');
  });

  it('opens More with ArrowDown, measures its trigger anchor and restores focus on Escape', async () => {
    const more = button('More actions for mv');
    const measure = vi.spyOn(more, 'getBoundingClientRect').mockReturnValue({ x: 320, y: 200, top: 200, left: 320, right: 352, bottom: 232, width: 32, height: 32, toJSON() {} });
    await act(async () => {
      more.focus();
      more.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 30));
    });
    const menu = document.querySelector<HTMLElement>('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(more.getAttribute('aria-controls')).toBe(menu!.id);
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(measure).toHaveBeenCalled();
    await act(async () => {
      menu!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 30));
    });
    expect(more.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(more);
    measure.mockRestore();
  });

  it('keeps New task separate from counts until Save and applies the selected priority', async () => {
    act(() => host.querySelector<HTMLElement>('[aria-label="High effort"]')!.click());
    act(() => button('New task').click());
    expect(document.querySelectorAll('input[aria-label="Task title"]')).toHaveLength(1);
    expect(host.querySelectorAll('[data-task-id]')).toHaveLength(6);
    expect(host.querySelector('header')?.textContent).toContain('6 tasks · 2 completed');
    await act(async () => button('Cancel').click());
    expect(document.querySelector('input[aria-label="Task title"]')).toBeNull();
    expect(document.activeElement).toBe(button('New task'));
    act(() => button('New task').click());
    changeInput(document.querySelector<HTMLInputElement>('input[aria-label="Task title"]')!, 'New priority task');
    await act(async () => button('Create task').click());
    const newRow = [...host.querySelectorAll('[data-task-id]')].find((row) => row.textContent?.includes('New priority task'));
    expect(host.querySelectorAll('[data-task-id]')).toHaveLength(7);
    expect(newRow?.textContent).toContain('High priority');
    expect(document.activeElement).toBe(button('New task'));
  });

  it('commits a valid project name, rejects an empty settings save and filters completed tasks', () => {
    const name = host.querySelector<HTMLInputElement>('input[aria-label="Project name"]')!;
    changeInput(name, 'Release planning');
    act(() => button('Save settings').click());
    expect(host.querySelector('h1')?.textContent).toBe('Release planning');
    expect(host.querySelector('[class*="breadcrumb"]')?.textContent).toContain('Release planning');
    changeInput(name, '');
    act(() => button('Save settings').click());
    expect(host.querySelector('h1')?.textContent).toBe('Release planning');
    expect(host.querySelector('[role="status"]')?.textContent).not.toContain('settings saved');
    act(() => host.querySelector<HTMLElement>('[aria-label="Show completed tasks"]')!.click());
    expect(host.querySelectorAll('[data-task-id]')).toHaveLength(4);
    expect(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('33');
    expect(host.querySelector('main')).toBeNull();
    expect(host.querySelector('aside')?.textContent).toContain('Project settings');
    act(() => button('Advanced settings').click());
    act(() => host.querySelector<HTMLElement>('[aria-label="Weekly summary"]')!.click());
    expect(host.querySelector('[aria-label="Organization-wide digest"]')?.getAttribute('aria-checked')).toBe('false');
  });

  it('shows a compact schedule and associates validation with the affected field', async () => {
    act(() => button('Edit mv').click());
    const popup = document.querySelector('[role="dialog"][aria-label="Edit task"]')!;
    expect(popup.textContent).toContain('Tuesday, November 3');
    expect(document.querySelector('input[aria-label="Task date"]')).toBeNull();
    act(() => button('Add end time').click());
    const end = document.querySelector<HTMLInputElement>('input[aria-label="Task end time"]')!;
    changeInput(end, '09:00');
    await act(async () => button('Save').click());
    const title = document.querySelector<HTMLInputElement>('input[aria-label="Task title"]')!;
    expect(title.getAttribute('aria-invalid')).not.toBe('true');
    expect(end.getAttribute('aria-invalid')).toBe('true');
    const error = document.getElementById(end.getAttribute('aria-describedby')!);
    expect(error?.textContent).toContain('End time must be after');
    changeInput(end, '11:00');
    changeInput(title, '');
    await act(async () => button('Save').click());
    expect(title.getAttribute('aria-invalid')).toBe('true');
    expect(end.getAttribute('aria-invalid')).not.toBe('true');
    expect(document.getElementById(title.getAttribute('aria-describedby')!)?.textContent).toContain('Add a task title');
  });

  it('removes a description from the saved task', async () => {
    await act(async () => button('Edit Review the launch brief').click());
    await act(async () => button('Remove description').click());
    await act(async () => button('Save').click());
    await act(async () => button('Edit Review the launch brief').click());
    expect(document.querySelector('textarea[aria-label="Task description"]')).toBeNull();
    await act(async () => button('Add description').click());
    expect(document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Task description"]')?.value).toBe('');
  });

  it('edits a revealed schedule, deadline and list without committing before Save', async () => {
    act(() => button('Edit mv').click());
    act(() => button('Change task date').click());
    changeInput(document.querySelector<HTMLInputElement>('[aria-label="Task date"]')!, '2026-11-04');
    changeInput(document.querySelector<HTMLInputElement>('[aria-label="Task start time"]')!, '12:00');
    act(() => button('Add deadline').click());
    changeInput(document.querySelector<HTMLInputElement>('[aria-label="Task deadline"]')!, '2026-11-05');
    act(() => button('Task list').click());
    const personal = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((option) => option.textContent?.includes('Personal'))!;
    act(() => personal.focus());
    act(() => personal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
    expect(document.querySelectorAll('input[aria-label="Task title"]')).toHaveLength(1);
    expect(host.querySelector('[data-task-id="mv"]')?.textContent).toContain("jurokapsiar's list");
    await act(async () => button('Save').click());
    const row = host.querySelector('[data-task-id="mv"]')!;
    expect(row.textContent).toContain('Wednesday, November 4 · 12:00pm');
    expect(row.textContent).toContain('Personal');
    expect(row.textContent).toContain('Due Thursday, November 5');
  });
});
