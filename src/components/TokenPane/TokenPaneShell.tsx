import React, { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { Button } from '@base-ui-components/react/button';
import { Dialog } from '@base-ui-components/react/dialog';
import { SlidersHorizontal } from '../Icons/phosphor';
import { useDesignSystem } from '../../design-system/DesignSystemContext';
import { THEME_PRESETS } from '../../design-system/themeTokens';
import { TokenPaneContent } from './TokenPaneContent';
import { SelectField, type SelectOption } from './controls';
import styles from './TokenPane.module.css';

const PRESET_OPTIONS: SelectOption[] = THEME_PRESETS.map((p) => ({
  value: p.id,
  label: p.name,
  swatch: p.colorBadge,
  hint: p.category,
}));

const PANE_ID = 'token-pane';
const WIDTH_KEY = 'ui-design-systems.tokenPane.width';
const DEFAULT_WIDTH = 380;
const MIN_WIDTH = 320;
const MAX_WIDTH = 520;
const DOCK_QUERY = '(min-width: 1200px)';

const subscribeDock = (cb: () => void) => {
  const mql = window.matchMedia(DOCK_QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const useIsDocked = () =>
  useSyncExternalStore(
    subscribeDock,
    () => window.matchMedia(DOCK_QUERY).matches,
    () => true,
  );

const clampWidth = (w: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, w));

const readWidth = () => {
  try {
    const stored = Number(window.localStorage.getItem(WIDTH_KEY));
    return stored ? clampWidth(stored) : DEFAULT_WIDTH;
  } catch {
    return DEFAULT_WIDTH;
  }
};

/** Docked column with a keyboard and pointer resize handle. */
const DockedPane: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [width, setWidth] = useState(readWidth);
  const paneRef = useRef<HTMLElement>(null);
  const drag = useRef<{ startX: number; startWidth: number; rtl: boolean } | null>(null);

  const commit = useCallback((w: number) => {
    const next = clampWidth(w);
    setWidth(next);
    try {
      window.localStorage.setItem(WIDTH_KEY, String(next));
    } catch {
      // Width just won't persist.
    }
  }, []);

  const isRtl = () => !!paneRef.current && getComputedStyle(paneRef.current).direction === 'rtl';

  return (
    <aside
      id={PANE_ID}
      ref={paneRef}
      className={styles.docked}
      style={{ inlineSize: `${width}px` }}
      aria-labelledby="token-pane-title"
      hidden={!open}
    >
      {open && (
        <>
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize token pane"
            aria-valuemin={MIN_WIDTH}
            aria-valuemax={MAX_WIDTH}
            aria-valuenow={width}
            tabIndex={0}
            className={styles.resizer}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { startX: e.clientX, startWidth: width, rtl: isRtl() };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              const dx = e.clientX - d.startX;
              commit(d.startWidth + (d.rtl ? dx : -dx));
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onKeyDown={(e) => {
              // The pane sits on the inline-end edge, so the handle widens it toward the inline-start side.
              const widen = isRtl() ? 'ArrowRight' : 'ArrowLeft';
              const narrow = isRtl() ? 'ArrowLeft' : 'ArrowRight';
              if (e.key === widen) commit(width + 16);
              else if (e.key === narrow) commit(width - 16);
              else return;
              e.preventDefault();
            }}
          />
          <TokenPaneContent onClose={onClose} sheet={false} />
        </>
      )}
    </aside>
  );
};

/** Modal sheet from the inline-end edge. Base UI Dialog supplies the focus trap, Escape, outside press and focus restore. */
const SheetPane: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.backdrop} />
      <Dialog.Popup id={PANE_ID} className={styles.sheet}>
        <TokenPaneContent onClose={onClose} sheet />
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);

interface ShellProps {
  libraryName: string;
  children: React.ReactNode;
}

/** View header with the toggle, plus the content column and the token pane beside it. */
export const TokenPaneShell: React.FC<ShellProps> = ({ libraryName, children }) => {
  const { activePresetId, selectPreset, isTokenPaneOpen, setTokenPaneOpen } = useDesignSystem();
  const docked = useIsDocked();
  const close = useCallback(() => setTokenPaneOpen(false), [setTokenPaneOpen]);

  return (
    <div className={styles.shell}>
      <div className={styles.main}>
        <header className={styles.viewBar}>
          <div className={styles.viewTitle}>
            <span className={styles.viewLibrary}>{libraryName}</span>
            <span className={styles.viewLibrary} aria-hidden="true">
              ·
            </span>
            <SelectField
              ariaLabel="Theme preset"
              triggerClassName={styles.presetTrigger}
              value={activePresetId}
              options={PRESET_OPTIONS}
              onChange={selectPreset}
              fallbackLabel="Choose a preset"
            />
          </div>
          <Button
            className={styles.toggle}
            aria-expanded={isTokenPaneOpen}
            aria-controls={PANE_ID}
            onClick={() => setTokenPaneOpen((v) => !v)}
          >
            <SlidersHorizontal size={14} weight="bold" aria-hidden="true" />
            Customize tokens
          </Button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
      {docked ? <DockedPane open={isTokenPaneOpen} onClose={close} /> : <SheetPane open={isTokenPaneOpen} onClose={close} />}
    </div>
  );
};
