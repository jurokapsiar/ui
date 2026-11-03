// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button, Checkbox, Field, Input, Slider } from './index';
import { THEME_PRESETS } from '../core/themeTokens';
import { contrastRatio, formatOklch, parseOklch } from '../core/colorConvert';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe('Base public wrappers', () => {
  it('styles Button while preserving native props, refs, classes, and click behavior', () => {
    const buttonRef = React.createRef<HTMLElement>();
    const onClick = vi.fn();

    act(() => {
      root.render(
        <Button ref={buttonRef} type="submit" data-variant="filled" className="consumer-class" onClick={onClick}>
          Save
        </Button>,
      );
    });

    const button = host.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.type).toBe('submit');
    expect(button?.className).toContain('consumer-class');
    expect(button?.className).not.toBe('consumer-class');
    expect(button?.getAttribute('data-variant')).toBe('filled');
    expect(buttonRef.current).toBe(button);

    act(() => button?.click());
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('keeps the Checkbox compound API styled and interactive', () => {
    const onCheckedChange = vi.fn();

    act(() => {
      root.render(
        <Checkbox.Root aria-label="Enable feature" checked onCheckedChange={onCheckedChange}>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>,
      );
    });

    const checkbox = host.querySelector('[role="checkbox"]');
    expect(checkbox).not.toBeNull();
    expect(checkbox?.className).not.toBe('');
    expect(host.querySelector('[role="checkbox"] [class]')).not.toBeNull();

    act(() => checkbox?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('preserves Field.Error validity matching, external visibility, association, and div refs', async () => {
    const errorRef = React.createRef<HTMLDivElement>();

    act(() => {
      root.render(
        <Field.Root key="valid" validationMode="onBlur" validate={() => null}>
          <Field.Label>Email</Field.Label>
          <Field.Control defaultValue="valid@example.com" />
          <Field.Error ref={errorRef} match="customError" data-testid="valid-field-error">Invalid</Field.Error>
        </Field.Root>,
      );
    });

    expect(host.querySelector('[data-testid="valid-field-error"]')).toBeNull();
    expect(errorRef.current).toBeNull();

    act(() => {
      root.render(
        <Field.Root key="invalid" validationMode="onBlur" validate={() => 'Provide a valid email address'}>
          <Field.Label>Email</Field.Label>
          <Field.Control defaultValue="invalid" />
          <Field.Error ref={errorRef} match="customError" data-testid="field-error" />
        </Field.Root>,
      );
    });

    await act(async () => {
      const input = host.querySelector('input');
      input?.focus();
      input?.blur();
    });

    const error = host.querySelector('[data-testid="field-error"]');
    expect(error).toBeInstanceOf(HTMLDivElement);
    expect(errorRef.current).toBe(error);
    const input = host.querySelector('input');
    expect(input?.getAttribute('aria-describedby')?.split(' ')).toContain(error?.id);
    expect(error?.textContent).toContain('Provide a valid email address');

    act(() => {
      root.render(
        <Field.Root key="external">
          <Field.Control defaultValue="valid@example.com" />
          <Field.Error match={true} data-testid="external-error">Externally validated</Field.Error>
        </Field.Root>,
      );
    });
    expect(host.querySelector('[data-testid="external-error"]')).not.toBeNull();
  });

  it('gives an unadorned Slider.Control its reusable layout and a sized track', () => {
    act(() => {
      root.render(
        <Slider.Root defaultValue={50} aria-label="Volume">
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="Volume" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>,
      );
    });

    const control = host.querySelector('[tabindex="-1"]');
    expect(control?.className).not.toBe('');
    expect(control?.className).toContain('sliderControl');
    expect(host.querySelector('[class*="sliderTrack"]')).not.toBeNull();

    const css = readFileSync(join(__dirname, 'components.module.css'), 'utf8');
    expect(css).toMatch(/\.sliderControl\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.sliderControl\s*\{[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.sliderControl\s*\{[^}]*width:\s*100%/);
    expect(css).toMatch(/\.sliderControl\s*\{[^}]*flex:\s*1/);
  });

  it('keeps accordion keyboard focus visible inside its clipped root', () => {
    const css = readFileSync(join(__dirname, 'components.module.css'), 'utf8');

    expect(css).toMatch(/\.accordionRoot\s*\{[^}]*overflow:\s*hidden/);
    const unlayeredInsetFocus = css.lastIndexOf(':global(:root) .accordionTrigger:focus-visible');
    expect(css.slice(unlayeredInsetFocus)).toMatch(/outline-offset:\s*-2px/);
    expect(unlayeredInsetFocus).toBeGreaterThan(css.lastIndexOf('\n}'));
  });

  it('uses preset-aware badge ink with readable contrast on light and dark presets', () => {
    const showcaseCss = readFileSync(join(__dirname, '../../components/BaseUIDesignSystem/demos/BaseUIDemos.module.css'), 'utf8');
    const baseCss = readFileSync(join(__dirname, 'components.module.css'), 'utf8');

    expect(showcaseCss).toMatch(/\.contractBadge\s*\{[^}]*color:\s*var\(--ds-brand-ink/);
    expect(baseCss).toMatch(/:global\(:root\)\s*\{[^}]*--ds-brand-ink:\s*color-mix\(in oklch, var\(--color-brand-primary[^;]+80%/);
    expect(baseCss).toMatch(/:global\(:root\[data-ds-preset="brutalist"\]\)\s*\{[^}]*--ds-brand-ink:\s*color-mix\(in oklch, var\(--color-brand-primary[^;]+50%/);

    const mixedInk = (presetId: string, brandWeight: number) => {
      const preset = THEME_PRESETS.find(({ id }) => id === presetId)!;
      const brand = parseOklch(preset.tokens.colorBrandPrimary)!;
      const text = parseOklch(preset.tokens.colorNeutralText)!;
      return formatOklch({
        l: brand.l * brandWeight + text.l * (1 - brandWeight),
        c: brand.c * brandWeight + text.c * (1 - brandWeight),
        h: brand.h,
      });
    };

    const brutalist = THEME_PRESETS.find(({ id }) => id === 'brutalist')!.tokens;
    const obsidian = THEME_PRESETS.find(({ id }) => id === 'obsidian')!.tokens;
    expect(contrastRatio(mixedInk('brutalist', 0.5), brutalist.colorNeutralBg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(mixedInk('obsidian', 0.8), obsidian.colorNeutralBg)).toBeGreaterThanOrEqual(4.5);
  });
});
