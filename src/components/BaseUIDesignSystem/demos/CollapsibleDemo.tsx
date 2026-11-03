import React, { useState } from 'react';
import { Collapsible } from '../../../design-system/base';
import styles from './BaseUIDemos.module.css';

export const CollapsibleDemo: React.FC = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(true);

  return (
    <div className={styles.demoPageContainer}>
      <header className={styles.demoHeader}>
        <div className={styles.metaRow}>
          <span>Navigation & Layout</span>
          <span aria-hidden="true">·</span>
          <span>@base-ui-components/react/collapsible</span>
        </div>
        <h1 className={styles.componentTitle}>Collapsible</h1>
        <p className={styles.componentTagline}>
          Standalone animated disclosure primitive. Measures content dimensions automatically for hardware-accelerated expand and collapse transitions without JavaScript layout recalculation.
        </p>
        <div className={styles.contractStrip}>
          <span className="font-semibold text-xs">Compound Parts:</span>
          <code className={styles.contractBadge}>Collapsible.Root</code>
          <code className={styles.contractBadge}>Collapsible.Trigger</code>
          <code className={styles.contractBadge}>Collapsible.Panel</code>
          <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">State: [data-open] / [data-closed]</span>
        </div>
      </header>

      <div className={styles.variantGrid}>
        {/* Variant 1: Standalone Panel */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Standalone disclosure panel</h2>
              <p className={styles.variantSubtitle}>Collapsible card with animated toggle indicator</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <Collapsible.Root open={open1} onOpenChange={setOpen1}>
              <Collapsible.Trigger>
                <span>Cascade layer precedence rules</span>
                <span className="font-mono text-xs text-[var(--ds-brand-ink,#2563eb)]">
                  {open1 ? 'Hide' : 'Expand'}
                </span>
              </Collapsible.Trigger>
              <Collapsible.Panel>
                Styles declared inside later layers override earlier ones regardless of specificity:
                <div className="font-mono text-xs mt-2 p-2 rounded bg-[var(--color-neutral-surface,#f4f4f6)] border border-[var(--color-neutral-border,rgba(0,0,0,0.1))]">
                  @layer theme &lt; base &lt; components &lt; utilities;
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
          </div>
        </section>

        {/* Variant 2: Token Schema Inspector */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Token payload inspector</h2>
              <p className={styles.variantSubtitle}>Default open state with raw schema preview</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <Collapsible.Root open={open2} onOpenChange={setOpen2}>
              <Collapsible.Trigger>
                <span className="font-mono text-xs">OKLCH Theme Invariants</span>
                <span className="font-mono text-xs text-[var(--ds-brand-ink,#2563eb)]">
                  {open2 ? 'Collapse JSON' : 'Show JSON'}
                </span>
              </Collapsible.Trigger>
              <Collapsible.Panel>
                <pre className="font-mono text-xs p-2 rounded bg-[var(--color-neutral-surface,#f4f4f6)] border border-[var(--color-neutral-border,rgba(0,0,0,0.1))] overflow-x-auto text-[var(--color-neutral-text,#111113)]">
{`{
  "$schema": "https://www.designtokens.org/tr/2025.10/format/",
  "color": {
    "brand": {
      "primary": { "$value": "oklch(0.55 0.22 260)", "$type": "color" },
      "onPrimary": { "$value": "oklch(0.99 0 0)", "$type": "color" }
    }
  }
}`}
                </pre>
              </Collapsible.Panel>
            </Collapsible.Root>
          </div>
        </section>
      </div>
    </div>
  );
};
