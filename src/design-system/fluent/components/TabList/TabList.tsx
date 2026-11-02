import { forwardRef } from 'react';
import {
  Tab as HeadlessTab,
  TabList as HeadlessTabList,
  type TabProps as HeadlessTabProps,
  type TabListProps as HeadlessTabListProps,
} from '@fluentui/react-headless-components-preview/tab-list';
import { cx } from '../../utils';
import { useFluentSize, type FluentControlSize } from '../../size';
import styles from './TabList.module.css';

export type TabAppearance = 'underline' | 'segmented';

export type TabListProps = Omit<HeadlessTabListProps, 'appearance' | 'size'> & {
  appearance?: TabAppearance;
  size?: FluentControlSize;
};
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ appearance = 'underline', size, className, ...props }, ref) => {
    const contextSize = useFluentSize();
    return (
      <HeadlessTabList
        {...props}
        ref={ref}
        className={cx(styles.list, className)}
        data-appearance={appearance}
        data-size={size ?? contextSize}
      />
    );
  },
);
TabList.displayName = 'TabList';

export type TabProps = HeadlessTabProps;
export const Tab = forwardRef<HTMLButtonElement, TabProps>(({ className, ...props }, ref) => (
  <HeadlessTab {...props} ref={ref} className={cx(styles.tab, className)} />
));
Tab.displayName = 'Tab';
