import * as React from 'react';
import {
  ToggleButton as HeadlessToggleButton,
  type ToggleButtonProps as HeadlessToggleButtonProps,
} from '@fluentui/react-headless-components-preview/toggle-button';
import { cx, type DistributiveOmit } from '../../utils';
import { useFluentSize, type FluentControlSize } from '../../size';
import type { ButtonAppearance } from '../Button';
import styles from './ToggleButton.module.css';

export type ToggleButtonProps = DistributiveOmit<HeadlessToggleButtonProps, 'appearance' | 'className' | 'icon' | 'size'> & {
  appearance?: ButtonAppearance;
  size?: FluentControlSize;
  icon?: React.ReactNode;
  className?: string;
};

export const ToggleButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ToggleButtonProps>(
  ({ appearance = 'secondary', size, icon, className, ...props }, ref) => {
    const contextSize = useFluentSize();
    return (
      <HeadlessToggleButton
        {...props}
        ref={ref}
        icon={icon == null ? undefined : { children: icon }}
        className={cx(styles.button, className)}
        data-appearance={appearance}
        data-size={size ?? contextSize}
      />
    );
  },
);
ToggleButton.displayName = 'ToggleButton';
