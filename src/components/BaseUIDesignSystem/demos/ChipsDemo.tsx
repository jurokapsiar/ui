import React, { useState } from 'react';
import { ChipCheck, ChipInput, ChipRemove, Toggle, ToggleGroup } from '../../../design-system/base';
import { Check, X } from '../../Icons/phosphor';
import { DemoCard, DemoFrame } from './DemoFrame';

const FILTERS = ['OKLCH', 'Cascade layers', 'APCA', 'Touch targets'];

export const ChipsDemo: React.FC = () => {
  const [filters, setFilters] = useState<string[]>(['OKLCH']);
  const [inputs, setInputs] = useState(['aria@example.com', 'sam@example.com', 'lee@example.com']);

  return (
    <DemoFrame
      category="Forms & Inputs"
      packageName="@base-ui-components/react/toggle-group"
      title="Chips"
      tagline="Filter chips narrow a set and keep their selected state. Input chips represent entered values and can be removed."
      contractLabel="DOM state attributes:"
      contract={['[data-pressed]', '[data-disabled]']}
      contractNote="aria-pressed on filter chips"
    >
      <DemoCard title="Filter chips" subtitle="Multiple selection through ToggleGroup; arrow keys move focus" column>
        <ToggleGroup
          multiple
          value={filters}
          onValueChange={(v) => setFilters(v as string[])}
          aria-label="Filter by topic"
        >
          {FILTERS.map((name) => (
            <Toggle key={name} value={name}>
              <ChipCheck><Check size={14} weight="bold" aria-hidden="true" /></ChipCheck>
              {name}
            </Toggle>
          ))}
          <Toggle value="Archived" disabled>
            Archived
          </Toggle>
        </ToggleGroup>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" aria-live="polite">
          {filters.length === 0 ? 'No filters applied' : `Filtering by ${filters.join(', ')}`}
        </p>
      </DemoCard>

      <DemoCard title="Input chips" subtitle="Each chip has a remove button with an accessible name" column>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Recipients">
          {inputs.map((email) => (
            <ChipInput key={email} role="listitem">
              {email}
              <ChipRemove
                type="button"
                aria-label={`Remove ${email}`}
                onClick={() => setInputs((list) => list.filter((e) => e !== email))}
              >
                <X size={14} weight="bold" aria-hidden="true" />
              </ChipRemove>
            </ChipInput>
          ))}
        </div>
        {inputs.length === 0 && (
          <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">All recipients removed</p>
        )}
      </DemoCard>
    </DemoFrame>
  );
};
