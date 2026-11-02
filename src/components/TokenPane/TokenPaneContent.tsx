import React, { useRef, useState } from 'react';
import { Button } from '@base-ui-components/react/button';
import { Collapsible } from '@base-ui-components/react/collapsible';
import { Dialog } from '@base-ui-components/react/dialog';
import { Fieldset } from '@base-ui-components/react/fieldset';
import { RadioGroup } from '@base-ui-components/react/radio-group';
import { Radio } from '@base-ui-components/react/radio';
import { CaretRight, X } from '../Icons/phosphor';
import { useDesignSystem } from '../../design-system/DesignSystemContext';
import { ThemeTokens } from '../../design-system/themeTokens';
import { tokensToCss, tokensToJson } from '../../design-system/tokenExport';
import {
  ColorControl,
  ContrastPair,
  ControlRow,
  NumberControl,
  SelectControl,
  SelectField,
  SelectOption,
  SwitchControl,
  TextControl,
  parseNumber,
} from './controls';
import { EasingPreview } from './EasingPreview';
import { SHADOW_PRESETS, EASING_OPTIONS, SANS_STACKS, MONO_STACKS, matchShadowPreset } from './tokenOptions';
import styles from './TokenPane.module.css';

type Key = keyof ThemeTokens;

interface ColorSpec {
  key: Key;
  label: string;
  description: string;
  pair?: { against: Key; minimum: number; role: 'fg' | 'bg'; pairName: string };
}

interface ColorGroup {
  title: string;
  items: ColorSpec[];
}

const onBg = { against: 'colorNeutralBg', role: 'fg', pairName: 'against the background' } as const;
const behindText = { against: 'colorNeutralText', minimum: 4.5, role: 'bg', pairName: 'behind body text' } as const;

const COLOR_GROUPS: ColorGroup[] = [
  {
    title: 'Brand',
    items: [
      { key: 'colorBrandPrimary', label: 'Primary', description: 'Buttons, selection, links', pair: { ...onBg, minimum: 3 } },
      {
        key: 'colorBrandPrimaryHover',
        label: 'Primary hover',
        description: 'Pressed and hovered primary',
        pair: { against: 'colorOnPrimary', minimum: 4.5, role: 'bg', pairName: 'behind the on-primary text' },
      },
      {
        key: 'colorOnPrimary',
        label: 'On primary',
        description: 'Text and icons on primary',
        pair: { against: 'colorBrandPrimary', minimum: 4.5, role: 'fg', pairName: 'on the primary colour' },
      },
      { key: 'colorBrandTint', label: 'Tint', description: 'Selected rows, chips' },
      { key: 'colorBrandTintBorder', label: 'Tint border', description: 'Border paired with the tint' },
    ],
  },
  {
    title: 'Surfaces',
    items: [
      { key: 'colorNeutralBg', label: 'Background', description: 'Page canvas' },
      { key: 'colorNeutralSurface', label: 'Surface', description: 'Cards and controls', pair: behindText },
      { key: 'colorNeutralSurfaceHover', label: 'Surface hover', description: 'Hovered surface', pair: behindText },
    ],
  },
  {
    title: 'Text',
    items: [
      { key: 'colorNeutralText', label: 'Text', description: 'Body copy', pair: { ...onBg, minimum: 4.5 } },
      { key: 'colorNeutralTextMuted', label: 'Muted text', description: 'Secondary copy', pair: { ...onBg, minimum: 4.5 } },
    ],
  },
  {
    title: 'Borders',
    items: [
      { key: 'colorNeutralBorder', label: 'Border', description: 'Hairlines and dividers' },
      { key: 'colorNeutralBorderStrong', label: 'Strong border', description: 'Input and control edges', pair: { ...onBg, minimum: 3 } },
    ],
  },
  {
    title: 'Status',
    items: [
      { key: 'colorAccent', label: 'Accent', description: 'Highlights and info', pair: { ...onBg, minimum: 3 } },
      { key: 'colorSuccess', label: 'Success', description: 'Positive state', pair: { ...onBg, minimum: 3 } },
      { key: 'colorDanger', label: 'Danger', description: 'Errors and destructive', pair: { ...onBg, minimum: 3 } },
    ],
  },
];

