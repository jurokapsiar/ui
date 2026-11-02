import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Button, ProgressBar } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const ProgressDemo: React.FC = () => {
  const [value, setValue] = useState(45);
  const step = (delta: number) => setValue((v) => Math.max(0, Math.min(100, v + delta)));

  return (
    <FluentDemoFrame
      id="progress"
      tagline="Progress bar exposing aria-valuenow, aria-valuemin and aria-valuemax, for determinate completion or indeterminate loading."
    >
      <DemoCard title="Determinate completion indicator" subtitle="Dynamic value with live interactive step controls" column>
        <ProgressBar className={styles.stretch} value={value} max={100} aria-label="Completion" />
        <p className={styles.readout} aria-live="polite">{value}% complete</p>
        <div className={styles.row}>
          <Button appearance="outline" disabled={value <= 0} onClick={() => step(-15)}>Back 15%</Button>
          <Button appearance="primary" disabled={value >= 100} onClick={() => step(15)}>Advance 15%</Button>
        </div>
      </DemoCard>

      <DemoCard title="Pipeline verification progress" subtitle="Contextual label, subtitle, and completion state" column>
        <ProgressBar className={styles.stretch} value={100} max={100} tone="success" aria-label="Contrast verification" />
        <p className={styles.readout}>Contrast verification complete</p>
        <ProgressBar className={styles.stretch} aria-label="Building theme files" />
        <p className={styles.readout}>Building theme files (indeterminate)</p>
      </DemoCard>
    </FluentDemoFrame>
  );
};
