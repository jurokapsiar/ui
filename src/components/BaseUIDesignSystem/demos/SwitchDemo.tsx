import React, { useState } from 'react';
import { Switch, SwitchLabel, SwitchText } from '../../../design-system/base';
import styles from './BaseUIDemos.module.css';

export const SwitchDemo: React.FC = () => {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checkedDanger, setCheckedDanger] = useState(true);
  const [checkedSuccess, setCheckedSuccess] = useState(true);

  // Settings list state
  const [telemetry, setTelemetry] = useState(true);
  const [apcaCheck, setApcaCheck] = useState(true);
  const [gpuMotion, setGpuMotion] = useState(false);

  return (
    <div className={styles.demoPageContainer}>
      <header className={styles.demoHeader}>
        <div className={styles.metaRow}>
          <span>Forms & Inputs</span>
          <span aria-hidden="true">·</span>
          <span>@base-ui-components/react/switch</span>
        </div>
        <h1 className={styles.componentTitle}>Switch</h1>
        <p className={styles.componentTagline}>
          Binary toggle that delegates checked state to CSS transitions. Unstyled, communicating state through semantic HTML data attributes.
        </p>
        <div className={styles.contractStrip}>
          <span className="font-semibold text-xs">DOM state attributes:</span>
          <code className={styles.contractBadge}>[data-checked]</code>
          <code className={styles.contractBadge}>[data-unchecked]</code>
          <code className={styles.contractBadge}>[data-disabled]</code>
          <code className={styles.contractBadge}>[data-pressed]</code>
          <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">WAI-ARIA: role="switch"</span>
        </div>
      </header>

      <div className={styles.variantGrid}>
        {/* Variant 1: Interactive Standard Switch */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Standard toggle</h2>
              <p className={styles.variantSubtitle}>With label, keyboard focus ring, and state tracking</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <SwitchLabel>
              <SwitchText>Automated APCA validation</SwitchText>
              <Switch.Root
                checked={checked1}
                onCheckedChange={setChecked1}
                aria-label="Automated APCA validation"
              >
                <Switch.Thumb />
              </Switch.Root>
            </SwitchLabel>
          </div>
        </section>

        {/* Variant 2: Sizing Scale */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Dimensional sizing scale</h2>
              <p className={styles.variantSubtitle}>Small (18px), Standard (24px), Large (30px)</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs">
                <span>Sm</span>
                <Switch.Root
                  checked={checked2}
                  onCheckedChange={setChecked2}
                  data-size="small"
                  aria-label="Small switch"
                >
                  <Switch.Thumb />
                </Switch.Root>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <span>Md</span>
                <Switch.Root
                  checked={checked2}
                  onCheckedChange={setChecked2}
                  aria-label="Medium switch"
                >
                  <Switch.Thumb />
                </Switch.Root>
              </label>

              <label className="flex items-center gap-2 text-base">
                <span>Lg</span>
                <Switch.Root
                  checked={checked2}
                  onCheckedChange={setChecked2}
                  data-size="large"
                  aria-label="Large switch"
                >
                  <Switch.Thumb />
                </Switch.Root>
              </label>
            </div>
          </div>
        </section>

        {/* Variant 3: Semantic Status Tones */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Semantic colour accents</h2>
              <p className={styles.variantSubtitle}>Brand primary, critical danger, and verified success</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex flex-col gap-3">
              <SwitchLabel>
                <SwitchText>Emergency circuit trip</SwitchText>
                <Switch.Root
                  checked={checkedDanger}
                  onCheckedChange={setCheckedDanger}
                  data-tone="danger"
                  aria-label="Emergency circuit trip"
                >
                  <Switch.Thumb />
                </Switch.Root>
              </SwitchLabel>

              <SwitchLabel>
                <SwitchText>Production health check</SwitchText>
                <Switch.Root
                  checked={checkedSuccess}
                  onCheckedChange={setCheckedSuccess}
                  data-tone="success"
                  aria-label="Production health check"
                >
                  <Switch.Thumb />
                </Switch.Root>
              </SwitchLabel>
            </div>
          </div>
        </section>

        {/* Variant 4: Disabled States */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Disabled states</h2>
              <p className={styles.variantSubtitle}>[data-disabled] attribute with reduced opacity</p>
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex items-center gap-8">
              <SwitchLabel>
                <SwitchText>Locked (off)</SwitchText>
                <Switch.Root
                  checked={false}
                  disabled
                  aria-label="Locked switch off"
                >
                  <Switch.Thumb />
                </Switch.Root>
              </SwitchLabel>

              <SwitchLabel>
                <SwitchText>Locked (on)</SwitchText>
                <Switch.Root
                  checked={true}
                  disabled
                  aria-label="Locked switch on"
                >
                  <Switch.Thumb />
                </Switch.Root>
              </SwitchLabel>
            </div>
          </div>
        </section>
      </div>

      {/* Realistic Settings Row Pattern */}
      <section className={styles.variantCard}>
        <div className={styles.variantCardHeader}>
          <div>
            <h2 className={styles.variantTitle}>Application governance settings</h2>
            <p className={styles.variantSubtitle}>Real-world composition in settings cards</p>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-[var(--color-neutral-border,rgba(0,0,0,0.08))]">
          <div className="flex items-center justify-between py-3">
            <div>
              <div id="sw-telemetry" className="text-sm font-semibold text-[var(--color-neutral-text,#111113)]">Telemetry emission</div>
              <div className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">Stream real-time APCA metrics to local session storage</div>
            </div>
            <Switch.Root
              checked={telemetry}
              onCheckedChange={setTelemetry}
              aria-labelledby="sw-telemetry"
            >
              <Switch.Thumb />
            </Switch.Root>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div id="sw-apca" className="text-sm font-semibold text-[var(--color-neutral-text,#111113)]">Strict APCA Lc ≥ 75 gate</div>
              <div className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">Fail compilation if text contrast violates perceptual thresholds</div>
            </div>
            <Switch.Root
              checked={apcaCheck}
              onCheckedChange={setApcaCheck}
              aria-labelledby="sw-apca"
            >
              <Switch.Thumb />
            </Switch.Root>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div id="sw-motion" className="text-sm font-semibold text-[var(--color-neutral-text,#111113)]">Route transition blur</div>
              <div className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">Enable CSS filter transitions between subpage routes</div>
            </div>
            <Switch.Root
              checked={gpuMotion}
              onCheckedChange={setGpuMotion}
              aria-labelledby="sw-motion"
            >
              <Switch.Thumb />
            </Switch.Root>
          </div>
        </div>
      </section>
    </div>
  );
};
