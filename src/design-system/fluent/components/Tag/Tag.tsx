import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import {
  InteractionTag as HeadlessInteractionTag,
  InteractionTagPrimary as HeadlessInteractionTagPrimary,
} from '@fluentui/react-headless-components-preview/interaction-tag';
import { Tag as HeadlessTag } from '@fluentui/react-headless-components-preview/tag';
import { TagGroup as HeadlessTagGroup } from '@fluentui/react-headless-components-preview/tag-group';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { cx } from '../../utils';
import styles from './Tag.module.css';

export type InteractionTagProps = ComponentProps<typeof HeadlessInteractionTag>;
export const InteractionTag = forwardRef<HTMLDivElement, InteractionTagProps>(({ className, ...props }, ref) => (
  <HeadlessInteractionTag {...props} ref={ref} className={cx(styles.tag, className)} />
));
InteractionTag.displayName = 'InteractionTag';

export type InteractionTagPrimaryProps = ComponentProps<typeof HeadlessInteractionTagPrimary>;
export const InteractionTagPrimary = forwardRef<HTMLButtonElement, InteractionTagPrimaryProps>(
  ({ className, ...props }, ref) => (
    <HeadlessInteractionTagPrimary {...props} ref={ref} className={cx(styles.primary, className)} />
  ),
);
InteractionTagPrimary.displayName = 'InteractionTagPrimary';

export type TagProps = ComponentProps<typeof HeadlessTag>;
export const Tag = forwardRef<HTMLSpanElement | HTMLButtonElement, TagProps>(
  ({ className, dismissIcon, ...props }, ref) => (
    <HeadlessTag
      {...props}
      ref={ref as never}
      dismissIcon={{ children: <Dismiss12Regular aria-hidden />, ...(dismissIcon as object) }}
      className={cx(styles.tag, className)}
    />
  ),
);
Tag.displayName = 'Tag';

export type TagGroupProps = ComponentProps<typeof HeadlessTagGroup>;
export const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(({ className, ...props }, ref) => (
  <HeadlessTagGroup {...props} ref={ref} className={cx(styles.group, className)} />
));
TagGroup.displayName = 'TagGroup';
