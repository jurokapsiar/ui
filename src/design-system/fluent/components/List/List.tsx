import { forwardRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { List as HeadlessList, ListItem as HeadlessListItem } from '@fluentui/react-headless-components-preview/list';
import { cx } from '../../utils';
import styles from './List.module.css';

export type ListProps = ComponentProps<typeof HeadlessList>;
export const List = forwardRef<HTMLUListElement | HTMLOListElement | HTMLDivElement, ListProps>(
  ({ className, ...props }, ref) => <HeadlessList {...props} ref={ref as never} className={cx(styles.list, className)} />,
);
List.displayName = 'List';

export type ListItemProps = ComponentProps<typeof HeadlessListItem>;
export const ListItem = forwardRef<HTMLElement, ListItemProps>(({ className, ...props }, ref) => (
  <HeadlessListItem {...props} ref={ref as never} className={cx(styles.item, className)} />
));
ListItem.displayName = 'ListItem';

export interface ListRowProps {
  icon?: ReactNode;
  headline: ReactNode;
  support?: ReactNode;
  meta?: ReactNode;
}

/** Three-part row layout: leading icon, headline with supporting text, trailing meta. */
export const ListRow = ({ icon, headline, support, meta }: ListRowProps) => (
  <>
    {icon && <span className={styles.icon}>{icon}</span>}
    <span className={styles.text}>
      <span className={styles.headline}>{headline}</span>
      {support && <span className={styles.support}>{support}</span>}
    </span>
    {meta && <span className={styles.meta}>{meta}</span>}
  </>
);
