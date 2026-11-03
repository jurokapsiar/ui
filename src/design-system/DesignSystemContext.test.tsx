// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignSystemProvider, useDesignSystem } from './DesignSystemContext';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let ctx: ReturnType<typeof useDesignSystem>;
const Probe: React.FC = () => {
  ctx = useDesignSystem();
  return null;
};

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  window.localStorage.clear();
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root.render(<DesignSystemProvider><Probe /></DesignSystemProvider>));
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  document.documentElement.removeAttribute('style');
});

describe('DesignSystemContext token editing', () => {
  it('updates the token and the live CSS variable', () => {
    act(() => ctx.updateToken('radiusBase', '12px'));
    expect(ctx.tokens.radiusBase).toBe('12px');
    expect(document.documentElement.style.getPropertyValue('--radius-base')).toBe('12px');
  });

  it('only sets optional tokens when edited, and removes them on reset', () => {
    expect(ctx.tokens.radiusControl).toBeUndefined();
    expect(document.documentElement.style.getPropertyValue('--radius-control')).toBe('');
    act(() => ctx.updateToken('radiusControl', '9px'));
    expect(document.documentElement.style.getPropertyValue('--radius-control')).toBe('9px');
    act(() => ctx.resetTokens(['radiusControl']));
    expect(ctx.tokens.radiusControl).toBeUndefined();
    expect(document.documentElement.style.getPropertyValue('--radius-control')).toBe('');
  });

  it('resets only the requested keys, or everything', () => {
    const original = ctx.tokens;
    act(() => ctx.updateTokens({ radiusBase: '20px', borderWidth: '3px' }));
    act(() => ctx.resetTokens(['radiusBase']));
    expect(ctx.tokens.radiusBase).toBe(original.radiusBase);
    expect(ctx.tokens.borderWidth).toBe('3px');
    act(() => ctx.resetTokens());
    expect(ctx.tokens).toEqual(original);
  });

  it('remembers whether the pane is open', () => {
    act(() => ctx.setTokenPaneOpen(true));
    expect(window.localStorage.getItem('ui-design-systems.tokenPane.open')).toBe('1');
    act(() => ctx.setTokenPaneOpen((v) => !v));
    expect(window.localStorage.getItem('ui-design-systems.tokenPane.open')).toBe('0');
  });

  it('keeps showcase selection and pane state alongside shared theme state', () => {
    act(() => {
      ctx.selectComponent('buttons');
      ctx.setTokenPaneOpen(true);
      ctx.updateToken('radiusBase', '18px');
    });

    expect(ctx.selectedComponentId).toBe('buttons');
    expect(ctx.isTokenPaneOpen).toBe(true);
    expect(ctx.tokens.radiusBase).toBe('18px');
    expect(document.documentElement.style.getPropertyValue('--radius-base')).toBe('18px');
  });
});