const COLOR_KEYS: Key[] = COLOR_GROUPS.flatMap((g) => g.items.map((i) => i.key));
const SHAPE_KEYS: Key[] = ['radiusBase', 'radiusSm', 'radiusLg', 'radiusControl', 'radiusField', 'radiusChip', 'borderWidth'];
const TYPE_KEYS: Key[] = ['fontFamilyDisplay', 'fontFamilyBody', 'fontFamilyMono', 'fontWeightLabel', 'letterSpacingLabel'];
const ELEVATION_KEYS: Key[] = ['shadowElevationLow', 'shadowElevationHigh', 'shadowStyleName'];
const MOTION_KEYS: Key[] = ['motionEasing', 'motionDurationFast', 'motionDuration'];
const SPACING_KEYS: Key[] = ['spacingBase', 'spacingXs', 'spacingSm', 'spacingMd', 'spacingLg', 'touchTargetMin'];
const FOCUS_KEYS: Key[] = ['colorFocusRing'];

interface SectionProps {
  title: string;
  keys: Key[];
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, keys, defaultOpen, children }) => {
  const { tokens, activePreset, resetTokens } = useDesignSystem();
  const [open, setOpen] = useState(!!defaultOpen);
  const edited = keys.filter((k) => tokens[k] !== activePreset.tokens[k]).length;

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={styles.section}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>
          <Collapsible.Trigger className={styles.sectionTrigger}>
            <CaretRight size={14} weight="bold" aria-hidden="true" className={styles.chevron} data-open={open} />
            <span>{title}</span>
            {edited > 0 && <span className={styles.editedCount}>{edited} edited</span>}
          </Collapsible.Trigger>
        </h3>
        <Button
          className={styles.linkButton}
          disabled={edited === 0}
          onClick={() => resetTokens(keys)}
          aria-label={`Reset ${title} to preset`}
        >
          Reset
        </Button>
      </div>
      <Collapsible.Panel className={styles.sectionPanel}>
        <div className={styles.sectionBody}>{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
};

type OptionalNumberKey =
  | 'radiusControl'
  | 'radiusField'
  | 'radiusChip'
  | 'fontWeightLabel'
  | 'letterSpacingLabel'
  | 'motionDurationFast'
  | 'motionDuration';

export const TokenPaneContent: React.FC<{ onClose: () => void; sheet: boolean }> = ({
  onClose,
  sheet,
}) => {
  const { tokens, activePresetId, activePreset, updateToken, updateTokens, resetTokens } = useDesignSystem();
  const [status, setStatus] = useState('');
  const statusTimer = useRef<number | undefined>(undefined);

  const preset = activePreset.tokens;
  const resetFor = (key: Key) => (tokens[key] !== preset[key] ? () => resetTokens([key]) : undefined);
  const editedTotal = (Object.keys(tokens) as Key[]).filter((k) => tokens[k] !== preset[k]).length;

  const announce = (message: string) => {
    setStatus(message);
    window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(''), 4000);
  };

  const copy = async (format: 'css' | 'json') => {
    const text = format === 'css' ? tokensToCss(tokens) : tokensToJson(tokens, activePresetId);
    const name = format === 'css' ? 'CSS variables' : 'JSON';
    try {
      await navigator.clipboard.writeText(text);
      announce(`Copied ${name} for ${activePreset.name}.`);
    } catch {
      announce(`Could not copy ${name}. Clipboard access was blocked.`);
    }
  };

  const renderColor = (spec: ColorSpec) => {
    const pair: ContrastPair | undefined = spec.pair
      ? {
          against: tokens[spec.pair.against] as string,
          minimum: spec.pair.minimum,
          role: spec.pair.role,
          pairLabel: spec.pair.pairName,
        }
      : undefined;
    return (
      <ColorControl
        key={spec.key}
        label={spec.label}
        description={spec.description}
        value={tokens[spec.key] as string}
        onChange={(v) => updateTokens({ [spec.key]: v })}
        onReset={resetFor(spec.key)}
        pair={pair}
      />
    );
  };

  const setBaseRadius = (value: string) => {
    const n = parseFloat(value);
    // Scaling the base also clears the per-control overrides so the slider visibly drives every control.
    updateTokens({
      radiusBase: value,
      radiusSm: n === 0 ? '0px' : n >= 9999 ? '9999px' : `${Math.max(2, n / 2)}px`,
      radiusLg: n === 0 ? '0px' : n >= 9999 ? '9999px' : `${n * 1.5}px`,
      radiusControl: undefined,
      radiusField: undefined,
      radiusChip: undefined,
    });
  };

  const setSpacingBase = (value: string) => {
    const n = parseFloat(value);
    updateTokens({
      spacingBase: value,
      spacingXs: `${n}px`,
      spacingSm: `${n * 2}px`,
      spacingMd: `${n * 4}px`,
      spacingLg: `${n * 6}px`,
    });
  };

  const shadowId = matchShadowPreset(tokens.shadowElevationLow, tokens.shadowElevationHigh);
  const shadowEdited = ELEVATION_KEYS.some((k) => tokens[k] !== preset[k]);
  const touchPx = parseNumber(tokens.touchTargetMin) ?? 44;

  const fontControl = (
    key: 'fontFamilyDisplay' | 'fontFamilyBody' | 'fontFamilyMono',
    label: string,
    description: string,
    stacks: SelectOption[],
  ) => (
    <ControlRow key={key} label={label} description={description} onReset={resetFor(key)}>
      {({ labelId, descId }) => (
        <>
          <SelectField
            labelId={labelId}
            descId={descId}
            value={tokens[key]}
            options={stacks}
            onChange={(v) => updateToken(key, v)}
            fallbackLabel="Custom stack"
          />
          <TextControl labelId={labelId} descId={descId} value={tokens[key]} onChange={(v) => updateToken(key, v)} mono />
        </>
      )}
    </ControlRow>
  );

  const optionalNumber = (
    key: OptionalNumberKey,
    props: { label: string; description: string; unit: string; min: number; max: number; step: number; fallback: number; typedMax?: number },
  ) => (
    <NumberControl
      key={key}
      {...props}
      optional
      value={tokens[key]}
      onChange={(v) => updateToken(key, v)}
      onReset={resetFor(key)}
    />
  );

  const radiusFallback = parseNumber(tokens.radiusBase) ?? 8;

  return (
    <>
      <header className={styles.paneHeader}>
        {sheet ? (
          <Dialog.Title className={styles.paneTitle}>Customize tokens</Dialog.Title>
        ) : (
          <h2 className={styles.paneTitle} id="token-pane-title">
            Customize tokens
          </h2>
        )}
        {sheet ? (
          <Dialog.Close className={styles.iconButton} aria-label="Close token pane">
            <X size={16} aria-hidden="true" />
          </Dialog.Close>
        ) : (
          <Button className={styles.iconButton} onClick={onClose} aria-label="Close token pane">
            <X size={16} aria-hidden="true" />
          </Button>
        )}
      </header>

      <div className={styles.scroll}>
        <Section title="Colour" keys={COLOR_KEYS} defaultOpen>
          {COLOR_GROUPS.map((group) => (
            <Fieldset.Root key={group.title} className={styles.group}>
              <Fieldset.Legend render={<h4 />} className={styles.groupTitle}>
                {group.title}
              </Fieldset.Legend>
              {group.items.map(renderColor)}
            </Fieldset.Root>
          ))}
        </Section>

        <Section title="Shape" keys={SHAPE_KEYS}>
          <NumberControl
            label="Base radius"
            description="Scales small and large radii, clears control overrides"
            unit="px"
            min={0}
            max={32}
            step={1}
            typedMax={9999}
            value={tokens.radiusBase}
            onChange={setBaseRadius}
            onReset={resetFor('radiusBase')}
          />
          <NumberControl label="Small radius" unit="px" min={0} max={32} step={1} typedMax={9999} value={tokens.radiusSm} onChange={(v) => updateToken('radiusSm', v)} onReset={resetFor('radiusSm')} />
          <NumberControl label="Large radius" description="Cards and dialogs" unit="px" min={0} max={48} step={1} typedMax={9999} value={tokens.radiusLg} onChange={(v) => updateToken('radiusLg', v)} onReset={resetFor('radiusLg')} />
          {optionalNumber('radiusControl', { label: 'Control radius', description: 'Buttons and icon buttons', unit: 'px', min: 0, max: 32, step: 1, typedMax: 9999, fallback: radiusFallback })}
          {optionalNumber('radiusField', { label: 'Field radius', description: 'Text fields and selects', unit: 'px', min: 0, max: 32, step: 1, typedMax: 9999, fallback: radiusFallback })}
          {optionalNumber('radiusChip', { label: 'Chip radius', description: 'Chips and tags', unit: 'px', min: 0, max: 32, step: 1, typedMax: 9999, fallback: parseNumber(tokens.radiusSm) ?? 4 })}
          <NumberControl label="Border width" unit="px" min={0} max={4} step={0.5} value={tokens.borderWidth} onChange={(v) => updateToken('borderWidth', v)} onReset={resetFor('borderWidth')} />
        </Section>

        <Section title="Typography" keys={TYPE_KEYS}>
          {fontControl('fontFamilyDisplay', 'Display font', 'Headings', SANS_STACKS)}
          {fontControl('fontFamilyBody', 'Body font', 'Paragraphs and controls', SANS_STACKS)}
          {fontControl('fontFamilyMono', 'Mono font', 'Code and values', MONO_STACKS)}
          {optionalNumber('fontWeightLabel', { label: 'Label weight', description: 'Buttons and chips', unit: '', min: 100, max: 900, step: 100, fallback: 500 })}
          {optionalNumber('letterSpacingLabel', { label: 'Label tracking', description: 'Letter spacing on labels', unit: 'px', min: -1, max: 2, step: 0.05, fallback: 0 })}
        </Section>

        <Section title="Elevation" keys={ELEVATION_KEYS}>
          <ControlRow
            label="Shadow"
            description={shadowId ? 'Applies to low and high elevation' : 'This preset uses a custom shadow. Pick one to replace it.'}
            onReset={shadowEdited ? () => resetTokens(ELEVATION_KEYS) : undefined}
          >
            {({ labelId, descId }) => (
              <RadioGroup
                value={shadowId ?? ''}
                onValueChange={(id) => {
                  const choice = SHADOW_PRESETS.find((s) => s.id === id);
                  if (choice) {
                    updateTokens({
                      shadowElevationLow: choice.low,
                      shadowElevationHigh: choice.high,
                      shadowStyleName: choice.style,
                    });
                  }
                }}
                className={styles.radioCards}
                aria-labelledby={labelId}
                aria-describedby={descId}
              >
                {SHADOW_PRESETS.map((s) => (
                  <label key={s.id} className={styles.radioCard}>
                    <Radio.Root value={s.id} className={styles.radioRoot}>
                      <Radio.Indicator className={styles.radioIndicator} />
                    </Radio.Root>
                    <span className={styles.shadowSample} style={{ boxShadow: s.high }} aria-hidden="true" />
                    <span>{s.label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          </ControlRow>
        </Section>

        <Section title="Motion" keys={MOTION_KEYS}>
          <SelectControl
            label="Easing"
            description="Curve for state changes and movement"
            value={tokens.motionEasing ?? ''}
            options={EASING_OPTIONS}
            presetDefault={!tokens.motionEasing}
            fallbackLabel="Custom curve"
            onChange={(v) => updateToken('motionEasing', v || undefined)}
            onReset={resetFor('motionEasing')}
          >
            <EasingPreview easing={tokens.motionEasing} duration={tokens.motionDuration} />
          </SelectControl>
          {optionalNumber('motionDurationFast', { label: 'Fast duration', description: 'State changes', unit: 'ms', min: 0, max: 600, step: 10, fallback: 150, typedMax: 5000 })}
          {optionalNumber('motionDuration', { label: 'Duration', description: 'Movement and reveals', unit: 'ms', min: 0, max: 1000, step: 10, fallback: 250, typedMax: 5000 })}
        </Section>

        <Section title="Spacing and density" keys={SPACING_KEYS}>
          <NumberControl
            label="Spacing unit"
            description="Scales the xs to lg steps"
            unit="px"
            min={2}
            max={8}
            step={1}
            value={tokens.spacingBase}
            onChange={setSpacingBase}
            onReset={resetFor('spacingBase')}
          />
          <NumberControl label="Touch target" description="Minimum control size" unit="px" min={24} max={56} step={4} value={tokens.touchTargetMin} onChange={(v) => updateToken('touchTargetMin', v)} onReset={resetFor('touchTargetMin')} />
          <SwitchControl
            label="Large touch targets"
            description="Keeps controls at 44px or more (WCAG 2.5.5)"
            checked={touchPx >= 44}
            onChange={(on) => updateToken('touchTargetMin', on ? '44px' : '24px')}
          />
        </Section>

        <Section title="Focus" keys={FOCUS_KEYS}>
          {renderColor({
            key: 'colorFocusRing',
            label: 'Focus ring',
            description: 'Keyboard focus outline',
            pair: { ...onBg, minimum: 3 },
          })}
        </Section>
      </div>

      <footer className={styles.paneFooter}>
        <div className={styles.footerActions}>
          <Button className={styles.button} onClick={() => resetTokens()} disabled={editedTotal === 0}>
            Reset all
          </Button>
          <Button className={styles.button} onClick={() => copy('css')}>
            Copy CSS
          </Button>
          <Button className={styles.button} onClick={() => copy('json')}>
            Copy JSON
          </Button>
        </div>
        <p role="status" className={styles.status}>
          {status}
        </p>
      </footer>
    </>
  );
};
