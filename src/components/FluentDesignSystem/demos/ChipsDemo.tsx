import React, { useState } from 'react';
import { Checkmark12Regular } from '@fluentui/react-icons';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { InteractionTag, InteractionTagPrimary, Tag, TagGroup } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

const FILTERS = ['OKLCH', 'Cascade layers', 'APCA', 'Touch targets'];

export const ChipsDemo: React.FC = () => {
  const [filters, setFilters] = useState<string[]>(['OKLCH']);
  const [inputs, setInputs] = useState(['aria@example.com', 'sam@example.com', 'lee@example.com']);

  const toggle = (name: string) =>
    setFilters((list) => (list.includes(name) ? list.filter((f) => f !== name) : [...list, name]));

  return (
    <FluentDemoFrame
      id="chips"
      tagline="Filter chips narrow a set and keep their selected state. Input chips represent entered values and can be removed."
    >
      <DemoCard title="Filter chips" subtitle="Interaction tags toggle with Space or Enter and expose aria-pressed" column>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {FILTERS.map((name) => {
            const on = filters.includes(name);
            return (
              <InteractionTag key={name} selected={on}>
                <InteractionTagPrimary
                  aria-pressed={on}
                  media={on ? <Checkmark12Regular aria-hidden /> : undefined}
                  onClick={() => toggle(name)}
                >
                  {name}
                </InteractionTagPrimary>
              </InteractionTag>
            );
          })}
          <InteractionTag disabled>
            <InteractionTagPrimary aria-pressed={false}>Archived</InteractionTagPrimary>
          </InteractionTag>
        </div>
        <p className={styles.readout} aria-live="polite">
          {filters.length === 0 ? 'No filters applied' : `Filtering by ${filters.join(', ')}`}
        </p>
      </DemoCard>

      <DemoCard title="Input chips" subtitle="Each chip has a remove button with an accessible name" column>
        <TagGroup
          onDismiss={(_e, data) => setInputs((list) => list.filter((e) => e !== data.value))}
          aria-label="Recipients"
          className={styles.tagWrap}
        >
          {inputs.map((email) => (
            <Tag key={email} value={email} dismissible dismissIcon={{ 'aria-label': `Remove ${email}` }}>
              {email}
            </Tag>
          ))}
        </TagGroup>
        {inputs.length === 0 && <p className={styles.readout}>All recipients removed</p>}
      </DemoCard>
    </FluentDemoFrame>
  );
};
