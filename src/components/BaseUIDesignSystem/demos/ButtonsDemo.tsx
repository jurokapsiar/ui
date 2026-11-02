import React, { useState } from 'react';
import { Button } from '@base-ui-components/react/button';
import { DownloadSimple, Plus } from '../../Icons/phosphor';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

export const ButtonsDemo: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <DemoFrame
      category="Forms & Inputs"
      packageName="@base-ui-components/react/button"
      title="Buttons"
      tagline="Filled, outlined and text buttons for high, medium and low emphasis, with a visible keyboard focus ring and a disabled state."
      contractLabel="DOM state attributes:"
      contract={['[data-variant]', '[data-disabled]']}
      contractNote="Native button element"
    >
      <DemoCard title="Emphasis levels" subtitle="Filled for the main action, tonal and outlined for secondary, text for tertiary">
        <Button className={styles.btn} data-variant="filled" onClick={() => setCount((c) => c + 1)}>
          Save changes
        </Button>
        <Button className={styles.btn} data-variant="tonal" onClick={() => setCount((c) => c + 1)}>
          Save as template
        </Button>
        <Button className={styles.btn} data-variant="outlined" onClick={() => setCount((c) => c + 1)}>
          Save draft
        </Button>
        <Button className={styles.btn} data-variant="text" onClick={() => setCount((c) => c + 1)}>
          Cancel
        </Button>
      </DemoCard>

      <DemoCard title="With leading icon" subtitle="Icons are decorative; the label carries the name">
        <Button className={styles.btn} data-variant="filled">
          <Plus size={16} aria-hidden="true" />
          New token
        </Button>
        <Button className={styles.btn} data-variant="outlined">
          <DownloadSimple size={16} aria-hidden="true" />
          Export CSS
        </Button>
      </DemoCard>

      <DemoCard title="Disabled states" subtitle="[data-disabled] with cursor suppression">
        <Button className={styles.btn} data-variant="filled" disabled>
          Filled
        </Button>
        <Button className={styles.btn} data-variant="outlined" disabled>
          Outlined
        </Button>
        <Button className={styles.btn} data-variant="text" disabled>
          Text
        </Button>
      </DemoCard>

      <DemoCard title="Live press counter" subtitle="Space and Enter both activate the focused button">
        <p className="text-sm text-[var(--color-neutral-text,#111113)]" aria-live="polite">
          Pressed {count} {count === 1 ? 'time' : 'times'}
        </p>
      </DemoCard>
    </DemoFrame>
  );
};
