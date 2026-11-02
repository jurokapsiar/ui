import React, { useState } from 'react';
import { ArrowDownload16Regular, Add16Regular } from '@fluentui/react-icons';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Button } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const ButtonsDemo: React.FC = () => {
  const [count, setCount] = useState(0);
  const press = () => setCount((c) => c + 1);

  return (
    <FluentDemoFrame
      id="buttons"
      tagline="Primary, secondary and subtle buttons for high, medium and low emphasis, with a visible keyboard focus ring and a disabled state."
    >
      <DemoCard title="Emphasis levels" subtitle="Primary for the main action, outline for secondary, subtle for tertiary">
        <Button appearance="primary" onClick={press}>Save changes</Button>
        <Button appearance="tonal" onClick={press}>Save as template</Button>
        <Button appearance="outline" onClick={press}>Save draft</Button>
        <Button appearance="subtle" onClick={press}>Cancel</Button>
      </DemoCard>

      <DemoCard title="With leading icon" subtitle="Icons are decorative; the label carries the name">
        <Button appearance="primary" icon={<Add16Regular />}>New token</Button>
        <Button appearance="outline" icon={<ArrowDownload16Regular />}>Export CSS</Button>
      </DemoCard>

      <DemoCard title="Disabled states" subtitle="disabled attribute with cursor suppression">
        <Button appearance="primary" disabled>Primary</Button>
        <Button appearance="outline" disabled>Outline</Button>
        <Button appearance="subtle" disabled>Subtle</Button>
      </DemoCard>

      <DemoCard title="Live press counter" subtitle="Space and Enter both activate the focused button">
        <p className={styles.counter} aria-live="polite">
          Pressed {count} {count === 1 ? 'time' : 'times'}
        </p>
      </DemoCard>
    </FluentDemoFrame>
  );
};
