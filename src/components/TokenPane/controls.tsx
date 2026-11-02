import React, { useId, useRef, useState } from 'react';
import { Button } from '@base-ui-components/react/button';
import { Field } from '@base-ui-components/react/field';
import { Select } from '@base-ui-components/react/select';
import { Slider } from '@base-ui-components/react/slider';
import { NumberField } from '@base-ui-components/react/number-field';
import { Switch } from '@base-ui-components/react/switch';
import { Check, CaretDown } from '../Icons/phosphor';
import { colorToHex, contrastVerdict, formatOklch, hexToRgb, parseColor, parseOklch, rgbToOklch } from '../../design-system/colorConvert';
import { Tip } from '../Tip/Tip';
import styles from './TokenPane.module.css';

interface RowProps {
  label: string;
  description?: string;
  /** Set when the token is optional and the preset leaves it unset. */
  presetDefault?: boolean;
  /** Called by the inline reset button when the token differs from its preset value. */
  onReset?: () => void;
  invalid?: boolean;
  children: (ids: { labelId: string; descId: string | undefined }) => React.ReactNode;
}

/** Aligned two-column label / control row. */
export const ControlRow: React.FC<RowProps> = ({ label, description, presetDefault, onReset, invalid, children }) => {
  const base = useId();
  const labelId = `${base}-label`;
  const descId = description ? `${base}-desc` : undefined;
  return (
    <Field.Root className={styles.row} invalid={invalid}>
      <div className={styles.rowLabel}>
        <Field.Label id={labelId} className={styles.label}>
          {label}
        </Field.Label>
        {description && (
          <Field.Description id={descId} className={styles.description}>
            {description}
          </Field.Description>
        )}
        {presetDefault && <span className={styles.defaultTag}>Preset default</span>}
        {onReset && (
          <Button className={styles.linkButton} onClick={onReset} aria-label={`Reset ${label} to preset`}>
            Reset
          </Button>
        )}
      </div>
      <div className={styles.rowControl}>{children({ labelId, descId })}</div>
    </Field.Root>
  );
};

/* ---------- Colour ---------- */

export interface ContrastPair {
  against: string;
  minimum: number;
  /** "fg": this token is the foreground over `against`; "bg": `against` is the foreground over this token. */
  role: 'fg' | 'bg';
  pairLabel: string;
}

interface ColorControlProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
  pair?: ContrastPair;
}

export const ContrastBadge: React.FC<{ value: string; pair: ContrastPair }> = ({ value, pair }) => {
  const verdict =
    pair.role === 'fg'
      ? contrastVerdict(value, pair.against, pair.minimum)
      : contrastVerdict(pair.against, value, pair.minimum);
  if (!verdict) return null;
  return (
    <Tip label={pair.pairLabel}>
      <span className={styles.badge} data-pass={verdict.pass}>
        <span className={styles.badgeMark} aria-hidden="true">
          {verdict.pass ? '✓' : '✕'}
        </span>
        <span>{verdict.label}</span>
        <span className={styles.srOnly}> {pair.pairLabel}</span>
      </span>
    </Tip>
  );
};

