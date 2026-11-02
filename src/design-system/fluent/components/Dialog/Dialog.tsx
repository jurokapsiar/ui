import {
  Dialog as HeadlessDialog,
  DialogActions as HeadlessDialogActions,
  DialogBody as HeadlessDialogBody,
  DialogSurface as HeadlessDialogSurface,
  DialogTitle as HeadlessDialogTitle,
  DialogTrigger,
} from '@fluentui/react-headless-components-preview/dialog';
import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { cx } from '../../utils';
import styles from './Dialog.module.css';

export { DialogTrigger };
export const Dialog = HeadlessDialog;

export type DialogSurfaceProps = ComponentProps<typeof HeadlessDialogSurface>;
export const DialogSurface = forwardRef<HTMLDialogElement, DialogSurfaceProps>(({ className, ...props }, ref) => (
  <HeadlessDialogSurface {...props} ref={ref} className={cx(styles.surface, className)} />
));
DialogSurface.displayName = 'DialogSurface';

export type DialogBodyProps = ComponentProps<typeof HeadlessDialogBody>;
export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(({ className, ...props }, ref) => (
  <HeadlessDialogBody {...props} ref={ref} className={cx(styles.body, className)} />
));
DialogBody.displayName = 'DialogBody';

export type DialogTitleProps = ComponentProps<typeof HeadlessDialogTitle>;
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, ...props }, ref) => (
  <HeadlessDialogTitle {...props} ref={ref} className={cx(styles.title, className)} />
));
DialogTitle.displayName = 'DialogTitle';

export type DialogActionsProps = ComponentProps<typeof HeadlessDialogActions>;
export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(({ className, ...props }, ref) => (
  <HeadlessDialogActions {...props} ref={ref} className={cx(styles.actions, className)} />
));
DialogActions.displayName = 'DialogActions';
