import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { Slider as HeadlessSlider } from '@fluentui/react-headless-components-preview/slider';
import { cx, withSlotClass } from '../../utils';
import { useFluentSize } from '../../size';
import styles from './Slider.module.css';

export type SliderProps = ComponentProps<typeof HeadlessSlider>;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ className, rail, thumb, input, ...props }, ref) => (
  <HeadlessSlider
    {...props}
    ref={ref}
    rail={withSlotClass(rail ?? {}, styles.rail)}
    thumb={withSlotClass(thumb ?? {}, styles.thumb)}
    input={withSlotClass(input ?? {}, styles.input)}
    className={cx(styles.slider, className)}
    data-size={useFluentSize()}
  />
));
Slider.displayName = 'Slider';
