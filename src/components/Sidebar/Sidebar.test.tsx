// @vitest-environment jsdom
import React, { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Sidebar, type AppMode } from './Sidebar';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const Harness: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('base-ui');
  return (
    <Sidebar
      mode={mode}
      onModeChange={setMode}
      selectedBaseUIComponent="switch"
      onSelectBaseUIComponent={() => {}}
    />
  );
};

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root.render(<Harness />));
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const tabs = () => Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));
// Base UI moves focus and selection on the next frame after the key press.
const press = (key: string) =>
  act(async () => {
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
const selectedLabel = () => tabs().find((t) => t.getAttribute('aria-selected') === 'true')?.textContent;

describe('Sidebar mode switcher', () => {
  it('exposes the two design systems as a labelled tablist with one tab stop', () => {
    expect(host.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe('Sidebar mode');
    expect(tabs().map((t) => t.textContent)).toEqual(['Base UI', 'Fluent UI']);
    expect(tabs().map((t) => t.tabIndex)).toEqual([0, -1]);
    expect(host.querySelector('nav[aria-label="Base UI components"]')?.querySelector('[aria-current="page"]'))
      .not.toBeNull();
  });

  it('selects on arrow, wraps at both ends and jumps with Home and End', async () => {
    act(() => tabs()[0].focus());
    await press('ArrowRight');
    expect(selectedLabel()).toBe('Fluent UI');
    await press('ArrowRight');
    expect(selectedLabel()).toBe('Base UI');
    await press('End');
    expect(selectedLabel()).toBe('Fluent UI');
    expect(host.querySelector('nav[aria-label="Fluent UI components"]')).not.toBeNull();
    await press('ArrowLeft');
    expect(selectedLabel()).toBe('Base UI');
    await press('Home');
    expect(selectedLabel()).toBe('Base UI');
    expect(document.activeElement).toBe(tabs()[0]);
  });
});
