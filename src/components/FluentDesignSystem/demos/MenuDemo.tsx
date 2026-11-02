import React, { useState } from 'react';
import { MoreHorizontal20Regular } from '@fluentui/react-icons';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Button, Menu, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const MenuDemo: React.FC = () => {
  const [last, setLast] = useState('None yet');
  const pick = (name: string) => () => setLast(name);

  return (
    <FluentDemoFrame
      id="menu"
      tagline="Action menu with arrow key cycling, typeahead and a top-layer popup."
    >
      <DemoCard title="Action dropdown menu" subtitle="Full keyboard arrow navigation and divider separators" column>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="outline">Token actions</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={pick('Export @layer theme')}>Export @layer theme</MenuItem>
              <MenuItem onClick={pick('Validate APCA Lc')}>Validate APCA Lc</MenuItem>
              <MenuItem onClick={pick('Sync token schema')}>Sync token schema</MenuItem>
              <MenuDivider />
              <MenuItem disabled>Publish (read-only)</MenuItem>
              <MenuItem onClick={pick('Purge cache')}>Purge cache</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <p className={styles.readout} aria-live="polite">Last action: {last}</p>
        {last === 'Purge cache' && (
          <Button appearance="subtle" onClick={() => setLast('Purge undone')}>Undo purge</Button>
        )}
      </DemoCard>

      <DemoCard title="Overflow actions menu" subtitle="Icon button trigger for card or table row contexts">
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle" icon={<MoreHorizontal20Regular />} aria-label="More actions" />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Copy hex code</MenuItem>
              <MenuItem>Copy OKLCH value</MenuItem>
              <MenuItem>Duplicate swatch</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <span className={styles.readout}>OKLCH brand swatch · oklch(0.55 0.22 260)</span>
      </DemoCard>
    </FluentDemoFrame>
  );
};
