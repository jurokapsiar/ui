import React, { useState } from 'react';
import { Button, Progress } from '../../../design-system/base';
import { DemoCard, DemoFrame } from './DemoFrame';

export const ProgressDemo: React.FC = () => {
  const [progressVal, setProgressVal] = useState<number>(68);

  return (
    <DemoFrame
      category="Feedback & Status"
      packageName="@base-ui-components/react/progress"
      title="Progress"
      tagline="Progress bar exposing aria-valuenow, aria-valuemin and aria-valuemax, for determinate completion or indeterminate loading."
      contractLabel="Compound parts:"
      contract={['Progress.Root', 'Progress.Track', 'Progress.Indicator']}
      contractNote='WAI-ARIA: role="progressbar"'
    >
      <DemoCard title="Determinate completion indicator" subtitle="Dynamic value with live step controls" column>
        <div className="flex items-baseline justify-between font-mono text-sm text-[var(--ds-brand-ink,#2563eb)]">
          <span>Completion</span>
          <span>{progressVal}%</span>
        </div>
        <Progress.Root value={progressVal} max={100} aria-label="Completion">
          <Progress.Track>
            <Progress.Indicator style={{ width: `${progressVal}%` }} />
          </Progress.Track>
        </Progress.Root>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            data-variant="outlined"
            data-disabled={progressVal <= 0 ? '' : undefined}
            disabled={progressVal <= 0}
            onClick={() => setProgressVal((v) => Math.max(0, v - 10))}
          >
            Back 10%
          </Button>
          <Button
            type="button"
            data-variant="filled"
            data-disabled={progressVal >= 100 ? '' : undefined}
            disabled={progressVal >= 100}
            onClick={() => setProgressVal((v) => Math.min(100, v + 10))}
          >
            Advance 10%
          </Button>
          <Button type="button" data-variant="text" onClick={() => setProgressVal(0)}>
            Reset
          </Button>
        </div>
      </DemoCard>

      <DemoCard title="Pipeline verification progress" subtitle="Contextual label with a text completion state" column>
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-[var(--color-neutral-text,#111113)]">Contrast verification</span>
          <span className="font-mono text-[var(--color-neutral-text,#111113)]">
            {progressVal === 100 ? '✓ Verified' : `${progressVal}%`}
          </span>
        </div>
        <Progress.Root value={progressVal} max={100} aria-label="Contrast verification">
          <Progress.Track>
            <Progress.Indicator style={{ width: `${progressVal}%` }} />
          </Progress.Track>
        </Progress.Root>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          {progressVal === 100
            ? 'Contrast verification complete.'
            : 'Checking text colours against their backgrounds.'}
        </p>
      </DemoCard>
    </DemoFrame>
  );
};
