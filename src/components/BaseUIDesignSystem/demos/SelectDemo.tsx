import React, { useState } from 'react';
import { Select } from '@base-ui-components/react/select';
import { Field } from '@base-ui-components/react/field';
import { Check, CaretDown } from '../../Icons/phosphor';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

const FORMATS = [
  { value: 'css-layers', label: 'CSS cascade layers' },
  { value: 'css-modules', label: 'CSS modules' },
  { value: 'dtcg', label: 'DTCG JSON tokens' },
  { value: 'tailwind', label: 'Tailwind theme' },
];

interface FormatSelectProps {
  label: string;
  disabled?: boolean;
  defaultValue?: string | null;
}

const FormatSelect: React.FC<FormatSelectProps> = ({ label, disabled, defaultValue = null }) => {
  const [value, setValue] = useState<string | null>(defaultValue);

  return (
    <Field.Root disabled={disabled} className={styles.fieldRoot}>
      <Field.Label className={styles.fieldLabel}>{label}</Field.Label>
      <Select.Root
        items={FORMATS}
        value={value}
        onValueChange={(v) => setValue(v as string | null)}
        disabled={disabled}
      >
        <Select.Trigger className={styles.selectTrigger}>
          <Select.Value>
            {(v: string | null) => FORMATS.find((f) => f.value === v)?.label ?? 'Choose a format'}
          </Select.Value>
          <Select.Icon aria-hidden="true">
            <CaretDown size={16} aria-hidden="true" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={6} alignItemWithTrigger={false} className={styles.popoverPositioner}>
            <Select.Popup className={styles.selectPopup}>
              {FORMATS.map((f) => (
                <Select.Item key={f.value} value={f.value} className={styles.selectItem}>
                  <span className={styles.selectItemMark}>
                    <Select.ItemIndicator>
                      <Check size={16} weight="bold" aria-hidden="true" />
                    </Select.ItemIndicator>
                  </span>
                  <Select.ItemText>{f.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
};

export const SelectDemo: React.FC = () => (
  <DemoFrame
    category="Forms & Inputs"
    packageName="@base-ui-components/react/select"
    title="Select"
    tagline="A single choice select with a visible label, typeahead, arrow-key navigation and a check mark on the chosen item."
    contractLabel="DOM state attributes:"
    contract={['[data-popup-open]', '[data-highlighted]', '[data-selected]']}
    contractNote="WAI-ARIA: role=&quot;combobox&quot;"
  >
    <DemoCard title="Labelled select" subtitle="Starts empty with a placeholder" column>
      <FormatSelect label="Token output format" />
    </DemoCard>
    <DemoCard title="Preselected value" subtitle="Value shown in the trigger and marked in the list" column>
      <FormatSelect label="Token output format" defaultValue="dtcg" />
    </DemoCard>
    <DemoCard title="Disabled" subtitle="Locked while a build is running" column>
      <FormatSelect label="Token output format" defaultValue="css-layers" disabled />
    </DemoCard>
  </DemoFrame>
);
