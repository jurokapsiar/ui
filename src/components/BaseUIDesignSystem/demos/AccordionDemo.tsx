import React, { useState } from 'react';
import { Accordion } from '@base-ui-components/react/accordion';
import { CaretDown } from '../../Icons/phosphor';
import styles from './BaseUIDemos.module.css';

export const AccordionDemo: React.FC = () => {
  const [singleValue, setSingleValue] = useState<any[]>(['item-1']);
  const [multiValue, setMultiValue] = useState<any[]>(['m-1', 'm-2']);

  return (
    <div className={styles.demoPageContainer}>
      <header className={styles.demoHeader}>
        <div className={styles.metaRow}>
          <span>Navigation & Layout</span>
          <span aria-hidden="true">·</span>
          <span>@base-ui-components/react/accordion</span>
        </div>
        <h1 className={styles.componentTitle}>Accordion</h1>
        <p className={styles.componentTagline}>
          Vertically stacked collapsible disclosure panels. Manages aria-expanded and aria-controls automatically, with single or multiple panel expansion options.
        </p>
        <div className={styles.contractStrip}>
          <span className="font-semibold text-xs">Compound Parts:</span>
          <code className={styles.contractBadge}>Accordion.Root</code>
          <code className={styles.contractBadge}>Accordion.Item</code>
          <code className={styles.contractBadge}>Accordion.Header</code>
          <code className={styles.contractBadge}>Accordion.Trigger</code>
          <code className={styles.contractBadge}>Accordion.Panel</code>
          <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">State: [data-panel-open]</span>
        </div>
      </header>

      <div className={styles.variantGrid}>
        {/* Variant 1: Single Exclusive Expansion */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Exclusive single accordion</h2>
              <p className={styles.variantSubtitle}>Only one panel remains open at any time</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <Accordion.Root
              aria-label="Exclusive accordion"
              value={singleValue}
              onValueChange={setSingleValue}
              className={styles.accordionRoot}
            >
              <Accordion.Item value="item-1" className={styles.accordionItem}>
                <Accordion.Header>
                  <Accordion.Trigger className={styles.accordionTrigger}>
                    <span>OKLCH Perceptual Uniformity</span>
                    <CaretDown className={styles.accordionChevron} size={16} weight="bold" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className={styles.accordionPanel}>
                  OKLCH aligns with human visual perception. Equal lightness increments produce uniform perceived contrast across different hues, eliminating dark mode clipping.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="item-2" className={styles.accordionItem}>
                <Accordion.Header>
                  <Accordion.Trigger className={styles.accordionTrigger}>
                    <span>Cascade layer priority (@layer)</span>
                    <CaretDown className={styles.accordionChevron} size={16} weight="bold" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className={styles.accordionPanel}>
                  By defining @layer theme, base, components, utilities, selector specificity wars are eliminated regardless of bundler chunk ordering.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="item-3" className={styles.accordionItem}>
                <Accordion.Header>
                  <Accordion.Trigger className={styles.accordionTrigger}>
                    <span>APCA Contrast Certification</span>
                    <CaretDown className={styles.accordionChevron} size={16} weight="bold" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className={styles.accordionPanel}>
                  APCA computes polarity-dependent lightness contrast (Lc). Body text must meet Lc ≥ 75 to pass automated continuous integration checks.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </section>

        {/* Variant 2: Multi-Expand Accordion */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Simultaneous multi-panel expansion</h2>
              <p className={styles.variantSubtitle}>Multiple panels can be opened concurrently</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <Accordion.Root
              aria-label="Multi-panel accordion"
              value={multiValue}
              onValueChange={setMultiValue}
              className={styles.accordionRoot}
            >
              <Accordion.Item value="m-1" className={styles.accordionItem}>
                <Accordion.Header>
                  <Accordion.Trigger className={styles.accordionTrigger}>
                    <span>Touch target minimum (44px)</span>
                    <CaretDown className={styles.accordionChevron} size={16} weight="bold" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className={styles.accordionPanel}>
                  WCAG 2.2 Criterion 2.5.8 requires at least 24px pointer targets, with 44px recommended for mobile touch ergonomics.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="m-2" className={styles.accordionItem}>
                <Accordion.Header>
                  <Accordion.Trigger className={styles.accordionTrigger}>
                    <span>Headless DOM state attributes</span>
                    <CaretDown className={styles.accordionChevron} size={16} weight="bold" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className={styles.accordionPanel}>
                  Styles are attached via [data-panel-open] and [data-panel-closed] selectors, avoiding fragile JavaScript class mutations.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </section>
      </div>
    </div>
  );
};
