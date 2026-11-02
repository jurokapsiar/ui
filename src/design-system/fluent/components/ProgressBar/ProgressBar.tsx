import { forwardRef } from 'react';
import {
  ProgressBar as HeadlessProgressBar,
  type ProgressBarProps as HeadlessProgressBarProps,
} from '@fluentui/react-headless-components-preview/progress-bar';
import { cx, withSlotClass } from '../../utils';
import styles from './ProgressBar.module.css';

export type ProgressBarProps = HeadlessProgressBarProps & { tone?: 'brand' | 'success' };
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(({ className, bar, tone = 'brand', ...props }, ref) => (
  <HeadlessProgressBar
    {...props}
    ref={ref}
    bar={withSlotClass(bar ?? {}, styles.fill)}
    className={cx(styles.progress, className)}
    data-tone={tone}
  />
));
ProgressBar.displayName = 'ProgressBar';
