import type { SelectOption } from './controls';
import type { ThemeTokens } from '../../design-system/themeTokens';

export interface ShadowPreset {
  id: string;
  label: string;
  low: string;
  high: string;
  style: ThemeTokens['shadowStyleName'];
}

const ink = 'oklch(0.2 0.02 260';

export const SHADOW_PRESETS: ShadowPreset[] = [
  { id: 'none', label: 'None', low: 'none', high: 'none', style: 'flat-hairline' },
  { id: 'sm', label: 'Small', low: `0 1px 2px ${ink} / 0.08)`, high: `0 4px 12px ${ink} / 0.1)`, style: 'soft-layered' },
  { id: 'md', label: 'Medium', low: `0 1px 3px ${ink} / 0.12)`, high: `0 8px 24px ${ink} / 0.14), 0 2px 6px ${ink} / 0.06)`, style: 'soft-layered' },
  { id: 'lg', label: 'Large', low: `0 2px 6px ${ink} / 0.14)`, high: `0 16px 40px ${ink} / 0.22), 0 4px 10px ${ink} / 0.1)`, style: 'soft-layered' },
  { id: 'offset', label: 'Offset', low: '2px 2px 0 oklch(0.1 0 0)', high: '4px 4px 0 oklch(0.1 0 0)', style: 'brutalist-offset' },
];

export const matchShadowPreset = (low: string, high: string): string | null =>
  SHADOW_PRESETS.find((s) => s.low === low && s.high === high)?.id ?? null;

export const EASING_OPTIONS: SelectOption[] = [
  { value: '', label: 'Preset default' },
  { value: 'cubic-bezier(0.2, 0, 0, 1)', label: 'Standard', hint: '0.2, 0, 0, 1' },
  { value: 'cubic-bezier(0.05, 0.7, 0.1, 1)', label: 'Emphasized', hint: '0.05, 0.7, 0.1, 1' },
  { value: 'cubic-bezier(0, 0, 0.2, 1)', label: 'Ease out', hint: '0, 0, 0.2, 1' },
  { value: 'linear', label: 'Linear' },
];

const stack = (value: string, label: string): SelectOption => ({ value, label });

export const SANS_STACKS: SelectOption[] = [
  stack('Plus Jakarta Sans, sans-serif', 'Plus Jakarta Sans'),
  stack('Manrope, sans-serif', 'Manrope'),
  stack(
    '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
    'Segoe UI',
  ),
  stack('"Roboto Flex", Roboto, "Segoe UI", system-ui, -apple-system, "Helvetica Neue", sans-serif', 'Roboto Flex'),
  stack('system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', 'System UI'),
  stack('Georgia, "Times New Roman", serif', 'Georgia (serif)'),
];

export const MONO_STACKS: SelectOption[] = [
  stack('JetBrains Mono, monospace', 'JetBrains Mono'),
  stack('"Roboto Mono", "JetBrains Mono", ui-monospace, monospace', 'Roboto Mono'),
  stack('ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', 'System mono'),
];
