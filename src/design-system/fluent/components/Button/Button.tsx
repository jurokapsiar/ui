import * as React from 'react';
import { Button as HeadlessButton, type ButtonProps as HeadlessButtonProps } from '@fluentui/react-headless-components-preview/button';
import { cx, type DistributiveOmit } from '../../utils';
import { useFluentSize, type FluentControlSize } from '../../size';
import styles from './Button.module.css';

export type ButtonAppearance = 'secondary' | 'primary' | 'tonal' | 'subtle' | 'outline' | 'danger';
export type ButtonProps = DistributiveOmit<HeadlessButtonProps, 'appearance' | 'className' | 'icon' | 'size'> & {
  appearance?: ButtonAppearance;
  size?: FluentControlSize;
  icon?: React.ReactNode;
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ appearance = 'secondary', size, icon, className, ...props }, ref) => {
    const contextSize = useFluentSize();
    return (
      <HeadlessButton
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
Button.displayName = 'Button';
