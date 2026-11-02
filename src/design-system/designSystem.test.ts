/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BASE_UI_COMPONENTS } from './baseUIComponentsList';
import { FLUENT_COMPONENTS } from './fluentComponentsList';
import { controlSizeFromTouchTarget } from './fluent/size';
import { THEME_PRESETS } from './themeTokens';

describe('theme presets', () => {
  it('uses Inter for body and display typography in every preset', () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.tokens.fontFamilyDisplay, `${preset.id} display`).toBe('Inter, sans-serif');
      expect(preset.tokens.fontFamilyBody, `${preset.id} body`).toBe('Inter, sans-serif');
    }
  });

  it('ships twelve presets including Fluently and Substance with the interaction tones set', () => {
    expect(THEME_PRESETS).toHaveLength(12);
    expect(THEME_PRESETS.map((p) => p.id).slice(-2)).toEqual(['fluently', 'substance']);
    for (const preset of THEME_PRESETS) {
      expect(preset.tokens.colorFocusRing).toBeTruthy();
      expect(preset.tokens.colorBrandTint).toBeTruthy();
      expect(preset.tokens.colorBrandTintBorder).toBeTruthy();
    }
  });

  it('derives tones for older presets from their own tokens', () => {
    const enterprise = THEME_PRESETS.find((p) => p.id === 'enterprise')!;
    expect(enterprise.tokens.colorFocusRing).toBe(enterprise.tokens.colorNeutralText);
    expect(enterprise.tokens.colorBrandTint).toContain(enterprise.tokens.colorBrandPrimary);
  });
});

describe('optional shape, type and motion tokens', () => {
  it('only Substance sets them, so every other preset keeps the views\' built-in defaults', () => {
    const keys = ['radiusControl', 'radiusField', 'radiusChip', 'fontWeightLabel', 'letterSpacingLabel', 'motionEasing', 'motionDurationFast', 'motionDuration'] as const;
    for (const preset of THEME_PRESETS) {
      for (const key of keys) {
        expect(preset.tokens[key] !== undefined, `${preset.id}.${key}`).toBe(preset.id === 'substance');
      }
    }
  });
});

function toRgb(oklch: string): [number, number, number] {
  const [L, C, H] = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s*([\d.]*)\)/)!.slice(1).map((n) => parseFloat(n || '0'));
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v))) as [number, number, number];
}
const luminance = (oklch: string) => {
  const [r, g, b] = toRgb(oklch);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (fg: string, bg: string) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('Substance contrast', () => {
  const t = THEME_PRESETS.find((p) => p.id === 'substance')!.tokens;

  it('holds 4.5:1 for text on its surfaces', () => {
    const pairs: [string, string][] = [
      [t.colorNeutralText, t.colorNeutralBg],
      [t.colorNeutralText, t.colorNeutralSurface],
      [t.colorNeutralTextMuted, t.colorNeutralBg],
      [t.colorNeutralTextMuted, t.colorNeutralSurface],
      [t.colorOnPrimary, t.colorBrandPrimary],
      [t.colorOnPrimary, t.colorBrandPrimaryHover],
      [t.colorNeutralText, t.colorBrandTint],
      [t.colorBrandPrimary, t.colorNeutralBg],
      [t.colorBrandPrimary, t.colorBrandTint],
      [t.colorDanger, t.colorNeutralBg],
      [t.colorSuccess, t.colorNeutralBg],
    ];
    for (const [fg, bg] of pairs) expect(contrast(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  });

  it('holds 3:1 for control borders and the focus ring', () => {
    for (const bg of [t.colorNeutralBg, t.colorNeutralSurface]) {
      expect(contrast(t.colorNeutralBorderStrong, bg)).toBeGreaterThanOrEqual(3);
      expect(contrast(t.colorFocusRing, bg)).toBeGreaterThanOrEqual(3);
    }
    expect(contrast(t.colorBrandPrimary, t.colorNeutralBg)).toBeGreaterThanOrEqual(3);
  });
});

describe('component lists', () => {
  it('has a Fluent counterpart for every Base UI component and nothing extra', () => {
    expect(FLUENT_COMPONENTS.map((c) => c.id).sort()).toEqual(BASE_UI_COMPONENTS.map((c) => c.id).sort());
  });

  it('covers the Material Web set', () => {
    const ids = BASE_UI_COMPONENTS.map((c) => c.id);
    for (const id of ['buttons', 'checkbox', 'chips', 'icon-buttons', 'lists', 'radio', 'select', 'text-field']) {
      expect(ids).toContain(id);
    }
  });
});

const SRC = join(__dirname, '..');
const listCss = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listCss(join(dir, entry.name)) : entry.name.endsWith('.css') ? [join(dir, entry.name)] : [],
  );
const FLUENT_CSS: Record<string, string> = Object.fromEntries(
  [...listCss(join(SRC, 'design-system/fluent')), join(SRC, 'components/FluentDesignSystem/FluentDemos.module.css')].map(
    (file) => [file.slice(SRC.length + 1), readFileSync(file, 'utf8')],
  ),
);

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

describe('fluent styles', () => {
  const files = Object.entries(FLUENT_CSS);

  it('finds the base, component and demo stylesheets', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('declares the same layer order first in every stylesheet', () => {
    for (const [file, css] of files) {
      const [first, second] = stripComments(css).match(/@layer [^{;]+;/g) ?? [];
      expect(first, file).toBe('@layer theme, base, components, utilities;');
      expect(second, file).toBe(
        '@layer components.fluent.reset, components.fluent.tokens, components.fluent.components, components.fluent.states, components.fluent.overrides;',
      );
    }
  });

  it('keeps every rule inside a named layer', () => {
    for (const [file, css] of files) {
      let depth = 0;
      let top = '';
      for (const ch of stripComments(css)) {
        if (ch === '{') {
          if (depth === 0) expect(top.trim().startsWith('@layer components.fluent.'), `${file}: ${top.trim()}`).toBe(true);
          depth++;
          top = '';
        } else if (ch === '}') {
          depth--;
        } else if (depth === 0) {
          top += ch;
          if (ch === ';') top = '';
        }
      }
    }
  });

  it('uses logical properties only', () => {
    const physical = /(^|[\s{;])((margin|padding|border)-(left|right)|left|right|(min-|max-)?(width|height)|text-align:\s*(left|right))\s*:|translateX/m;
    for (const [file, css] of files) {
      expect(stripComments(css).match(physical)?.[0], file).toBeUndefined();
    }
  });

  it('maps the shared ThemeTokens variables onto --fluent-* custom properties', () => {
    const base = FLUENT_CSS['design-system/fluent/base.css'];
    for (const v of ['--color-neutral-bg', '--color-neutral-text', '--color-brand-primary', '--color-focus-ring', '--radius-base', '--spacing-base', '--touch-target-min']) {
      expect(base).toContain(`var(${v}`);
    }
  });
});

describe('control size', () => {
  it('chooses a control size from the touch target', () => {
    expect(controlSizeFromTouchTarget('24px')).toBe('small');
    expect(controlSizeFromTouchTarget('44px')).toBe('large');
  });
});
