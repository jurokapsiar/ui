import React, { useId, useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Tab, TabList } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

const PANELS: Record<string, string> = {
  tokens: 'Colour, radius, spacing and shadow tokens are defined once and read by every component.',
  contrast: 'Body text is checked for at least 4.5 to 1 and interface components for at least 3 to 1.',
  export: 'Export the active preset as a cascade layer, a themed CSS module or DTCG JSON.',
};
const TABS = [
  { value: 'tokens', label: 'Tokens' },
  { value: 'contrast', label: 'Contrast' },
  { value: 'export', label: 'Export' },
];
const SEGMENTS = [
  { value: 'all', label: 'All' },
  { value: 'passing', label: 'Passing' },
  { value: 'failing', label: 'Failing' },
];

interface LinkedTabsProps {
  idPrefix: string;
  label: string;
  items: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  appearance?: 'underline' | 'segmented';
  panel: (value: string) => React.ReactNode;
}

/** Tabs and the panel share id, aria-controls and aria-labelledby so each side names the other. */
const LinkedTabs: React.FC<LinkedTabsProps> = ({ idPrefix, label, items, selected, onSelect, appearance, panel }) => (
  <>
    <TabList
      appearance={appearance}
      selectedValue={selected}
      onTabSelect={(_e, d) => onSelect(String(d.value))}
      aria-label={label}
    >
      {items.map((item) => (
        <Tab
          key={item.value}
          value={item.value}
          id={`${idPrefix}-tab-${item.value}`}
          aria-controls={`${idPrefix}-panel-${item.value}`}
        >
          {item.label}
        </Tab>
      ))}
    </TabList>
    {items.map((item) => (
      <div
        key={item.value}
        role="tabpanel"
        id={`${idPrefix}-panel-${item.value}`}
        aria-labelledby={`${idPrefix}-tab-${item.value}`}
        tabIndex={0}
        hidden={item.value !== selected}
        className={styles.tabPanel}
      >
        {panel(item.value)}
      </div>
    ))}
  </>
);

export const TabsDemo: React.FC = () => {
  const uid = useId();
  const [underline, setUnderline] = useState('tokens');
  const [segment, setSegment] = useState('all');

  return (
    <FluentDemoFrame
      id="tabs"
      tagline="Keyboard-navigable tabbed interfaces with arrow key cycling and an active indicator."
    >
      <DemoCard title="Underline navigation tabs" subtitle="Classic underline indicator with active border alignment" column>
        <LinkedTabs
          idPrefix={`${uid}-u`}
          label="Design system sections"
          items={TABS}
          selected={underline}
          onSelect={setUnderline}
          panel={(v) => PANELS[v]}
        />
      </DemoCard>

      <DemoCard title="Segmented control tabs" subtitle="Functional filter button group with active surface card" column>
        <LinkedTabs
          idPrefix={`${uid}-s`}
          label="Filter results"
          items={SEGMENTS}
          selected={segment}
          onSelect={setSegment}
          appearance="segmented"
          panel={(v) => `Showing ${v} checks.`}
        />
      </DemoCard>
    </FluentDemoFrame>
  );
};
