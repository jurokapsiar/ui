import React, { useState } from 'react';
import { Slider } from '../../../design-system/base';
import styles from './BaseUIDemos.module.css';

export const SliderDemo: React.FC = () => {
  const [singleVal, setSingleVal] = useState<number | readonly number[]>(65);
  const [steppedVal, setSteppedVal] = useState<number | readonly number[]>(40);
  const [rangeVal, setRangeVal] = useState<number | readonly number[]>([25, 75]);

  return (
    <div className={styles.demoPageContainer}>
      <header className={styles.demoHeader}>
        <div className={styles.metaRow}>
          <span>Forms & Inputs</span>
          <span aria-hidden="true">·</span>
          <span>@base-ui-components/react/slider</span>
        </div>
        <h1 className={styles.componentTitle}>Slider</h1>
        <p className={styles.componentTagline}>
          Numeric slider supporting keyboard arrows, pointer dragging, step quantization and dual-thumb range selection, with no built-in styling.
        </p>
        <div className={styles.contractStrip}>
          <span className="font-semibold text-xs">Compound parts:</span>
          <code className={styles.contractBadge}>Slider.Root</code>
          <code className={styles.contractBadge}>Slider.Track</code>
          <code className={styles.contractBadge}>Slider.Indicator</code>
          <code className={styles.contractBadge}>Slider.Thumb</code>
          <span className="ms-auto font-mono text-xs text-[var(--color-neutral-text-muted,#71717a)]">WAI-ARIA: role="slider"</span>
        </div>
      </header>

      <div className={styles.variantGrid}>
        {/* Variant 1: Single Continuous Slider */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Continuous value slider</h2>
              <p className={styles.variantSubtitle}>Smooth 0 to 100 range with live percentage feedback</p>
            </div>
            <div className="font-mono font-bold text-sm text-[var(--ds-brand-ink,#2563eb)]">
              {Array.isArray(singleVal) ? singleVal[0] : singleVal}%
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex flex-col items-center gap-3">
              <Slider.Root
                value={singleVal}
                onValueChange={setSingleVal}
                min={0}
                max={100}
                aria-label="Continuous percentage"
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb aria-label="Continuous percentage" />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
              <div className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">
                Keyboard accessible via <kbd className="px-1 border rounded bg-[var(--color-neutral-bg,#ffffff)] text-[var(--color-neutral-text,#111113)] font-mono">←</kbd> and <kbd className="px-1 border rounded bg-[var(--color-neutral-bg,#ffffff)] text-[var(--color-neutral-text,#111113)] font-mono">→</kbd>
              </div>
            </div>
          </div>
        </section>

        {/* Variant 2: Stepped / Discrete Slider */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Stepped discrete quantization</h2>
              <p className={styles.variantSubtitle}>Discrete jumps in increments of 20 with tick marks</p>
            </div>
            <div className="font-mono font-bold text-sm text-[var(--ds-brand-ink,#2563eb)]">
              Step: {Array.isArray(steppedVal) ? steppedVal[0] : steppedVal}
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex flex-col items-center gap-2">
              <Slider.Root
                value={steppedVal}
                onValueChange={setSteppedVal}
                min={0}
                max={100}
                step={20}
                aria-label="Stepped value"
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb aria-label="Stepped value" />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
              <div className="flex justify-between w-[240px] text-xs text-[var(--color-neutral-text-muted,#71717a)] font-mono">
                <span>0</span>
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </section>

        {/* Variant 3: Dual Thumb Range Slider */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Dual-thumb range slider</h2>
              <p className={styles.variantSubtitle}>Select minimum and maximum thresholds</p>
            </div>
            <div className="font-mono font-bold text-sm text-[var(--ds-brand-ink,#2563eb)]">
              {Array.isArray(rangeVal) ? `${rangeVal[0]}ms – ${rangeVal[1]}ms` : `${rangeVal}ms`}
            </div>
          </div>
          <div className={styles.previewArea}>
            <div className="flex flex-col items-center gap-2">
              <Slider.Root
                value={rangeVal}
                onValueChange={setRangeVal}
                min={0}
                max={100}
                aria-label="Latency range"
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb aria-label="Minimum latency" index={0} />
                    <Slider.Thumb aria-label="Maximum latency" index={1} />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
              <span className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">
                Animation latency budget
              </span>
            </div>
          </div>
        </section>

        {/* Variant 4: Disabled Slider */}
        <section className={styles.variantCard}>
          <div className={styles.variantCardHeader}>
            <div>
              <h2 className={styles.variantTitle}>Disabled state</h2>
              <p className={styles.variantSubtitle}>Read-only frozen state with pointer events suppressed</p>
            </div>
            <span className="text-xs font-mono text-[var(--color-neutral-text-muted,#71717a)]">Locked at 50%</span>
          </div>
          <div className={styles.previewArea}>
            <Slider.Root
              value={50}
              disabled
              aria-label="Locked level"
            >
              <Slider.Control className="opacity-50 cursor-not-allowed">
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb aria-label="Locked level" />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
        </section>
      </div>
    </div>
  );
};
