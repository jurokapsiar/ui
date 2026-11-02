import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { Checkbox as HeadlessCheckbox } from '@fluentui/react-headless-components-preview/checkbox';
import { Field as HeadlessField } from '@fluentui/react-headless-components-preview/field';
import { Input as HeadlessInput } from '@fluentui/react-headless-components-preview/input';
import { Radio, RadioGroup as HeadlessRadioGroup } from '@fluentui/react-headless-components-preview/radio-group';
import { Switch as HeadlessSwitch } from '@fluentui/react-headless-components-preview/switch';
import { Checkmark12Filled } from '@fluentui/react-icons';
import { cx, withSlotClass } from '../../utils';
import { useFluentSize, type FluentControlSize } from '../../size';
import styles from './FormControls.module.css';

export type FieldProps = ComponentProps<typeof HeadlessField>;
export const Field = forwardRef<HTMLDivElement, FieldProps>(({ className, validationMessage, hint, ...props }, ref) => (
  <HeadlessField
    {...props}
    validationMessage={withSlotClass(validationMessage, styles.validation)}
    hint={withSlotClass(hint, styles.hint)}
    ref={ref}
    className={cx(styles.field, className)}
  />
));
Field.displayName = 'Field';

export type InputProps = Omit<ComponentProps<typeof HeadlessInput>, 'size' | 'appearance'> & {
  size?: FluentControlSize;
  appearance?: 'outline' | 'filled';
};
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, size, appearance = 'outline', ...props }, ref) => {
  const contextSize = useFluentSize();
  return (
    <HeadlessInput
      {...props}
      ref={ref}
      className={cx(styles.input, className)}
      data-size={size ?? contextSize}
      data-appearance={appearance}
    />
  );
});
Input.displayName = 'Input';

export type CheckboxProps = ComponentProps<typeof HeadlessCheckbox>;
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, indicator, ...props }, ref) => (
  <HeadlessCheckbox
    {...props}
    ref={ref}
    indicator={withSlotClass(indicator ?? { children: <Checkmark12Filled aria-hidden /> }, styles.checkboxIndicator)}
    className={cx(styles.checkbox, className)}
    data-size={useFluentSize()}
  />
));
Checkbox.displayName = 'Checkbox';

export type SwitchProps = ComponentProps<typeof HeadlessSwitch>;
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ className, indicator, ...props }, ref) => (
  <HeadlessSwitch
    {...props}
    ref={ref}
    indicator={withSlotClass(indicator ?? { children: null }, styles.switchIndicator)}
    className={cx(styles.switch, className)}
    data-size={useFluentSize()}
  />
));
Switch.displayName = 'Switch';

export type RadioGroupProps = ComponentProps<typeof HeadlessRadioGroup>;
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(({ className, ...props }, ref) => (
  <HeadlessRadioGroup {...props} ref={ref} className={cx(styles.radioGroup, className)} />
));
RadioGroup.displayName = 'RadioGroup';

export type RadioProps = ComponentProps<typeof Radio>;
export const StyledRadio = forwardRef<HTMLInputElement, RadioProps>(({ className, indicator, ...props }, ref) => (
  <Radio
    {...props}
    ref={ref}
    indicator={withSlotClass(indicator ?? { children: null }, styles.radioIndicator)}
    className={cx(styles.radio, className)}
    data-size={useFluentSize()}
  />
));
StyledRadio.displayName = 'Radio';