export const ColorControl: React.FC<ColorControlProps> = ({ label, description, value, onChange, onReset, pair }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const pickerRef = useRef<HTMLInputElement>(null);
  const hex = colorToHex(value);
  const shown = draft ?? value;
  const invalid = draft !== null && !parseColor(draft);

  const commitPicked = (picked: string) => {
    const rgb = hexToRgb(picked);
    if (rgb) onChange(formatOklch(rgbToOklch(rgb)));
  };

  const handleText = (text: string) => {
    setDraft(text);
    const trimmed = text.trim();
    if (!parseColor(trimmed)) return;
    // Hex is stored in the preset's native OKLCH form; typed oklch() is kept as written.
    if (trimmed.startsWith('#')) commitPicked(trimmed);
    else if (parseOklch(trimmed)) onChange(trimmed);
  };

  return (
    <ControlRow label={label} description={description} onReset={onReset} invalid={invalid}>
      {() => (
        <>
          <div className={styles.colorLine}>
            <span className={styles.swatchWrap}>
              {/* Opens the browser's native colour picker, not an in-page popup, so this stays a plain button. */}
              <Button
                className={styles.swatch}
                style={{ backgroundColor: value }}
                aria-label={`Pick ${label} colour`}
                onClick={() => {
                  const el = pickerRef.current;
                  if (!el) return;
                  if (typeof el.showPicker === 'function') el.showPicker();
                  else el.click();
                }}
              />
              <input
                ref={pickerRef}
                type="color"
                className={styles.nativeColor}
                value={hex ?? '#000000'}
                onChange={(e) => commitPicked(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
              />
            </span>
            <Field.Control
              className={styles.textInput}
              value={shown}
              spellCheck={false}
              autoComplete="off"
              onValueChange={handleText}
              onBlur={() => setDraft(null)}
            />
          </div>
          <Field.Error match={invalid} className={styles.error}>
            Enter a hex value or oklch(L C H).
          </Field.Error>
          {pair && !invalid && <ContrastBadge value={value} pair={pair} />}
        </>
      )}
    </ControlRow>
  );
};

/* ---------- Numbers ---------- */

const trimNumber = (n: number) => String(parseFloat(n.toFixed(3)));

export const parseNumber = (value: string | undefined): number | null => {
  if (value === undefined) return null;
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
};

interface NumberControlProps {
  label: string;
  description?: string;
  value: string | undefined;
  /** Value shown on the slider while an optional token is unset. */
  fallback?: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  /** Upper bound for typed values; defaults to `max`. */
  typedMax?: number;
  optional?: boolean;
  onChange: (value: string) => void;
  onReset?: () => void;
}

export const NumberControl: React.FC<NumberControlProps> = ({
  label,
  description,
  value,
  fallback = 0,
  unit,
  min,
  max,
  step,
  typedMax,
  optional,
  onChange,
  onReset,
}) => {
  const n = parseNumber(value);
  const unset = optional && n === null;
  const sliderValue = Math.min(max, Math.max(min, n ?? fallback));
  const emit = (next: number) => onChange(`${trimNumber(next)}${unit}`);

  return (
    <ControlRow label={label} description={description} presetDefault={unset} onReset={onReset}>
      {({ labelId, descId }) => (
        <div className={styles.numberLine}>
          <Slider.Root
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            onValueChange={(v) => emit(Array.isArray(v) ? v[0] : (v as number))}
            className={styles.sliderRoot}
          >
            <Slider.Control className={styles.sliderControl}>
              <Slider.Track className={styles.sliderTrack}>
                <Slider.Indicator className={styles.sliderIndicator} />
                <Slider.Thumb
                  className={styles.sliderThumb}
                  aria-labelledby={labelId}
                  aria-describedby={descId}
                />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
          <NumberField.Root
            value={n}
            min={min}
            max={typedMax ?? max}
            step={step}
            format={{ maximumFractionDigits: 3 }}
            onValueChange={(v) => {
              if (v !== null) emit(v);
            }}
            className={styles.numberRoot}
          >
            <NumberField.Input
              className={styles.numberInput}
              aria-label={`${label} value${unit ? ` in ${unit}` : ''}`}
              placeholder="Default"
            />
          </NumberField.Root>
          {unit && (
            <span className={styles.unit} aria-hidden="true">
              {unit}
            </span>
          )}
        </div>
      )}
    </ControlRow>
  );
};

/* ---------- Select ---------- */

export interface SelectOption {
  value: string;
  label: string;
  /** Optional colour swatch shown before the label. */
  swatch?: string;
  hint?: string;
}

interface SelectControlProps {
  label: string;
  description?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  onReset?: () => void;
  presetDefault?: boolean;
  /** Shown when no option matches the current value. */
  fallbackLabel?: string;
  children?: React.ReactNode;
}

export const SelectField: React.FC<{
  labelId?: string;
  ariaLabel?: string;
  triggerClassName?: string;
  descId?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  fallbackLabel: string;
}> = ({ labelId, ariaLabel, triggerClassName, descId, value, options, onChange, fallbackLabel }) => {
  const current = options.find((o) => o.value === value);
  return (
    <Select.Root
      items={options}
      value={current ? value : null}
      onValueChange={(v) => {
        if (typeof v === 'string') onChange(v);
      }}
    >
      <Select.Trigger
        className={`${styles.selectTrigger} ${triggerClassName ?? ''}`}
        aria-labelledby={labelId}
        aria-label={labelId ? undefined : ariaLabel}
        aria-describedby={descId}
      >
        <span className={styles.selectValue}>
          {current?.swatch && <span className={styles.dot} style={{ backgroundColor: current.swatch }} aria-hidden="true" />}
          <span className={styles.truncate}>{current?.label ?? fallbackLabel}</span>
        </span>
        <Select.Icon aria-hidden="true">
          <CaretDown size={14} weight="bold" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} collisionPadding={8} alignItemWithTrigger={false} className={styles.positioner}>
          <Select.Popup className={styles.selectPopup}>
            {options.map((o) => (
              <Select.Item key={o.value} value={o.value} className={styles.selectItem}>
                <span className={styles.itemMark}>
                  <Select.ItemIndicator>
                    <Check size={14} weight="bold" aria-hidden="true" />
                  </Select.ItemIndicator>
                </span>
                {o.swatch && <span className={styles.dot} style={{ backgroundColor: o.swatch }} aria-hidden="true" />}
                <Select.ItemText>{o.label}</Select.ItemText>
                {o.hint && <span className={styles.itemHint}>{o.hint}</span>}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};

export const SelectControl: React.FC<SelectControlProps> = ({
  label,
  description,
  value,
  options,
  onChange,
  onReset,
  presetDefault,
  fallbackLabel = 'Custom',
  children,
}) => (
  <ControlRow label={label} description={description} presetDefault={presetDefault} onReset={onReset}>
    {({ labelId, descId }) => (
      <>
        <SelectField
          labelId={labelId}
          descId={descId}
          value={value}
          options={options}
          onChange={onChange}
          fallbackLabel={fallbackLabel}
        />
        {children}
      </>
    )}
  </ControlRow>
);

/* ---------- Text ---------- */

export const TextControl: React.FC<{
  labelId: string;
  descId?: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
}> = ({ labelId, descId, value, onChange, mono }) => (
  <Field.Control
    className={`${styles.textInput} ${mono ? styles.monoText : ''}`}
    value={value}
    spellCheck={false}
    autoComplete="off"
    aria-labelledby={labelId}
    aria-describedby={descId}
    onValueChange={onChange}
  />
);

/* ---------- Switch ---------- */

export const SwitchControl: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onReset?: () => void;
}> = ({ label, description, checked, onChange, onReset }) => (
  <ControlRow label={label} description={description} onReset={onReset}>
    {({ labelId, descId }) => (
      <div className={styles.switchLine}>
        <Switch.Root
          checked={checked}
          onCheckedChange={onChange}
          className={styles.switchRoot}
          aria-labelledby={labelId}
          aria-describedby={descId}
        >
          <Switch.Thumb className={styles.switchThumb} />
        </Switch.Root>
        <span className={styles.switchState}>{checked ? 'On' : 'Off'}</span>
      </div>
    )}
  </ControlRow>
);
