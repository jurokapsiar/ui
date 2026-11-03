/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as core from './index';
import * as legacyTokens from '../themeTokens';
import * as legacyConversion from '../colorConvert';
import * as legacyExport from '../tokenExport';

describe('core public entry and compatibility exports', () => {
  it('exports the runtime, presets, conversion and export utilities', () => {
    expect(core.ThemeProvider).toBeTypeOf('function');
    expect(core.useTheme).toBeTypeOf('function');
    expect(core.THEME_PRESETS).toHaveLength(12);
    expect(core.hexToRgb).toBeTypeOf('function');
    expect(core.tokensToCss).toBeTypeOf('function');
  });

  it('keeps the original token, conversion and export import paths compatible', () => {
    expect(legacyTokens.THEME_PRESETS).toBe(core.THEME_PRESETS);
    expect(legacyConversion.hexToRgb).toBe(core.hexToRgb);
    expect(legacyExport.tokensToCss).toBe(core.tokensToCss);
  });

  it('ships every enterprise default as static CSS before runtime effects execute', () => {
    const css = readFileSync(join(__dirname, 'theme.css'), 'utf8');
    const enterprise = core.THEME_PRESETS.find((preset) => preset.id === 'enterprise')!.tokens;

    for (const [key, variable] of core.REQUIRED_TOKEN_VARS) {
      expect(css, variable).toContain(`${variable}: ${enterprise[key]};`);
    }
  });

  it('declares the full cascade layer order in the static CSS entry', () => {
    const css = readFileSync(join(__dirname, 'theme.css'), 'utf8');

    expect(css.trimStart()).toMatch(/^@layer theme, base, components, utilities;/);
  });
});
