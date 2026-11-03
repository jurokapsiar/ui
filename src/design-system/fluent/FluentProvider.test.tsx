// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '../core';
import { Button, FluentProvider } from './index';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
let setTouchTargetMin: (value: string) => void;

const ThemeControl: React.FC = () => {
  const { updateToken } = useTheme();
  setTouchTargetMin = (value) => updateToken('touchTargetMin', value);
  return null;
};

const renderButton = (size?: 'small' | 'medium' | 'large') => (
  <ThemeProvider>
    <ThemeControl />
    <FluentProvider size={size}>
      <Button>Action</Button>
    </FluentProvider>
  </ThemeProvider>
);

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  document.documentElement.removeAttribute('style');
});

describe('FluentProvider sizing', () => {
  it('derives control size from the active theme touch target', () => {
    act(() => root.render(renderButton()));
    act(() => setTouchTargetMin('24px'));

    expect(host.querySelector('button')?.getAttribute('data-size')).toBe('small');
    expect(host.querySelector('[data-fluent-root]')).not.toBeNull();
  });

  it('uses an explicit size override instead of the theme-derived size', () => {
    act(() => root.render(renderButton('medium')));
    act(() => setTouchTargetMin('24px'));

    expect(host.querySelector('button')?.getAttribute('data-size')).toBe('medium');
  });
});
