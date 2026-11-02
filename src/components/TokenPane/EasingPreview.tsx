import React, { useState, useSyncExternalStore } from 'react';
import { Button } from '@base-ui-components/react/button';
import { Play } from '../Icons/phosphor';
import styles from './TokenPane.module.css';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

/** One-shot preview of an easing curve. Under reduced motion the dot jumps without travelling. */
export const EasingPreview: React.FC<{ easing?: string; duration?: string }> = ({ easing, duration }) => {
  const [atEnd, setAtEnd] = useState(false);
  const reduced = usePrefersReducedMotion();

  return (
    <div className={styles.easingPreview}>
      <Button className={styles.button} onClick={() => setAtEnd((v) => !v)}>
        <Play size={12} weight="bold" aria-hidden="true" />
        Play preview
      </Button>
      <div className={styles.easingTrack} aria-hidden="true">
        <span
          className={styles.easingDot}
          data-end={atEnd}
          style={{
            transitionTimingFunction: easing || 'cubic-bezier(0.2, 0, 0, 1)',
            transitionDuration: reduced ? '0ms' : duration || '250ms',
          }}
        />
      </div>
      {reduced && <span className={styles.description}>Reduced motion is on, so the preview does not travel.</span>}
    </div>
  );
};
