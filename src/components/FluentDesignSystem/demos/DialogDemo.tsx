import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
} from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';
import styles from '../FluentDemos.module.css';

export const DialogDemo: React.FC = () => {
  const [name, setName] = useState('Design system workspace');
  const [result, setResult] = useState('Nothing deployed yet');
  const [saved, setSaved] = useState('');
  const [purged, setPurged] = useState(false);

  return (
    <FluentDemoFrame
      id="dialog"
      tagline="Native modal dialog with focus trapping, a backdrop, scroll locking, Escape dismissal and focus restore."
    >
      <DemoCard title="Standard confirmation modal" subtitle="With backdrop and accessible title & description">
        <Dialog>
          <DialogTrigger>
            <Button appearance="primary">Deploy token pipeline</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Deploy cascade layers to staging?</DialogTitle>
              <p className={styles.readout}>
                The pipeline publishes the current layer order to the staging environment. Production is not affected.
              </p>
              <DialogActions>
                <DialogTrigger>
                  <Button appearance="secondary">Cancel</Button>
                </DialogTrigger>
                <DialogTrigger>
                  <Button appearance="primary" onClick={() => setResult('Deployed to staging')}>Deploy</Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
        <p className={styles.readout} role="status">{result}</p>
      </DemoCard>

      <DemoCard title="Destructive action dialog" subtitle="High-severity confirmation with danger color semantics">
        <Dialog modalType="alert">
          <DialogTrigger>
            <Button appearance="danger" disabled={purged}>Purge token cache</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Purge the token cache?</DialogTitle>
              <p className={styles.readout}>All generated theme files are removed and must be rebuilt. This cannot be undone.</p>
              <DialogActions>
                <DialogTrigger>
                  <Button appearance="secondary">Keep cache</Button>
                </DialogTrigger>
                <DialogTrigger>
                  <Button appearance="danger" onClick={() => setPurged(true)}>Purge cache</Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
        <p className={styles.readout} role="status">{purged ? 'Cache purged' : 'Cache intact'}</p>
        {purged && (
          <Button appearance="subtle" onClick={() => setPurged(false)}>Rebuild cache</Button>
        )}
      </DemoCard>

      <DemoCard title="Interactive repository configuration modal" subtitle="Modal containing input fields with Tab navigation">
        <Dialog>
          <DialogTrigger>
            <Button appearance="outline">Configure project settings</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Configure project settings</DialogTitle>
              <Field label="Workspace name">
                <Input value={name} onChange={(_e, d) => setName(d.value)} />
              </Field>
              <Checkbox defaultChecked label="@layer theme, base, components, utilities" />
              <Checkbox label="CSS Modules scoped (:local)" />
              <Checkbox label="Design Tokens Community Group (DTCG JSON)" />
              <DialogActions>
                <DialogTrigger>
                  <Button appearance="secondary">Cancel</Button>
                </DialogTrigger>
                <DialogTrigger>
                  <Button appearance="primary" onClick={() => setSaved(name)}>Save settings</Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
        <p className={styles.readout} role="status">{saved ? `Saved settings for ${saved}` : 'Settings not saved yet'}</p>
      </DemoCard>
    </FluentDemoFrame>
  );
};
