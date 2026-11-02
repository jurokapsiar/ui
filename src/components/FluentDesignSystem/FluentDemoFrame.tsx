import React from 'react';
import { BASE_UI_COMPONENTS } from '../../design-system/baseUIComponentsList';
import { FLUENT_COMPONENTS } from '../../design-system/fluentComponentsList';
import { DemoFrame } from '../BaseUIDesignSystem/demos/DemoFrame';

interface FluentDemoFrameProps {
  id: string;
  tagline: string;
  children: React.ReactNode;
}

/** Header for a Fluent demo, built from the shared component list so titles match the Base UI tab. */
export const FluentDemoFrame: React.FC<FluentDemoFrameProps> = ({ id, tagline, children }) => {
  const base = BASE_UI_COMPONENTS.find((c) => c.id === id);
  const fluent = FLUENT_COMPONENTS.find((c) => c.id === id);
  return (
    <DemoFrame
      category={base?.category ?? 'Components'}
      packageName={fluent?.package ?? '@fluentui/react-headless-components-preview'}
      title={base?.name ?? id}
      tagline={tagline}
      contractLabel="Fluent components:"
      contract={fluent?.fluentComponents ?? []}
      contractNote="Headless preview, CSS modules"
    >
      {children}
    </DemoFrame>
  );
};
