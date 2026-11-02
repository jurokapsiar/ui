import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { Dropdown as HeadlessDropdown, Option as HeadlessOption } from '@fluentui/react-headless-components-preview/dropdown';
import { ChevronDown16Regular, Checkmark16Regular } from '@fluentui/react-icons';
import { cx, withSlotClass } from '../../utils';
import { useFluentSize, type FluentControlSize } from '../../size';
import styles from './Dropdown.module.css';

export type DropdownProps = Omit<ComponentProps<typeof HeadlessDropdown>, 'size'> & { size?: FluentControlSize };
export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  ({ className, size, button, listbox, expandIcon, ...props }, ref) => {
    const contextSize = useFluentSize();
    return (
      <HeadlessDropdown
        {...props}
        ref={ref}
        button={withSlotClass(button ?? {}, styles.button)}
        listbox={withSlotClass(listbox ?? {}, styles.listbox)}
        expandIcon={expandIcon ?? { children: <ChevronDown16Regular aria-hidden /> }}
        className={cx(styles.dropdown, className)}
        data-size={size ?? contextSize}
      />
    );
  },
);
Dropdown.displayName = 'Dropdown';

export type OptionProps = ComponentProps<typeof HeadlessOption>;
export const Option = forwardRef<HTMLDivElement, OptionProps>(({ className, checkIcon, ...props }, ref) => (
  <HeadlessOption
    {...props}
    ref={ref}
    checkIcon={checkIcon ?? { children: <Checkmark16Regular aria-hidden /> }}
    className={cx(styles.option, className)}
  />
));
Option.displayName = 'Option';
