import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Switch } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const SwitchDemo: React.FC = () => {
  const [apca, setApca] = useState(true);
  const [settings, setSettings] = useState({ telemetry: true, gate: false, blur: false });
  const flip = (key: keyof typeof settings) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <FluentDemoFrame
      id="switch"
      tagline="Binary toggle that applies a setting immediately. Renders a checkbox input with role=switch and a visible label."
    >
      <DemoCard title="Standard toggle" subtitle="With label, keyboard focus ring, and state tracking">
        <Switch checked={apca} onChange={(_e, d) => setApca(d.checked)} label="Automated APCA validation" />
      </DemoCard>

      <DemoCard title="Label placement" subtitle="The label can sit on either side of the track">
        <Switch defaultChecked label="Label after" />
        <Switch defaultChecked labelPosition="before" label="Label before" />
      </DemoCard>

      <DemoCard title="Semantic states" subtitle="Brand on and off">
        <Switch defaultChecked label="Production health check" />
        <Switch label="Emergency circuit trip" />
      </DemoCard>

      <DemoCard title="Disabled states" subtitle="disabled attribute with reduced emphasis">
        <Switch disabled label="Locked (off)" />
        <Switch disabled defaultChecked label="Locked (on)" />
      </DemoCard>

      <DemoCard title="Application governance settings list" subtitle="Real-world composition in settings cards" column>
        <div className={styles.stack}>
          <Switch checked={settings.telemetry} onChange={() => flip('telemetry')} label="Telemetry emission" />
          <p className={styles.readout}>Stream real-time APCA metrics to local session storage</p>
          <Switch checked={settings.gate} onChange={() => flip('gate')} label="Strict APCA Lc 75 gate" />
          <p className={styles.readout}>Fail compilation if text contrast violates perceptual thresholds</p>
          <Switch checked={settings.blur} onChange={() => flip('blur')} label="Kinetic GPU motion blur" />
          <p className={styles.readout}>Enable CSS filter transitions between subpage routes</p>
        </div>
      </DemoCard>
    </FluentDemoFrame>
  );
};
