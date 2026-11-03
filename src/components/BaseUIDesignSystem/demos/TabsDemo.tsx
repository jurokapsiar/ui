import React, { useState } from 'react';
import { Tabs } from '../../../design-system/base';
import styles from './BaseUIDemos.module.css';

export const TabsDemo: React.FC = () => {
  const [activeTab1, setActiveTab1] = useState<string | number>('overview');
  const [activeTab2, setActiveTab2] = useState<string | number>('tokens');

  return (
    <div className={styles.demoPageContainer}>
      <header className={styles.demoHeader}>
        <div className={styles.metaRow}>
          <span>Navigation & Layout</span>
          <span aria-hidden="true">·</span>
          <span>@base-ui-components/react/tabs</span>
        </div>
        <h1 className={styles.componentTitle}>Tabs</h1>
        <p className={styles.componentTagline}>
          Keyboard-navigable tabbed interfaces. Provides roving tabindex, arrow key cycling, and automatic panel pairing via Tabs.Root, Tabs.List, Tabs.Tab, and Tabs.Panel.
        </p>
        <div className={styles.contractStrip}>
          <span className="font-semibold text-xs">Compound Parts:</span>
          <code className={styles.contractBadge}>Tabs.Root</code>
          <code className={styles.contractBadge}>Tabs.List</code>
          <code className={styles.contractBadge}>Tabs.Tab</code>
          <code className={styles.contractBadge}>Tabs.Panel</code>
          <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">WAI-ARIA: role="tablist"</span>
        </div>
      </header>

      <div className={styles.variantGrid}>
        {/* Variant 1: Underline Indicator Tabs */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Underline navigation tabs</h2>
              <p className={styles.variantSubtitle}>Classic editorial underline indicator with active border alignment</p>
            </div>
          </div>
          <div className={styles.previewArea}>
              <Tabs.Root value={activeTab1} onValueChange={setActiveTab1}>
              <Tabs.List aria-label="Documentation sections">
                <Tabs.Tab value="overview">
                  Overview
                </Tabs.Tab>
                <Tabs.Tab value="specifications">
                  Specifications
                </Tabs.Tab>
                <Tabs.Tab value="telemetry">
                  Telemetry
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview">
                Base UI decouples component logic from opinionated styling engines. Primitives maintain full WAI-ARIA conformance and expose state via HTML data attributes.
              </Tabs.Panel>
              <Tabs.Panel value="specifications">
                Tokens are structured in @layer theme, and styles are encapsulated in @layer components.&lt;primitive&gt; to guarantee deterministic cascade specificity.
              </Tabs.Panel>
              <Tabs.Panel value="telemetry">
                Perceptual contrast verification runs in real-time, enforcing APCA Lc ≥ 75 for body text and 44px pointer touch targets.
              </Tabs.Panel>
            </Tabs.Root>
          </div>
        </section>

        {/* Variant 2: Segmented Pill Control */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Segmented control tabs</h2>
              <p className={styles.variantSubtitle}>Functional filter button group with active surface card</p>
            </div>
          </div>
          <div className={styles.previewArea}>
              <Tabs.Root value={activeTab2} onValueChange={setActiveTab2}>
              <Tabs.List data-variant="segmented" aria-label="Token filters">
                <Tabs.Tab value="tokens" data-variant="segmented">
                  Tokens
                </Tabs.Tab>
                <Tabs.Tab value="layers" data-variant="segmented">
                  Cascade Layers
                </Tabs.Tab>
                <Tabs.Tab value="accessibility" data-variant="segmented">
                  Accessibility
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="tokens">
                Active OKLCH ramps: Brand Primary, On-Primary, Neutral Surface, and 4px grid spacing scales.
              </Tabs.Panel>
              <Tabs.Panel value="layers">
                Evaluation order: @layer theme &lt; @layer base &lt; @layer components &lt; @layer utilities.
              </Tabs.Panel>
              <Tabs.Panel value="accessibility">
                Audited against WCAG 2.2 Criterion 2.5.8 (Pointer Target Spacing) and APCA 0.98G-4g.
              </Tabs.Panel>
            </Tabs.Root>
          </div>
        </section>
      </div>
    </div>
  );
};
