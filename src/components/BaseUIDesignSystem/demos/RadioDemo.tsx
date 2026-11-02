import React, { useState } from 'react';
import { RadioGroup } from '@base-ui-components/react/radio-group';
import { Radio } from '@base-ui-components/react/radio';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

const FORMATS = [
  { id: 'cascade', label: 'CSS cascade layers (@layer theme)' },
  { id: 'modules', label: 'CSS modules scoped classes' },
  { id: 'dtcg', label: 'W3C DTCG token specification (JSON)' },
];

const DENSITIES = [
  { id: 'compact', title: 'Compact', desc: 'Tighter spacing with 36px touch targets for dense tables.' },
  { id: 'comfortable', title: 'Comfortable', desc: '4px grid with 44px touch targets, the recommended default.' },
  { id: 'spacious', title: 'Spacious', desc: 'Looser grid with 48px touch targets for long-form reading.' },
];

export const RadioDemo: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<unknown>('cascade');
  const [selectedDensity, setSelectedDensity] = useState<unknown>('comfortable');

  return (
    <DemoFrame
      category="Forms & Inputs"
      packageName="@base-ui-components/react/radio-group"
      title="Radio Group"
      tagline="Single-select option list handling arrow key navigation, roving tabindex and WAI-ARIA radio group semantics."
      contractLabel="Compound parts:"
      contract={['RadioGroup', 'Radio.Root', 'Radio.Indicator']}
      contractNote='WAI-ARIA: role="radiogroup"'
    >
      <DemoCard title="Standard radio list" subtitle="Vertical stack with focus rings and arrow key cycling" column>
        <RadioGroup
          value={selectedFormat}
          onValueChange={setSelectedFormat}
          className={styles.radioGroupRoot}
          aria-label="Token output format"
        >
          {FORMATS.map((format) => (
            <label key={format.id} className={styles.radioItemContainer}>
              <Radio.Root value={format.id} className={styles.radioRoot} aria-label={format.label}>
                <Radio.Indicator className={styles.radioIndicator} />
              </Radio.Root>
              <span className="text-sm text-[var(--color-neutral-text,#111113)]">{format.label}</span>
            </label>
          ))}
        </RadioGroup>
      </DemoCard>

      <DemoCard title="Selectable option cards" subtitle="Whole card is the target, with a title and description" column>
        <RadioGroup
          value={selectedDensity}
          onValueChange={setSelectedDensity}
          className="flex flex-col gap-2 w-full max-w-sm"
          aria-label="Layout density"
        >
          {DENSITIES.map((card) => (
            <label key={card.id} className={styles.radioCard}>
              <Radio.Root
                value={card.id}
                className={styles.radioRoot}
                style={{ marginTop: 2 }}
                aria-label={card.title}
              >
                <Radio.Indicator className={styles.radioIndicator} />
              </Radio.Root>
              <span>
                <span className="block text-sm font-bold text-[var(--color-neutral-text,#111113)]">{card.title}</span>
                <span className="block text-xs text-[var(--color-neutral-text-muted,#71717a)] mt-0.5">{card.desc}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </DemoCard>
    </DemoFrame>
  );
};
