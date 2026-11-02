import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Radio, RadioGroup } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const RadioDemo: React.FC = () => {
  const [format, setFormat] = useState('cascade');
  const [density, setDensity] = useState('comfortable');

  return (
    <FluentDemoFrame
      id="radio"
      tagline="Mutually exclusive options with arrow key navigation, roving tabindex and radiogroup semantics."
    >
      <DemoCard title="Standard radio list" subtitle="Vertical stack with focus rings and arrow key cycling" column>
        <RadioGroup value={format} onChange={(_e, d) => setFormat(d.value)} aria-label="Token output format">
          <Radio value="cascade" label="CSS Cascade Layers (@layer theme)" />
          <Radio value="modules" label="CSS Modules Scoped Classes" />
          <Radio value="dtcg" label="W3C DTCG Token Specification (JSON)" />
          <Radio value="locked" label="Legacy preprocessor variables" disabled />
        </RadioGroup>
      </DemoCard>

      <DemoCard title="Selectable option cards" subtitle="Title with descriptive subtext" column>
        <RadioGroup value={density} onChange={(_e, d) => setDensity(d.value)} aria-label="Layout density">
          <Radio
            className={styles.cardRadio}
            value="comfortable"
            label={
              <span className={styles.cardOption}>
                <strong>Comfortable</strong>
                <span className={styles.readout}>Spacious rows for reading and touch</span>
              </span>
            }
          />
          <Radio
            className={styles.cardRadio}
            value="compact"
            label={
              <span className={styles.cardOption}>
                <strong>Compact</strong>
                <span className={styles.readout}>Dense rows for tabular data</span>
              </span>
            }
          />
        </RadioGroup>
      </DemoCard>
    </FluentDemoFrame>
  );
};
