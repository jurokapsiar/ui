import React, { useState } from 'react';
import { Menu } from '@base-ui-components/react/menu';
import { CaretDown, DotsThreeVertical } from '../../Icons/phosphor';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

export const MenuDemo: React.FC = () => {
  const [lastAction, setLastAction] = useState<string>('None yet');

  return (
    <DemoFrame
      category="Navigation & Layout"
      packageName="@base-ui-components/react/menu"
      title="Menu"
      tagline="Action dropdown following the WAI-ARIA menu pattern, with arrow key cycling, typeahead and portaled positioning."
      contractLabel="Compound parts:"
      contract={['Menu.Root', 'Menu.Trigger', 'Menu.Popup', 'Menu.Item']}
      contractNote="State: [data-highlighted]"
    >
      <DemoCard title="Action dropdown menu" subtitle="Arrow key navigation, a disabled item and a divider" column>
        <Menu.Root>
          <Menu.Trigger className={styles.popoverTrigger}>
            <span>Token actions</span>
            <CaretDown size={14} weight="bold" aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner side="bottom" align="start" sideOffset={6} className={styles.popoverPositioner}>
              <Menu.Popup className={styles.menuPopup} style={{ width: 220 }}>
                <Menu.Item className={styles.menuItem} onClick={() => setLastAction('Export @layer theme')}>
                  Export @layer theme
                </Menu.Item>
                <Menu.Item className={styles.menuItem} onClick={() => setLastAction('Validate APCA Lc')}>
                  Validate APCA Lc
                </Menu.Item>
                <Menu.Item className={styles.menuItem} onClick={() => setLastAction('Sync token schema')}>
                  Sync token schema
                </Menu.Item>
                <Menu.Separator className="my-1 border-t border-[var(--color-neutral-border,rgba(0,0,0,0.1))]" />
                <Menu.Item disabled className={styles.menuItem}>
                  <span>Publish</span>
                  <span className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">Read-only</span>
                </Menu.Item>
                <Menu.Item
                  className={styles.menuItem}
                  style={{ color: 'color-mix(in oklch, var(--color-danger, #dc2626) 65%, var(--color-neutral-text, #111113))' }}
                  onClick={() => setLastAction('Purge cache')}
                >
                  Purge cache
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          Last action: <strong className="text-[var(--color-neutral-text,#111113)] font-mono">{lastAction}</strong>
        </p>
        {lastAction === 'Purge cache' && (
          <button type="button" className={styles.btn} data-variant="text" onClick={() => setLastAction('Purge undone')}>
            Undo purge
          </button>
        )}
      </DemoCard>

      <DemoCard title="Overflow actions menu" subtitle="Icon button trigger for card or table row contexts">
        <div className="flex items-center justify-between gap-4 p-3 rounded border border-[var(--color-neutral-border,rgba(0,0,0,0.12))] bg-[var(--color-neutral-bg,#ffffff)] w-full max-w-sm">
          <div>
            <p className="text-xs font-semibold text-[var(--color-neutral-text,#111113)]">OKLCH brand swatch</p>
            <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]">oklch(0.55 0.22 260)</p>
          </div>
          <Menu.Root>
            <Menu.Trigger className={styles.iconBtn} aria-label="More actions for OKLCH brand swatch">
              <DotsThreeVertical size={16} weight="bold" aria-hidden="true" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner side="bottom" align="end" sideOffset={4} className={styles.popoverPositioner}>
                <Menu.Popup className={styles.menuPopup} style={{ width: 200 }}>
                  <Menu.Item className={styles.menuItem} onClick={() => setLastAction('Copy hex code')}>
                    Copy hex code
                  </Menu.Item>
                  <Menu.Item className={styles.menuItem} onClick={() => setLastAction('Audit APCA contrast')}>
                    Audit APCA contrast
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      </DemoCard>
    </DemoFrame>
  );
};
