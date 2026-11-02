import React from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

const ITEMS = [
  { value: '1', title: '01. OKLCH perceptual uniformity', body: 'Equal lightness steps look equal, so a ramp keeps its contrast when the hue changes.' },
  { value: '2', title: '02. Cascade layer priority (@layer)', body: 'Layers make precedence explicit, so component styles never lose to a reset by accident.' },
  { value: '3', title: '03. APCA contrast certification', body: 'Perceptual contrast is checked for every text and surface pair in each preset.' },
];

const MULTI = [
  { value: 'a', title: 'Touch target minimum (44px)', body: 'Interactive controls keep a hit area large enough for a finger.' },
  { value: 'b', title: 'Headless DOM state attributes', body: 'State is exposed as attributes so styling never depends on class toggling.' },
];

export const AccordionDemo: React.FC = () => (
  <FluentDemoFrame
    id="accordion"
    tagline="Vertically stacked disclosure panels. aria-expanded and aria-controls are managed for you, with single or multiple expansion."
  >
    <DemoCard title="Exclusive single accordion" subtitle="Only one panel remains open at any time" column>
      <Accordion defaultOpenItems="1" collapsible className={styles.stretch}>
        {ITEMS.map((i) => (
          <AccordionItem key={i.value} value={i.value}>
            <AccordionHeader>{i.title}</AccordionHeader>
            <AccordionPanel>{i.body}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </DemoCard>

    <DemoCard title="Simultaneous multi-panel expansion" subtitle="Multiple panels can be opened concurrently" column>
      <Accordion multiple defaultOpenItems={['a', 'b']} className={styles.stretch}>
        {MULTI.map((i) => (
          <AccordionItem key={i.value} value={i.value}>
            <AccordionHeader>{i.title}</AccordionHeader>
            <AccordionPanel>{i.body}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </DemoCard>
  </FluentDemoFrame>
);
