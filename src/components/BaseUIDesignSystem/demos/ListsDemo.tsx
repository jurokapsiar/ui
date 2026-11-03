import React, { useRef, useState } from 'react';
import { Bell, Check, Envelope, File, Folder } from '../../Icons/phosphor';
import { List, ListHeadline, ListItem, ListLead, ListMeta, ListOption, ListSupport, ListText } from '../../../design-system/base';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

const ITEMS = [
  { id: 'tokens', icon: Folder, headline: 'Design tokens', support: 'Colour, radius and spacing variables', meta: '24 files' },
  { id: 'report', icon: File, headline: 'Contrast report', support: 'Measured from computed colours', meta: '2 days ago' },
  { id: 'inbox', icon: Envelope, headline: 'Review requests', support: 'Waiting on two approvals', meta: '3 new' },
  { id: 'alerts', icon: Bell, headline: 'Build alerts', support: 'Lint and unit tests', meta: 'Muted' },
];

export const ListsDemo: React.FC = () => {
  const [selected, setSelected] = useState('report');
  const listRef = useRef<HTMLUListElement>(null);

  const moveFocus = (e: React.KeyboardEvent, index: number) => {
    let next = -1;
    if (e.key === 'ArrowDown') next = Math.min(index + 1, ITEMS.length - 1);
    else if (e.key === 'ArrowUp') next = Math.max(index - 1, 0);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = ITEMS.length - 1;
    if (next === -1) return;
    e.preventDefault();
    listRef.current?.querySelectorAll<HTMLElement>('[role="option"]')[next]?.focus();
  };

  return (
    <DemoFrame
      category="Navigation & Layout"
      packageName="native ul / li, role=&quot;listbox&quot;"
      title="Lists"
      tagline="Rows with a leading icon, headline, supporting text and trailing meta. A selectable variant keeps one row chosen."
      contractLabel="DOM state attributes:"
      contract={['[aria-selected]', 'role="listbox"']}
      contractNote="Arrow, Home and End keys"
    >
      <DemoCard title="Three-part list" subtitle="Leading icon, headline with supporting text, trailing meta" column>
        <List aria-label="Project files">
          {ITEMS.map(({ id, icon: Icon, headline, support, meta }) => (
            <ListItem key={id}>
              <ListLead>
                <Icon size={20} aria-hidden="true" />
              </ListLead>
              <ListText>
                <ListHeadline>{headline}</ListHeadline>
                <ListSupport>{support}</ListSupport>
              </ListText>
              <ListMeta>{meta}</ListMeta>
            </ListItem>
          ))}
        </List>
      </DemoCard>

      <DemoCard title="Selectable list" subtitle="Single selection with roving focus and a selected tint" column>
        <List role="listbox" aria-label="Choose a report" ref={listRef}>
          {ITEMS.map(({ id, icon: Icon, headline, support, meta }, index) => {
            const isSelected = selected === id;
            return (
              <li key={id} role="presentation">
                <ListOption
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelected(id)}
                  onKeyDown={(e) => moveFocus(e, index)}
                >
                  <ListLead>
                    <Icon size={20} aria-hidden="true" />
                  </ListLead>
                  <ListText>
                    <ListHeadline>{headline}</ListHeadline>
                    <ListSupport>{support}</ListSupport>
                  </ListText>
                  <ListMeta>{isSelected ? <Check size={16} weight="bold" aria-label="Selected" /> : meta}</ListMeta>
                </ListOption>
              </li>
            );
          })}
        </List>
      </DemoCard>
    </DemoFrame>
  );
};
