import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Checkbox } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const CheckboxDemo: React.FC = () => {
  const [enforce, setEnforce] = useState(true);
  const [dense, setDense] = useState(false);
  const [items, setItems] = useState({ apca: true, layers: true, zeroPills: false });

  const all = items.apca && items.layers && items.zeroPills;
  const some = items.apca || items.layers || items.zeroPills;
  const parent: boolean | 'mixed' = all ? true : some ? 'mixed' : false;
  const set = (key: keyof typeof items, checked: boolean) => setItems((p) => ({ ...p, [key]: checked }));

  return (
    <FluentDemoFrame
      id="checkbox"
      tagline="Checked, unchecked and mixed selection. The mixed state maps to aria-checked=mixed and the checkbox toggles with Space."
    >
      <DemoCard title="Standard checkbox" subtitle="With label, keyboard focus ring, and state tracking">
        <Checkbox checked={enforce} onChange={(_e, d) => setEnforce(d.checked === true)} label="Enforce OKLCH token uniformity" />
      </DemoCard>

      <DemoCard title="Parent-child indeterminate state" subtitle="Maps partial group selection to aria-checked=mixed" column>
        <div className={styles.stack}>
          <Checkbox
            checked={parent}
            onChange={(_e, d) => setItems({ apca: d.checked === true, layers: d.checked === true, zeroPills: d.checked === true })}
            label="Select all quality invariants"
          />
          <div className={styles.stack} style={{ paddingInlineStart: 24 }}>
            <Checkbox checked={items.apca} onChange={(_e, d) => set('apca', d.checked === true)} label="APCA contrast verification" />
            <Checkbox checked={items.layers} onChange={(_e, d) => set('layers', d.checked === true)} label="Cascade layer ordering" />
            <Checkbox checked={items.zeroPills} onChange={(_e, d) => set('zeroPills', d.checked === true)} label="Zero-pill metadata filter" />
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Rich selectable card checkbox" subtitle="Label with a description beneath it" column>
        <Checkbox
          checked={dense}
          onChange={(_e, d) => setDense(d.checked === true)}
          label={
            <span className={styles.cardOption}>
              <strong>High-density compact grid</strong>
              <span className={styles.readout}>Reduces spacing scale from 4px to 3px to maximize tabular data visibility on 1440px displays.</span>
            </span>
          }
        />
      </DemoCard>

      <DemoCard title="Disabled states" subtitle="disabled with cursor suppression">
        <Checkbox disabled label="Disabled unchecked" />
        <Checkbox disabled checked label="Disabled checked" />
        <Checkbox disabled checked="mixed" label="Disabled mixed" />
      </DemoCard>
    </FluentDemoFrame>
  );
};
