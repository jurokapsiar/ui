import React, { useId, useState } from 'react';
import { Field, Input, Popover } from '../../../design-system/base';
import { DemoCard, DemoFrame } from './DemoFrame';

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
            <Popover.Trigger>
              <span>Placement: {side}</span>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner side={side} sideOffset={8}>
                <Popover.Popup>
                  <Popover.Arrow />
                  <Popover.Title>Side: {side}</Popover.Title>
                  <Popover.Description>
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
          <Popover.Trigger>
            <span>Inspect token set</span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="bottom" sideOffset={8}>
              <Popover.Popup style={{ maxWidth: 320 }}>
                <Popover.Arrow />
                <Popover.Title>Brand palette</Popover.Title>
                <Popover.Description>
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
          <Popover.Trigger>
            <span>Edit system tag</span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="top" sideOffset={10}>
              <Popover.Popup style={{ width: 300 }}>
                <Popover.Arrow />
                <Popover.Title>Update namespace</Popover.Title>
                <Popover.Description>
                  Assign this primitive component to an organisational domain.
                </Popover.Description>
                  <Field.Root>
                  <Field.Label htmlFor={tagId}>
                    Namespace
                  </Field.Label>
                  <Input
                    id={tagId}
                    name="namespace"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    data-variant="outlined"
                  />
                  </Field.Root>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <Popover.Close
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
