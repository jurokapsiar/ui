import { describe, expect, it } from 'vitest';
import { THEME_PRESETS } from './themeTokens';
import { tokensToCss, tokensToJson, tokenVarEntries } from './tokenExport';

const enterprise = THEME_PRESETS.find((p) => p.id === 'enterprise')!.tokens;
const substance = THEME_PRESETS.find((p) => p.id === 'substance')!.tokens;

describe('token export', () => {
  it('emits CSS variables inside @layer theme', () => {
    const css = tokensToCss(enterprise);
    expect(css).toMatch(/^@layer theme \{\n {2}:root \{/);
    expect(css).toContain(`--color-brand-primary: ${enterprise.colorBrandPrimary};`);
    expect(css).toContain('--shadow-elevation-high:');
  });

  it('omits optional tokens a preset leaves unset and includes them once set', () => {
    expect(tokensToCss(enterprise)).not.toContain('--radius-control');
    expect(tokensToCss({ ...enterprise, radiusControl: '8px' })).toContain('--radius-control: 8px;');
    expect(tokensToCss(substance)).toContain('--motion-easing: cubic-bezier(0.2, 0, 0, 1);');
  });

  it('exports edited values', () => {
    const entries = tokenVarEntries({ ...enterprise, radiusBase: '12px' });
    expect(entries).toContainEqual(['--radius-base', '12px']);
  });

  it('exports JSON without undefined tokens', () => {
    const parsed = JSON.parse(tokensToJson({ ...enterprise, radiusControl: undefined }, 'enterprise'));
    expect(parsed.preset).toBe('enterprise');
    expect(parsed.tokens.colorBrandPrimary).toBe(enterprise.colorBrandPrimary);
    expect('radiusControl' in parsed.tokens).toBe(false);
  });
});
