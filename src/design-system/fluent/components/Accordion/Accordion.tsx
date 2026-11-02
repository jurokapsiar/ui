import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import {
  Accordion as HeadlessAccordion,
  AccordionHeader as HeadlessAccordionHeader,
  AccordionItem as HeadlessAccordionItem,
  AccordionPanel as HeadlessAccordionPanel,
} from '@fluentui/react-headless-components-preview/accordion';
import { ChevronDown16Regular } from '@fluentui/react-icons';
import { cx, withSlotClass } from '../../utils';
import styles from './Accordion.module.css';

export const Accordion = HeadlessAccordion;

export type AccordionItemProps = ComponentProps<typeof HeadlessAccordionItem>;
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(({ className, ...props }, ref) => (
  <HeadlessAccordionItem {...props} ref={ref} className={cx(styles.item, className)} />
));
AccordionItem.displayName = 'AccordionItem';

export type AccordionHeaderProps = ComponentProps<typeof HeadlessAccordionHeader>;
export const AccordionHeader = forwardRef<HTMLDivElement, AccordionHeaderProps>(
  ({ className, button, expandIcon, ...props }, ref) => (
    <HeadlessAccordionHeader
      {...props}
      ref={ref}
      button={withSlotClass(button ?? {}, styles.button)}
      expandIcon={expandIcon ?? { children: <ChevronDown16Regular aria-hidden /> }}
      className={cx(styles.header, className)}
    />
  ),
);
AccordionHeader.displayName = 'AccordionHeader';

export type AccordionPanelProps = ComponentProps<typeof HeadlessAccordionPanel>;
export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(({ className, ...props }, ref) => (
  <HeadlessAccordionPanel {...props} ref={ref} className={cx(styles.panel, className)} />
));
AccordionPanel.displayName = 'AccordionPanel';
