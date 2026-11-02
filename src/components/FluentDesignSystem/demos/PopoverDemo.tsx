import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Button, Field, Input, Popover, PopoverSurface, PopoverTrigger } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

const PLACEMENTS = [
  { label: 'Top', position: 'above' },
  { label: 'Bottom', position: 'below' },
  { label: 'Left', position: 'before' },
  { label: 'Right', position: 'after' },
] as const;

export const PopoverDemo: React.FC = () => {
  const [tag, setTag] = useState('system.core');
  const [draft, setDraft] = useState(tag);
  const [open, setOpen] = useState(false);

  return (
    <FluentDemoFrame
      id="popover"
      tagline="Floating surface anchored to a trigger with collision handling. Escape closes it and returns focus to the trigger."
    >
      <DemoCard title="Directional placements" subtitle="Top, bottom, left and right positioning with collision checks">
        {PLACEMENTS.map(({ label, position }) => (
          <Popover key={label} positioning={position}>
            <PopoverTrigger>
              <Button appearance="outline">{label}</Button>
            </PopoverTrigger>
            <PopoverSurface>Opens {label.toLowerCase()} of the trigger</PopoverSurface>
          </Popover>
        ))}
      </DemoCard>

      <DemoCard title="Details popover" subtitle="Rich floating surface with a heading, description and status">
        <Popover>
          <PopoverTrigger>
            <Button appearance="primary">Inspect token set</Button>
          </PopoverTrigger>
          <PopoverSurface>
            <div className={styles.popupBody}>
              <strong>Brand palette</strong>
              <span className={styles.readout}>Sample content: primary, on-primary and neutral surface colours.</span>
              <span className={styles.readout}>Status: up to date</span>
            </div>
          </PopoverSurface>
        </Popover>
      </DemoCard>

      <DemoCard title="Inline parameter editor popover" subtitle="Interactive inputs with keyboard submit and state retention">
        <Popover
          open={open}
          trapFocus
          onOpenChange={(_e, d) => {
            setOpen(d.open);
            if (d.open) setDraft(tag);
          }}
        >
          <PopoverTrigger>
            <Button appearance="outline">Edit system tag</Button>
          </PopoverTrigger>
          <PopoverSurface>
            <form
              className={styles.popupBody}
              onSubmit={(e) => {
                e.preventDefault();
                setTag(draft);
                setOpen(false);
              }}
            >
              <Field label="Namespace">
                <Input value={draft} onChange={(_e, d) => setDraft(d.value)} />
              </Field>
              <Button type="submit" appearance="primary">Update namespace</Button>
            </form>
          </PopoverSurface>
        </Popover>
        <span className={styles.readout}>Current tag: {tag}</span>
      </DemoCard>
    </FluentDemoFrame>
  );
};
