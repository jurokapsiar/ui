import React, { useId, useState } from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

export const PopoverDemo: React.FC = () => {
  const [tagInput, setTagInput] = useState('design-ops');
  const [submittedTag, setSubmittedTag] = useState('design-ops');
  const tagId = useId();

  return (
    <DemoFrame
      category="Overlays & Floating"
      packageName="@base-ui-components/react/popover"
      title="Popover"
      tagline="Floating overlay with collision detection and native CSS entry and exit animations. Renders into a portal outside the stacking context."
      contractLabel="Injected variables:"
      contract={['--available-height', '--anchor-width', '--transform-origin']}
      contractNote="Escape closes and returns focus"
    >
      <DemoCard title="Directional placements" subtitle="Top, bottom, left and right positioning with collision checks">
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <Popover.Root key={side}>
            <Popover.Trigger className={styles.popoverTrigger}>
              <span>Placement: {side}</span>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner side={side} sideOffset={8} className={styles.popoverPositioner}>
                <Popover.Popup className={styles.popoverPopup}>
                  <Popover.Arrow className={styles.popoverArrow} />
                  <Popover.Title className={styles.popoverTitle}>Side: {side}</Popover.Title>
                  <Popover.Description className={styles.popoverDescription}>
                    Repositions automatically when a viewport boundary is reached.
                  </Popover.Description>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        ))}
      </DemoCard>

      <DemoCard title="Details popover" subtitle="Rich floating surface with a heading, description and status">
        <Popover.Root>
          <Popover.Trigger className={styles.popoverTrigger}>
            <span>Inspect token set</span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="bottom" sideOffset={8} className={styles.popoverPositioner}>
              <Popover.Popup className={styles.popoverPopup} style={{ maxWidth: 320 }}>
                <Popover.Arrow className={styles.popoverArrow} />
                <Popover.Title className={styles.popoverTitle}>Brand palette</Popover.Title>
                <Popover.Description className={styles.popoverDescription}>
                  Sample content: primary, on-primary and neutral surface colours.
                </Popover.Description>
                <p className="text-xs font-mono text-[var(--color-neutral-text-muted,#71717a)]">Status: up to date</p>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </DemoCard>

      <DemoCard title="Inline parameter editor" subtitle="Labelled input with a save action and state retention">
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          Active category: <strong className="text-[var(--color-neutral-text,#111113)]">{submittedTag}</strong>
        </p>
        <Popover.Root>
          <Popover.Trigger className={styles.popoverTrigger}>
            <span>Edit system tag</span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="top" sideOffset={10} className={styles.popoverPositioner}>
              <Popover.Popup className={styles.popoverPopup} style={{ width: 300 }}>
                <Popover.Arrow className={styles.popoverArrow} />
                <Popover.Title className={styles.popoverTitle}>Update namespace</Popover.Title>
                <Popover.Description className={styles.popoverDescription}>
                  Assign this primitive component to an organisational domain.
                </Popover.Description>
                <div className={styles.fieldRoot}>
                  <label htmlFor={tagId} className={styles.fieldLabel}>
                    Namespace
                  </label>
                  <input
                    id={tagId}
                    name="namespace"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className={styles.fieldInput}
                    data-variant="outlined"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <Popover.Close
                    className={styles.btn}
                    data-variant="filled"
                    onClick={() => setSubmittedTag(tagInput.trim() || submittedTag)}
                  >
                    Save tag
                  </Popover.Close>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </DemoCard>
    </DemoFrame>
  );
};
