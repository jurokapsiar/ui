import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
import { Button } from '../Button';
import styles from './Collapsible.module.css';

export interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * The headless package has no Collapsible primitive, so this is a disclosure built
 * from a Button (aria-expanded / aria-controls) and a region that uses `hidden`.
 */
export const Collapsible = ({ title, defaultOpen = false, children }: CollapsibleProps) => {
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.collapsible}>
      <Button
        appearance="subtle"
        icon={open ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {title}
      </Button>
      <div id={panelId} role="region" aria-label={title} hidden={!open} className={styles.panel}>
        {children}
      </div>
    </div>
  );
};
