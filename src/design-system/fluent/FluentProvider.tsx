import React from 'react';
import { Provider } from '@fluentui/react-headless-components-preview/provider';
import { useTheme } from '../core';
import './base.css';
import { FluentSizeContext, controlSizeFromTouchTarget, type FluentControlSize } from './size';

export interface FluentProviderProps {
  children: React.ReactNode;
  /** Overrides the size derived from the active theme's touch-target token. */
  size?: FluentControlSize;
}

export const FluentProvider: React.FC<FluentProviderProps> = ({ children, size }) => {
  const { tokens } = useTheme();
  const themeSize = controlSizeFromTouchTarget(tokens.touchTargetMin);

  return (
    <Provider>
      <div data-fluent-root>
        <FluentSizeContext.Provider value={size ?? themeSize}>{children}</FluentSizeContext.Provider>
      </div>
    </Provider>
  );
};
