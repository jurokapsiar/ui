import React from 'react';
import { Tooltip } from '../../../design-system/base';
import { Info } from '../../Icons/phosphor';
import styles from './BaseUIDemos.module.css';

export const TooltipDemo: React.FC = () => {
  return (
    <div className={styles.demoPageContainer}>
      <header className={styles.demoHeader}>
        <div className={styles.metaRow}>
          <span>Overlays & Floating</span>
          <span aria-hidden="true">·</span>
          <span>@base-ui-components/react/tooltip</span>
        </div>
        <h1 className={styles.componentTitle}>Tooltip</h1>
        <p className={styles.componentTagline}>
          Contextual micro-hint popup triggered by pointer hover or keyboard focus. Built with intelligent delay intervals and screen reader aria-describedby associations.
        </p>
        <div className={styles.contractStrip}>
          <span className="font-semibold text-xs">Compound Parts:</span>
          <code className={styles.contractBadge}>Tooltip.Root</code>
          <code className={styles.contractBadge}>Tooltip.Trigger</code>
          <code className={styles.contractBadge}>Tooltip.Portal</code>
          <code className={styles.contractBadge}>Tooltip.Positioner</code>
          <code className={styles.contractBadge}>Tooltip.Popup</code>
          <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">WAI-ARIA: role="tooltip"</span>
        </div>
      </header>

      <div className={styles.variantGrid}>
        {/* Variant 1: Directional Sides */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Directional placements</h2>
              <p className={styles.variantSubtitle}>Top, Bottom, Left, Right with automatic viewport collision detection</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <Tooltip.Provider delay={150}>
              <div className="flex flex-wrap items-center gap-4">
                {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                  <Tooltip.Root key={side}>
                    <Tooltip.Trigger>
                      <span>Hover: {side}</span>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Positioner side={side} sideOffset={6}>
                        <Tooltip.Popup>
                          Tooltip on {side} axis
                        </Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ))}
              </div>
            </Tooltip.Provider>
          </div>
        </section>

        {/* Variant 2: Keyboard Focus Tooltip */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Keyboard focus access</h2>
              <p className={styles.variantSubtitle}>Tab into the button to reveal tooltip via :focus-visible</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <Tooltip.Provider delay={100}>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Info size={14} weight="bold" aria-hidden="true" />
                  <span>Focus or Hover Me</span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner side="top" sideOffset={8}>
                    <Tooltip.Popup style={{ maxWidth: 220, textAlign: 'center' }}>
                      Announced by screen readers via native aria-describedby binding
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </section>
      </div>
    </div>
  );
};
