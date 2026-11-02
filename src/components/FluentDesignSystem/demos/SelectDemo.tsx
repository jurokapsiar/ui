import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Dropdown, Field, Option } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';

const FORMATS = [
  { value: 'css-layers', label: 'CSS cascade layers' },
  { value: 'css-modules', label: 'CSS modules' },
  { value: 'dtcg', label: 'DTCG JSON tokens' },
  { value: 'tailwind', label: 'Tailwind theme' },
];

const FormatSelect: React.FC<{ label: string; disabled?: boolean; initial?: string }> = ({ label, disabled, initial }) => {
  const [value, setValue] = useState<string | undefined>(initial);
  const text = FORMATS.find((f) => f.value === value)?.label ?? '';

  return (
    <Field label={label}>
      {(controlProps) => (
        <Dropdown
          {...controlProps}
          disabled={disabled}
          placeholder="Choose a format"
          value={text}
          selectedOptions={value ? [value] : []}
          onOptionSelect={(_e, data) => setValue(data.optionValue)}
        >
          {FORMATS.map((f) => (
            <Option key={f.value} value={f.value}>
              {f.label}
            </Option>
          ))}
        </Dropdown>
      )}
    </Field>
  );
};

export const SelectDemo: React.FC = () => (
  <FluentDemoFrame
    id="select"
    tagline="A single choice select with a visible label, typeahead, arrow-key navigation and a check mark on the chosen item."
  >
    <DemoCard title="Labelled select" subtitle="Starts empty with a placeholder" column>
      <FormatSelect label="Token output format" />
    </DemoCard>
    <DemoCard title="Preselected value" subtitle="Value shown in the trigger and marked in the list" column>
      <FormatSelect label="Token output format" initial="dtcg" />
    </DemoCard>
    <DemoCard title="Disabled" subtitle="Locked while a build is running" column>
      <FormatSelect label="Token output format" initial="css-layers" disabled />
    </DemoCard>
  </FluentDemoFrame>
);
