import React, { useState } from 'react';
import { Field, Input } from '../../../design-system/base';
import { DemoCard, DemoFrame } from './DemoFrame';

interface TextFieldProps {
  label: string;
  variant: 'outlined' | 'filled';
  help?: string;
  error?: string;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, variant, help, error, disabled, defaultValue, placeholder }) => (
  <Field.Root invalid={Boolean(error)} disabled={disabled}>
    <Field.Label>{label}</Field.Label>
    <Input
      data-variant={variant}
      data-invalid={error ? '' : undefined}
      defaultValue={defaultValue}
      placeholder={placeholder}
      aria-invalid={error ? true : undefined}
    />
    {error ? (
      <Field.Error match={true} role="alert">
        {error}
      </Field.Error>
    ) : help ? (
      <Field.Description>{help}</Field.Description>
    ) : null}
  </Field.Root>
);

export const TextFieldDemo: React.FC = () => {
  const [email, setEmail] = useState('aria@');
  const invalid = !/^\S+@\S+\.\S+$/.test(email);

  return (
    <DemoFrame
      category="Forms & Inputs"
      packageName="@base-ui-components/react/field"
      title="Text Field"
      tagline="Outlined and filled inputs. Every field keeps a visible label, with helper text, an error message and a disabled state."
      contractLabel="DOM state attributes:"
      contract={['[data-invalid]', '[data-disabled]', '[data-focused]']}
      contractNote="aria-describedby, aria-invalid"
    >
      <DemoCard title="Outlined" subtitle="Helper text below the field" column>
        <TextField label="Project name" variant="outlined" help="Used in generated file names" placeholder="Acme workspace" />
      </DemoCard>
      <DemoCard title="Filled" subtitle="Surface fill with a bottom rule" column>
        <TextField label="Project name" variant="filled" help="Used in generated file names" defaultValue="Acme workspace" />
      </DemoCard>
      <DemoCard title="Error state" subtitle="Live validation: edit the address to clear the error" column>
        <Field.Root invalid={invalid}>
          <Field.Label>Reviewer email (required)</Field.Label>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            data-variant="outlined"
            data-invalid={invalid ? '' : undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={invalid}
          />
          {invalid ? (
            <Field.Error match={true} role="alert">
              Enter a complete email address
            </Field.Error>
          ) : (
            <Field.Description>Looks good</Field.Description>
          )}
        </Field.Root>
      </DemoCard>
      <DemoCard title="Disabled" subtitle="Not editable and skipped by Tab" column>
        <TextField label="Workspace id" variant="outlined" defaultValue="ws-4821" disabled help="Assigned by the platform" />
      </DemoCard>
    </DemoFrame>
  );
};
