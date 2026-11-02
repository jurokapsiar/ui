import React from 'react';
import { Tooltip } from '@base-ui-components/react/tooltip';
import styles from './Tip.module.css';

interface TipProps {
  label: string;
  /** The element that receives the tooltip trigger behaviour. */
  children: React.ReactElement<Record<string, unknown>>;
  side?: 'top' | 'right' | 'bottom' | 'left' | 'inline-start' | 'inline-end';
}

/** Visual hover/focus hint for names that are truncated or terse. The trigger keeps its own accessible name. */
export const Tip: React.FC<TipProps> = ({ label, children, side = 'top' }) => (
  <Tooltip.Root>
    <Tooltip.Trigger render={children} />
    <Tooltip.Portal>
      <Tooltip.Positioner side={side} sideOffset={6} collisionPadding={8} className={styles.positioner}>
        <Tooltip.Popup className={styles.popup}>{label}</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);

export const TipProvider = Tooltip.Provider;
