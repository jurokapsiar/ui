// @vitest-environment jsdom
import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from './index';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let theme: ReturnType<typeof useTheme>;
const Probe = () => {
  theme = useTheme();
  return <span>{theme.activePresetId}</span>;
};

let host: HTMLDivElement;
let root: Root | undefined;

const renderProvider = () => {
  act(() => root!.render(<ThemeProvider><Probe /></ThemeProvider>));
};

beforeEach(() => {
  document.documentElement.style.setProperty('--color-brand-primary', 'external-brand');
  document.documentElement.style.setProperty('--radius-control', 'external-radius');
  document.documentElement.dataset.dsPreset = 'external-preset';
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  root = undefined;
  host.remove();
  document.documentElement.style.removeProperty('--color-brand-primary');
  document.documentElement.style.removeProperty('--radius-control');
  document.documentElement.style.removeProperty('--radius-base');
  document.documentElement.style.removeProperty('--motion-duration');
  delete document.documentElement.dataset.dsPreset;
});

describe('core ThemeProvider', () => {
  it('starts with enterprise defaults and applies them to the document root', () => {
    renderProvider();

    expect(theme.activePresetId).toBe('enterprise');
    expect(theme.tokens.colorBrandPrimary).toBeTruthy();
    expect(document.documentElement.style.getPropertyValue('--color-brand-primary')).toBe(theme.tokens.colorBrandPrimary);
    expect(document.documentElement.dataset.dsPreset).toBe('enterprise');
  });

  it('supports preset selection, token patches, and full or targeted reset', () => {
    renderProvider();
    const enterpriseRadius = theme.tokens.radiusBase;

    act(() => theme.selectPreset('substance'));
    expect(theme.activePresetId).toBe('substance');
    expect(document.documentElement.style.getPropertyValue('--motion-duration')).toBe('250ms');

    act(() => theme.updateTokens({ radiusBase: '40px', motionDuration: '1ms' }));
    act(() => theme.resetTokens(['radiusBase']));
    expect(theme.tokens.radiusBase).not.toBe('40px');
    expect(theme.tokens.motionDuration).toBe('1ms');

    act(() => theme.resetTokens());
    expect(theme.tokens.radiusBase).toBe('12px');
    expect(document.documentElement.style.getPropertyValue('--motion-duration')).toBe('250ms');
    act(() => theme.selectPreset('enterprise'));
    expect(theme.tokens.radiusBase).toBe(enterpriseRadius);
    expect(theme.tokens.motionDuration).toBeUndefined();
    expect(document.documentElement.style.getPropertyValue('--motion-duration')).toBe('');
  });

  it('restores prior document token values and preset metadata on unmount', () => {
    renderProvider();
    act(() => theme.updateTokens({ radiusBase: '20px', radiusControl: undefined }));
    expect(document.documentElement.style.getPropertyValue('--radius-control')).toBe('');

    act(() => root!.unmount());
    root = undefined;

    expect(document.documentElement.style.getPropertyValue('--color-brand-primary')).toBe('external-brand');
    expect(document.documentElement.style.getPropertyValue('--radius-control')).toBe('external-radius');
    expect(document.documentElement.style.getPropertyValue('--radius-base')).toBe('');
    expect(document.documentElement.dataset.dsPreset).toBe('external-preset');
  });

  it('renders on the server without mutating document state', () => {
    document.documentElement.style.setProperty('--color-brand-primary', 'server-sentinel');

    expect(renderToString(<ThemeProvider><Probe /></ThemeProvider>)).toContain('enterprise');
    expect(document.documentElement.style.getPropertyValue('--color-brand-primary')).toBe('server-sentinel');
  });
});
