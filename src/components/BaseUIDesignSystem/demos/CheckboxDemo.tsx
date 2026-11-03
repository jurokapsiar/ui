import React, { useState } from 'react';
import { Checkbox, CheckboxCard, CheckboxLabel } from '../../../design-system/base';
import { Check, Minus } from '../../Icons/phosphor';
import styles from './BaseUIDemos.module.css';

export const CheckboxDemo: React.FC = () => {
  const [checked1, setChecked1] = useState(true);
  const [compact, setCompact] = useState(false);
  const [items, setItems] = useState({
    apca: true,
    layers: true,
    zeroPills: false,
  });

  const allChecked = items.apca && items.layers && items.zeroPills;
  const someChecked = items.apca || items.layers || items.zeroPills;
  const parentState: boolean | 'indeterminate' = allChecked ? true : someChecked ? 'indeterminate' : false;

  const handleParentChange = (val: boolean | 'indeterminate') => {
    const nextVal = val === true;
    setItems({ apca: nextVal, layers: nextVal, zeroPills: nextVal });
  };

  return (
    <div className={styles.demoPageContainer}>
      <header className={styles.demoHeader}>
        <div className={styles.metaRow}>
          <span>Forms & Inputs</span>
          <span aria-hidden="true">·</span>
          <span>@base-ui-components/react/checkbox</span>
        </div>
        <h1 className={styles.componentTitle}>Checkbox</h1>
        <p className={styles.componentTagline}>
          Tristate binary or indeterminate selection primitive. Compliant with WAI-ARIA checkbox patterns with native keyboard Space toggling and clean data attributes.
        </p>
        <div className={styles.contractStrip}>
          <span className="font-semibold text-xs">DOM state attributes:</span>
          <code className={styles.contractBadge}>[data-checked]</code>
          <code className={styles.contractBadge}>[data-unchecked]</code>
          <code className={styles.contractBadge}>[data-indeterminate]</code>
          <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">WAI-ARIA: role="checkbox"</span>
        </div>
      </header>

      <div className={styles.variantGrid}>
        {/* Variant 1: Basic Checkbox */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Standard checkbox</h2>
              <p className={styles.variantSubtitle}>With label, keyboard focus ring, and state tracking</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <CheckboxLabel>
              <Checkbox.Root
                checked={checked1}
                onCheckedChange={setChecked1}
                aria-label="Enforce OKLCH token uniformity"
              >
                <Checkbox.Indicator>
                  <Check size={12} weight="bold" aria-hidden="true" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="text-sm font-medium text-[var(--color-neutral-text,#111113)]">
                Enforce OKLCH token uniformity
              </span>
            </CheckboxLabel>
          </div>
        </section>

        {/* Variant 2: Tristate Parent/Child Indeterminate Checkbox */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Parent-child indeterminate state</h2>
              <p className={styles.variantSubtitle}>Maps partial group selection to aria-checked="mixed"</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {/* Parent Checkbox */}
              <CheckboxLabel>
                <Checkbox.Root
                  checked={parentState === true}
                  indeterminate={parentState === 'indeterminate'}
                  onCheckedChange={handleParentChange}
                  aria-label="Select all quality checks"
                >
                  <Checkbox.Indicator>
                    {parentState === 'indeterminate' ? (
                      <Minus size={10} weight="bold" aria-hidden="true" />
                    ) : (
                      <Check size={12} weight="bold" aria-hidden="true" />
                    )}
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-sm font-bold text-[var(--color-neutral-text,#111113)]">
                  Select all quality checks
                </span>
              </CheckboxLabel>

              {/* Children Checkboxes */}
              <div className="flex flex-col gap-1 ps-6">
                  <CheckboxLabel className="text-xs text-[var(--color-neutral-text,#111113)]">
                  <Checkbox.Root
                    checked={items.apca}
                    onCheckedChange={(val) => setItems((p) => ({ ...p, apca: val === true }))}
                    aria-label="APCA contrast verification"
                  >
                    <Checkbox.Indicator>
                      <Check size={12} weight="bold" aria-hidden="true" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span>APCA contrast verification</span>
                  </CheckboxLabel>

                <CheckboxLabel className="text-xs text-[var(--color-neutral-text,#111113)]">
                  <Checkbox.Root
                    checked={items.layers}
                    onCheckedChange={(val) => setItems((p) => ({ ...p, layers: val === true }))}
                    aria-label="Cascade layer ordering"
                  >
                    <Checkbox.Indicator>
                      <Check size={12} weight="bold" aria-hidden="true" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span>Cascade layer ordering</span>
                </CheckboxLabel>

                <CheckboxLabel className="text-xs text-[var(--color-neutral-text,#111113)]">
                  <Checkbox.Root
                    checked={items.zeroPills}
                    onCheckedChange={(val) => setItems((p) => ({ ...p, zeroPills: val === true }))}
                    aria-label="Zero-pill metadata filter"
                  >
                    <Checkbox.Indicator>
                      <Check size={12} weight="bold" aria-hidden="true" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span>Zero-pill metadata filter</span>
                </CheckboxLabel>
              </div>
            </div>
          </div>
        </section>

        {/* Variant 3: Card Selection Checkbox */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Selectable card checkbox</h2>
              <p className={styles.variantSubtitle}>Full card boundary with active outline highlight</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <CheckboxCard className="w-full max-w-sm">
              <Checkbox.Root
                checked={compact}
                onCheckedChange={setCompact}
                aria-label="Compact grid"
              >
                <Checkbox.Indicator>
                  <Check size={12} weight="bold" aria-hidden="true" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div>
                <div className="text-sm font-bold text-[var(--color-neutral-text,#111113)]">
                  Compact grid
                </div>
                <div className="text-xs text-[var(--color-neutral-text-muted,#71717a)] mt-1 leading-relaxed">
                  Tightens the spacing scale to show more tabular data on wide displays.
                </div>
              </div>
            </CheckboxCard>
          </div>
        </section>

        {/* Variant 4: Disabled Checkboxes */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Disabled states</h2>
              <p className={styles.variantSubtitle}>[data-disabled] with cursor suppression</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex items-center gap-6">
              <CheckboxLabel>
                <Checkbox.Root checked={false} disabled aria-label="Disabled unchecked">
                  <Checkbox.Indicator>
                    <Check size={12} weight="bold" aria-hidden="true" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">Disabled unchecked</span>
              </CheckboxLabel>

              <CheckboxLabel>
                <Checkbox.Root checked={true} disabled aria-label="Disabled checked">
                  <Checkbox.Indicator>
                    <Check size={12} weight="bold" aria-hidden="true" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">Disabled checked</span>
              </CheckboxLabel>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
