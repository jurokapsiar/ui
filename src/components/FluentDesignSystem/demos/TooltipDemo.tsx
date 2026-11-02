import React from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Button, Tooltip } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';

const PLACEMENTS = [
  { label: 'Top', position: 'above' },
  { label: 'Bottom', position: 'below' },
  { label: 'Left', position: 'before' },
  { label: 'Right', position: 'after' },
] as const;

export const TooltipDemo: React.FC = () => (
  <FluentDemoFrame
    id="tooltip"
    tagline="Contextual hint shown on pointer hover or keyboard focus, linked to its trigger with aria-describedby."
  >
    <DemoCard title="Directional placements" subtitle="Top, bottom, left and right with automatic viewport collision detection">
      {PLACEMENTS.map(({ label, position }) => (
        <Tooltip key={label} content={`Tooltip on the ${label.toLowerCase()}`} relationship="description" positioning={position}>
          <Button appearance="outline">{label}</Button>
        </Tooltip>
      ))}
    </DemoCard>

    <DemoCard title="Keyboard focus accessibility" subtitle="Tab into the button to reveal the tooltip">
      <Tooltip content="Shown on focus as well as hover" relationship="description">
        <Button appearance="primary">Focus or hover me</Button>
      </Tooltip>
    </DemoCard>
  </FluentDemoFrame>
);
