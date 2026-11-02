import React, { useId, useState } from 'react';
import { Dialog } from '@base-ui-components/react/dialog';
import { DemoCard, DemoFrame } from './DemoFrame';
import styles from './BaseUIDemos.module.css';

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
          <Dialog.Trigger className={styles.dialogTrigger}>Deploy token pipeline</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.dialogBackdrop} />
            <Dialog.Popup className={styles.dialogPopup}>
              <Dialog.Title className={styles.dialogTitle}>Deploy cascade layers to staging?</Dialog.Title>
              <Dialog.Description className={styles.dialogDescription}>
                The pipeline publishes the current layer order to the staging environment. Production is not affected.
              </Dialog.Description>
              <div className={styles.dialogActions}>
                <Dialog.Close className={styles.btn} data-variant="outlined">
                  Cancel
                </Dialog.Close>
                <Dialog.Close className={styles.btn} data-variant="filled" onClick={() => setDeployed(true)}>
                  Deploy
                </Dialog.Close>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          {deployed ? 'Deployed to staging' : 'Nothing deployed yet'}
        </p>
      </DemoCard>

      <DemoCard title="Destructive action dialog" subtitle="High-severity confirmation; the text names the consequence, colour is secondary">
        <Dialog.Root>
          <Dialog.Trigger className={styles.btn} data-variant="danger" disabled={purged}>
            Purge token cache
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.dialogBackdrop} />
            <Dialog.Popup className={styles.dialogPopup}>
              <Dialog.Title className={styles.dialogTitle}>Purge the token cache?</Dialog.Title>
              <Dialog.Description className={styles.dialogDescription}>
                All generated theme files are removed and must be rebuilt. This cannot be undone.
              </Dialog.Description>
              <div className={styles.dialogActions}>
                <Dialog.Close className={styles.btn} data-variant="outlined">
                  Keep cache
                </Dialog.Close>
                <Dialog.Close className={styles.btn} data-variant="danger" onClick={() => setPurged(true)}>
                  Purge cache
                </Dialog.Close>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <p className="text-xs text-[var(--color-neutral-text-muted,#71717a)]" role="status">
          {purged ? 'Cache purged' : 'Cache intact'}
        </p>
        {purged && (
          <button type="button" className={styles.btn} data-variant="text" onClick={() => setPurged(false)}>
            Rebuild cache
          </button>
        )}
      </DemoCard>

      <DemoCard title="Repository configuration modal" subtitle="Modal containing labelled fields with Tab navigation">
        <Dialog.Root>
          <Dialog.Trigger className={styles.dialogTrigger}>Configure project settings</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.dialogBackdrop} />
            <Dialog.Popup className={styles.dialogPopup}>
              <Dialog.Title className={styles.dialogTitle}>Design system workspace</Dialog.Title>
              <Dialog.Description className={styles.dialogDescription}>
                Configure token export parameters for your target framework.
              </Dialog.Description>
              <div className="flex flex-col gap-4 my-4">
                <div className={styles.fieldRoot}>
                  <label htmlFor={nameId} className={styles.fieldLabel}>
                    Repository package name
                  </label>
                  <input
                    id={nameId}
                    name="package-name"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className={styles.fieldInput}
                    data-variant="outlined"
                  />
                </div>
                <div className={styles.fieldRoot}>
                  <label htmlFor={targetId} className={styles.fieldLabel}>
                    Cascade layer target
                  </label>
                  <select id={targetId} name="layer-target" className={styles.fieldInput} data-variant="outlined">
                    <option>@layer theme, base, components, utilities</option>
                    <option>CSS modules scoped (:local)</option>
                    <option>Design Tokens Community Group (DTCG JSON)</option>
                  </select>
                </div>
              </div>
              <div className={styles.dialogActions}>
                <Dialog.Close className={styles.btn} data-variant="outlined">
                  Cancel
                </Dialog.Close>
                <Dialog.Close className={styles.btn} data-variant="filled" onClick={() => setSaved(repoName)}>
                  Save settings
                </Dialog.Close>
              </div>
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
