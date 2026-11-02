import React from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Collapsible } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';

export const CollapsibleDemo: React.FC = () => (
  <FluentDemoFrame
    id="collapsible"
    tagline="Standalone disclosure for filters, drawers and FAQs. The headless package has no Collapsible, so a Button with aria-expanded controls a region."
  >
    <DemoCard title="Standalone disclosure panel" subtitle="Collapsible card with toggle indicator" column>
      <Collapsible title="Cascade layer precedence rules">
        Later layers win over earlier ones regardless of selector specificity, so the layer order is the source of truth.
      </Collapsible>
    </DemoCard>

    <DemoCard title="Token payload inspector" subtitle="Default open state with raw schema preview" column>
      <Collapsible title="OKLCH theme invariants" defaultOpen>
        <code>{'{ "lightness": "0..1", "chroma": "0..0.4", "hue": "0..360" }'}</code>
      </Collapsible>
    </DemoCard>
  </FluentDemoFrame>
);
