import React, { useId, useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Slider } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const SliderDemo: React.FC = () => {
  const ids = { value: useId(), stepped: useId(), low: useId(), high: useId(), off: useId() };
  const [value, setValue] = useState(40);
  const [stepped, setStepped] = useState(60);
  const [low, setLow] = useState(20);
  const [high, setHigh] = useState(80);

  return (
    <FluentDemoFrame
      id="slider"
      tagline="Numeric slider with keyboard arrows, pointer dragging and step quantization. The headless package has no dual-thumb slider, so the range uses two sliders clamped to each other."
    >
      <DemoCard title="Continuous value slider" subtitle="Smooth 0 to 100 integer range with live percentage feedback" column>
        <span id={ids.value} className={styles.label}>Percentage</span>
        <Slider
          className={styles.stretch}
          min={0}
          max={100}
          value={value}
          onChange={(_e, d) => setValue(d.value)}
          aria-labelledby={ids.value}
        />
        <p className={styles.readout}>{value}% · Keyboard accessible via arrow keys</p>
      </DemoCard>

      <DemoCard title="Stepped discrete quantization" subtitle="Discrete jumps in increments of 20" column>
        <span id={ids.stepped} className={styles.label}>Quantization step</span>
        <Slider
          className={styles.stretch}
          min={0}
          max={100}
          step={20}
          value={stepped}
          onChange={(_e, d) => setStepped(d.value)}
          aria-labelledby={ids.stepped}
        />
        <p className={styles.readout}>Step {stepped / 20 + 1} of 6 · {stepped}</p>
      </DemoCard>

      <DemoCard title="Range pair" subtitle="Select minimum and maximum threshold intervals" column>
        <div className={styles.rangeRow}>
          <span id={ids.low} className={styles.label}>Minimum latency</span>
          <Slider min={0} max={100} value={low} onChange={(_e, d) => setLow(Math.min(d.value, high))} aria-labelledby={ids.low} />
          <span id={ids.high} className={styles.label}>Maximum latency</span>
          <Slider min={0} max={100} value={high} onChange={(_e, d) => setHigh(Math.max(d.value, low))} aria-labelledby={ids.high} />
        </div>
        <p className={styles.readout}>Latency range {low} to {high} ms</p>
      </DemoCard>

      <DemoCard title="Disabled state" subtitle="Read-only frozen state with pointer events suppressed" column>
        <span id={ids.off} className={styles.label}>Locked level</span>
        <Slider className={styles.stretch} disabled defaultValue={50} aria-labelledby={ids.off} />
        <p className={styles.readout}>Locked at 50%</p>
      </DemoCard>
    </FluentDemoFrame>
  );
};
