import { isValidElement } from 'react';
import {
  Tooltip as HeadlessTooltip,
  type TooltipProps as HeadlessTooltipProps,
} from '@fluentui/react-headless-components-preview/tooltip';
import { cx } from '../../utils';
import styles from './Tooltip.module.css';

export type TooltipProps = HeadlessTooltipProps;

const isSlotProps = (value: unknown): value is { className?: string } =>
  typeof value === 'object' && value !== null && !isValidElement(value) && ('className' in value || 'children' in value);

export const Tooltip = ({ content, ...props }: TooltipProps) => {
  const slot = isSlotProps(content) ? content : { children: content };
  return <HeadlessTooltip {...props} content={{ ...slot, className: cx(styles.content, slot.className) }} />;
};
Tooltip.displayName = 'Tooltip';
