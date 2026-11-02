import {
  Menu as HeadlessMenu,
  MenuDivider as HeadlessMenuDivider,
  MenuItem as HeadlessMenuItem,
  MenuList as HeadlessMenuList,
  MenuPopover as HeadlessMenuPopover,
  MenuTrigger,
} from '@fluentui/react-headless-components-preview/menu';
import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { cx } from '../../utils';
import styles from './Menu.module.css';

export const Menu = HeadlessMenu;
export { MenuTrigger };

export type MenuPopoverProps = ComponentProps<typeof HeadlessMenuPopover>;
export const MenuPopover = forwardRef<HTMLDivElement, MenuPopoverProps>(({ className, ...props }, ref) => (
  <HeadlessMenuPopover {...props} ref={ref} className={cx(styles.popover, className)} />
));
MenuPopover.displayName = 'MenuPopover';

export type MenuListProps = ComponentProps<typeof HeadlessMenuList>;
export const MenuList = forwardRef<HTMLDivElement, MenuListProps>(({ className, ...props }, ref) => (
  <HeadlessMenuList {...props} ref={ref} className={cx(styles.list, className)} />
));
MenuList.displayName = 'MenuList';

export type MenuItemProps = ComponentProps<typeof HeadlessMenuItem>;
export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(({ className, ...props }, ref) => (
  <HeadlessMenuItem {...props} ref={ref} className={cx(styles.item, className)} />
));
MenuItem.displayName = 'MenuItem';

export type MenuDividerProps = ComponentProps<typeof HeadlessMenuDivider>;
export const MenuDivider = forwardRef<HTMLDivElement, MenuDividerProps>(({ className, ...props }, ref) => (
  <HeadlessMenuDivider {...props} ref={ref} className={cx(styles.divider, className)} />
));
MenuDivider.displayName = 'MenuDivider';
