import React, { useState } from 'react';
import { DemoCard } from '../../BaseUIDesignSystem/demos/DemoFrame';
import { Field, Input } from '../../../design-system/fluent';
import { FluentDemoFrame } from '../FluentDemoFrame';

export const TextFieldDemo: React.FC = () => {
  const [email, setEmail] = useState('aria@');
  const invalid = !/^\S+@\S+\.\S+$/.test(email);

  return (
    <FluentDemoFrame
      id="text-field"
      tagline="Outlined and filled inputs. Every field keeps a visible label, with helper text, an error message and a disabled state."
    >
      <DemoCard title="Outlined" subtitle="Helper text below the field" column>
        <Field label="Project name" hint="Used in generated file names">
          <Input appearance="outline" placeholder="Acme workspace" />
        </Field>
      </DemoCard>
      <DemoCard title="Filled" subtitle="Surface fill with a bottom rule" column>
        <Field label="Project name" hint="Used in generated file names">
          <Input appearance="filled" defaultValue="Acme workspace" />
        </Field>
      </DemoCard>
      <DemoCard title="Error state" subtitle="Live validation: edit the address to clear the error" column>
        <Field
          label="Reviewer email"
          required
          validationState={invalid ? 'error' : 'success'}
          validationMessage={invalid ? 'Enter a complete email address' : 'Looks good'}
        >
          <Input appearance="outline" type="email" name="email" autoComplete="email" value={email} onChange={(_e, d) => setEmail(d.value)} />
        </Field>
      </DemoCard>
      <DemoCard title="Disabled" subtitle="Not editable and skipped by Tab" column>
        <Field label="Workspace id" hint="Assigned by the platform">
          <Input appearance="outline" defaultValue="ws-4821" disabled />
        </Field>
      </DemoCard>
    </FluentDemoFrame>
  );
};
