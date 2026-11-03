import React, { useId, useState } from 'react';
import { Button, Dialog, DialogActions, Field, Input, SelectControl } from '../../../design-system/base';
import { DemoCard, DemoFrame } from './DemoFrame';

export const DialogDemo: React.FC = () => {
  const [deployed, setDeployed] = useState(false);
  const [purged, setPurged] = useState(false);
  const [saved, setSaved] = useState('');
  const [repoName, setRepoName] = useState('enterprise-ui-tokens');
  const nameId = useId();
  const targetId = useId();

  return (
    <DemoFrame
      category="Overlays & Floating"
      packageName="@base-ui-components/react/dialog"
      title="Dialog"
      tagline="Modal window with focus trapping, a backdrop, scroll locking and Escape dismissal. Unstyled compound primitive."
      contractLabel="Lifecycle states:"
      contract={['[data-starting-style]', '[data-ending-style]', '[data-open]']}
      contractNote="Focus trap: WAI-ARIA modal"
    >
      <DemoCard title="Standard confirmation modal" subtitle="With backdrop blur and an accessible title and description">
        <Dialog.Root>
          <Dialog.Trigger>Deploy token pipeline</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <Dialog.Title>Deploy cascade layers to staging?</Dialog.Title>
              <Dialog.Description>
                The pipeline publishes the current layer order to the staging environment. Production is not affected.
              </Dialog.Description>
              <DialogActions>
                <Dialog.Close data-variant="outlined">
                  Cancel
                </Dialog.Close>
                <Dialog.Close data-variant="filled" onClick={() => setDeployed(true)}>
                  Deploy
                </Dialog.Close>
              </DialogActions>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          {deployed ? 'Deployed to staging' : 'Nothing deployed yet'}
        </p>
      </DemoCard>

      <DemoCard title="Destructive action dialog" subtitle="High-severity confirmation; the text names the consequence, colour is secondary">
        <Dialog.Root>
          <Dialog.ButtonTrigger data-variant="danger" disabled={purged}>
            Purge token cache
          </Dialog.ButtonTrigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <Dialog.Title>Purge the token cache?</Dialog.Title>
              <Dialog.Description>
                All generated theme files are removed and must be rebuilt. This cannot be undone.
              </Dialog.Description>
              <DialogActions>
                <Dialog.Close data-variant="outlined">
                  Keep cache
                </Dialog.Close>
                <Dialog.Close data-variant="danger" onClick={() => setPurged(true)}>
                  Purge cache
                </Dialog.Close>
              </DialogActions>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          {purged ? 'Cache purged' : 'Cache intact'}
        </p>
        {purged && (
          <Button type="button" data-variant="text" onClick={() => setPurged(false)}>
            Rebuild cache
          </Button>
        )}
      </DemoCard>

      <DemoCard title="Repository configuration modal" subtitle="Modal containing labelled fields with Tab navigation">
        <Dialog.Root>
          <Dialog.Trigger>Configure project settings</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <Dialog.Title>Design system workspace</Dialog.Title>
              <Dialog.Description>
                Configure token export parameters for your target framework.
              </Dialog.Description>
              <div className="flex flex-col gap-4 my-4">
                <Field.Root>
                  <Field.Label htmlFor={nameId}>
                    Repository package name
                  </Field.Label>
                  <Input
                    id={nameId}
                    name="package-name"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    data-variant="outlined"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label htmlFor={targetId}>
                    Cascade layer target
                  </Field.Label>
                  <SelectControl id={targetId} name="layer-target" data-variant="outlined">
                    <option>@layer theme, base, components, utilities</option>
                    <option>CSS modules scoped (:local)</option>
                    <option>Design Tokens Community Group (DTCG JSON)</option>
                  </SelectControl>
                </Field.Root>
              </div>
              <DialogActions>
                <Dialog.Close data-variant="outlined">
                  Cancel
                </Dialog.Close>
                <Dialog.Close data-variant="filled" onClick={() => setSaved(repoName)}>
                  Save settings
                </Dialog.Close>
              </DialogActions>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          {saved ? `Saved settings for ${saved}` : 'Settings not saved yet'}
        </p>
      </DemoCard>
    </DemoFrame>
  );
};
