import type { ThemeTokens } from './themeTokens';

/** Shared runtime serialization of theme tokens. */

type TokenVar = readonly [keyof ThemeTokens, string];

export const REQUIRED_TOKEN_VARS: readonly TokenVar[] = [
  ['colorBrandPrimary', '--color-brand-primary'],
  ['colorBrandPrimaryHover', '--color-brand-primary-hover'],
  ['colorOnPrimary', '--color-on-primary'],
  ['colorNeutralBg', '--color-neutral-bg'],
  ['colorNeutralSurface', '--color-neutral-surface'],
  ['colorNeutralSurfaceHover', '--color-neutral-surface-hover'],
  ['colorNeutralBorder', '--color-neutral-border'],
  ['colorNeutralBorderStrong', '--color-neutral-border-strong'],
  ['colorNeutralText', '--color-neutral-text'],
  ['colorNeutralTextMuted', '--color-neutral-text-muted'],
  ['colorAccent', '--color-accent'],
  ['colorSuccess', '--color-success'],
  ['colorDanger', '--color-danger'],
  ['colorFocusRing', '--color-focus-ring'],
  ['colorBrandTint', '--color-brand-tint'],
  ['colorBrandTintBorder', '--color-brand-tint-border'],
  ['radiusBase', '--radius-base'],
  ['radiusSm', '--radius-sm'],
  ['radiusLg', '--radius-lg'],
  ['borderWidth', '--border-width'],
  ['spacingBase', '--spacing-base'],
  ['spacingXs', '--spacing-xs'],
  ['spacingSm', '--spacing-sm'],
  ['spacingMd', '--spacing-md'],
  ['spacingLg', '--spacing-lg'],
  ['touchTargetMin', '--touch-target-min'],
  ['shadowElevationLow', '--shadow-elevation-low'],
  ['shadowElevationHigh', '--shadow-elevation-high'],
  ['fontFamilyDisplay', '--font-family-display'],
  ['fontFamilyBody', '--font-family-body'],
  ['fontFamilyMono', '--font-family-mono'],
];

/** Optional tokens: a missing value removes the variable so each view falls back to its own default. */
export const OPTIONAL_TOKEN_VARS: readonly TokenVar[] = [
  ['radiusControl', '--radius-control'],
  ['radiusField', '--radius-field'],
  ['radiusChip', '--radius-chip'],
  ['fontWeightLabel', '--font-weight-label'],
  ['letterSpacingLabel', '--letter-spacing-label'],
  ['motionEasing', '--motion-easing'],
  ['motionDurationFast', '--motion-duration-fast'],
  ['motionDuration', '--motion-duration'],
];

export const TOKEN_VARS: readonly TokenVar[] = [...REQUIRED_TOKEN_VARS, ...OPTIONAL_TOKEN_VARS];

/** CSS variable name/value pairs for every token that is set. */
export function tokenVarEntries(tokens: ThemeTokens): [string, string][] {
  return TOKEN_VARS.flatMap(([key, name]) => {
    const value = tokens[key];
    return value ? [[name, value] as [string, string]] : [];
  });
}

export function tokensToCss(tokens: ThemeTokens): string {
  const lines = tokenVarEntries(tokens).map(([name, value]) => `    ${name}: ${value};`);
  return `@layer theme {\n  :root {\n${lines.join('\n')}\n  }\n}\n`;
}

export function tokensToJson(tokens: ThemeTokens, presetId?: string): string {
  const defined = Object.fromEntries(Object.entries(tokens).filter(([, v]) => v !== undefined && v !== ''));
  return JSON.stringify(presetId ? { preset: presetId, tokens: defined } : { tokens: defined }, null, 2);
}
