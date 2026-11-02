import React, { useState } from 'react';
import { Alert20Regular, Checkmark20Regular, Document20Regular, Folder20Regular, Mail20Regular } from '@fluentui/react-icons';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { List, ListItem, ListRow } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';

const ITEMS = [
  { id: 'tokens', icon: <Folder20Regular />, headline: 'Design tokens', support: 'Colour, radius and spacing variables', meta: '24 files' },
  { id: 'report', icon: <Document20Regular />, headline: 'Contrast report', support: 'Measured from computed colours', meta: '2 days ago' },
  { id: 'inbox', icon: <Mail20Regular />, headline: 'Review requests', support: 'Waiting on two approvals', meta: '3 new' },
  { id: 'alerts', icon: <Alert20Regular />, headline: 'Build alerts', support: 'Lint and unit tests', meta: 'Muted' },
];

export const ListsDemo: React.FC = () => {
  const [selected, setSelected] = useState<Array<string | number>>(['report']);

  return (
    <FluentDemoFrame
      id="lists"
      tagline="Rows with a leading icon, headline, supporting text and trailing meta. A selectable variant keeps one row chosen."
    >
      <DemoCard title="Three-part list" subtitle="Leading icon, headline with supporting text, trailing meta" column>
        <List aria-label="Project files">
          {ITEMS.map((item) => (
            <ListItem key={item.id} value={item.id}>
              <ListRow {...item} />
            </ListItem>
          ))}
        </List>
      </DemoCard>

      <DemoCard title="Selectable list" subtitle="Single selection with roving focus and a selected tint" column>
        <List
          aria-label="Choose a report"
          selectionMode="single"
          selectedItems={selected}
          onSelectionChange={(_e, data) => setSelected(data.selectedItems)}
        >
          {ITEMS.map((item) => (
            <ListItem key={item.id} value={item.id} checkmark={null}>
              <ListRow {...item} meta={selected.includes(item.id) ? <Checkmark20Regular role="img" aria-label="Selected" /> : item.meta} />
            </ListItem>
          ))}
        </List>
      </DemoCard>
    </FluentDemoFrame>
  );
};
