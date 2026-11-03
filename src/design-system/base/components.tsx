import React from 'react';
import { Accordion as AccordionPrimitive } from '@base-ui-components/react/accordion';
import { Button as ButtonPrimitive } from '@base-ui-components/react/button';
import { Checkbox as CheckboxPrimitive } from '@base-ui-components/react/checkbox';
import { Collapsible as CollapsiblePrimitive } from '@base-ui-components/react/collapsible';
import { Dialog as DialogPrimitive } from '@base-ui-components/react/dialog';
import { Field as FieldPrimitive } from '@base-ui-components/react/field';
import { Input as InputPrimitive } from '@base-ui-components/react/input';
import { Menu as MenuPrimitive } from '@base-ui-components/react/menu';
import { Popover as PopoverPrimitive } from '@base-ui-components/react/popover';
import { Progress as ProgressPrimitive } from '@base-ui-components/react/progress';
import { Radio as RadioPrimitive } from '@base-ui-components/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui-components/react/radio-group';
import { Select as SelectPrimitive } from '@base-ui-components/react/select';
import { Slider as SliderPrimitive } from '@base-ui-components/react/slider';
import { Switch as SwitchPrimitive } from '@base-ui-components/react/switch';
import { Tabs as TabsPrimitive } from '@base-ui-components/react/tabs';
import { Toggle as TogglePrimitive } from '@base-ui-components/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui-components/react/toggle-group';
import { Tooltip as TooltipPrimitive } from '@base-ui-components/react/tooltip';
import styles from './components.module.css';

type PrimitiveProps<C extends React.ElementType> = React.ComponentPropsWithoutRef<C>;
type PrimitiveClassName<C extends React.ElementType> = PrimitiveProps<C> extends { className?: infer ClassName }
  ? ClassName
  : string;
type StyledProps<C extends React.ElementType> = Omit<PrimitiveProps<C>, 'className'> & {
  className?: PrimitiveClassName<C>;
};

type ClassNameOverride = string | ((state: any) => string | undefined);

const joinClassNames = (baseClassName: string, consumerClassName?: ClassNameOverride) => {
  if (typeof consumerClassName === 'function') {
    return (state: any) => {
      const resolvedClassName = consumerClassName(state);
      return resolvedClassName ? `${baseClassName} ${resolvedClassName}` : baseClassName;
    };
  }
  return consumerClassName ? `${baseClassName} ${consumerClassName}` : baseClassName;
};

function styledPart<C extends React.ElementType>(Primitive: C, baseClassName: string) {
  type Props = StyledProps<C>;
  const Component = React.forwardRef<React.ComponentRef<C>, Props>((componentProps, ref) => {
    const { className, ...props } = componentProps as Props;
    return React.createElement(Primitive, {
      ...props,
      ref,
      className: joinClassNames(baseClassName, className as ClassNameOverride | undefined),
    } as React.ComponentPropsWithRef<C>);
  });
  Component.displayName = `Styled(${typeof Primitive === 'string' ? Primitive : Primitive.displayName ?? Primitive.name ?? 'BasePart'})`;
  return Component;
}

function styledTag<C extends keyof React.JSX.IntrinsicElements>(tag: C, baseClassName: string) {
  return styledPart(tag, baseClassName);
}

type ButtonProps = React.ComponentPropsWithoutRef<typeof ButtonPrimitive> & {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

function styledButton(baseClassName: string) {
  const Component = React.forwardRef<HTMLElement, ButtonProps>(({ className, ...props }, ref) =>
    React.createElement(ButtonPrimitive, {
      ...props,
      ref,
      className: joinClassNames(baseClassName, className as ClassNameOverride | undefined),
    } as React.ComponentPropsWithRef<typeof ButtonPrimitive>),
  );
  Component.displayName = 'Styled(BaseButton)';
  return Component;
}

/** Base UI button with enterprise token styling. All native and Base UI props pass through. */
export const Button = styledButton(styles.button);
export const IconButton = styledButton(styles.iconButton);
export const Toggle = styledPart(TogglePrimitive, styles.chip);
export const IconToggle = styledPart(TogglePrimitive, styles.iconButton);

export const Checkbox = {
  ...CheckboxPrimitive,
  Root: styledPart(CheckboxPrimitive.Root, styles.checkboxRoot),
  Indicator: styledPart(CheckboxPrimitive.Indicator, styles.checkboxIndicator),
};

export const Switch = {
  ...SwitchPrimitive,
  Root: styledPart(SwitchPrimitive.Root, styles.switchRoot),
  Thumb: styledPart(SwitchPrimitive.Thumb, styles.switchThumb),
};

export const Radio = {
  ...RadioPrimitive,
  Root: styledPart(RadioPrimitive.Root, styles.radioRoot),
  Indicator: styledPart(RadioPrimitive.Indicator, styles.radioIndicator),
};
export const RadioGroup = styledPart(RadioGroupPrimitive, styles.radioGroupRoot);

export const Slider = {
  ...SliderPrimitive,
  Root: styledPart(SliderPrimitive.Root, styles.sliderRoot),
  Control: styledPart(SliderPrimitive.Control, styles.sliderControl),
  Track: styledPart(SliderPrimitive.Track, styles.sliderTrack),
  Indicator: styledPart(SliderPrimitive.Indicator, styles.sliderIndicator),
  Thumb: styledPart(SliderPrimitive.Thumb, styles.sliderThumb),
};

export const Progress = {
  ...ProgressPrimitive,
  Root: styledPart(ProgressPrimitive.Root, styles.progressRoot),
  Track: styledPart(ProgressPrimitive.Track, styles.progressTrack),
  Indicator: styledPart(ProgressPrimitive.Indicator, styles.progressIndicator),
};

export const Tabs = {
  ...TabsPrimitive,
  Root: styledPart(TabsPrimitive.Root, styles.tabsRoot),
  List: styledPart(TabsPrimitive.List, styles.tabsList),
  Tab: styledPart(TabsPrimitive.Tab, styles.tabItem),
  Panel: styledPart(TabsPrimitive.Panel, styles.tabPanel),
};

export const Tooltip = {
  ...TooltipPrimitive,
  Root: TooltipPrimitive.Root,
  Provider: TooltipPrimitive.Provider,
  Trigger: styledPart(TooltipPrimitive.Trigger, styles.popoverTrigger),
  Portal: TooltipPrimitive.Portal,
  Positioner: TooltipPrimitive.Positioner,
  Popup: styledPart(TooltipPrimitive.Popup, styles.tooltipPopup),
};

export const Accordion = {
  ...AccordionPrimitive,
  Root: styledPart(AccordionPrimitive.Root, styles.accordionRoot),
  Item: styledPart(AccordionPrimitive.Item, styles.accordionItem),
  Header: AccordionPrimitive.Header,
  Trigger: styledPart(AccordionPrimitive.Trigger, styles.accordionTrigger),
  Panel: styledPart(AccordionPrimitive.Panel, styles.accordionPanel),
};

export const Collapsible = {
  ...CollapsiblePrimitive,
  Root: styledPart(CollapsiblePrimitive.Root, styles.collapsibleRoot),
  Trigger: styledPart(CollapsiblePrimitive.Trigger, styles.collapsibleTrigger),
  Panel: styledPart(CollapsiblePrimitive.Panel, styles.collapsiblePanel),
};

export const Menu = {
  ...MenuPrimitive,
  Root: MenuPrimitive.Root,
  Trigger: styledPart(MenuPrimitive.Trigger, styles.popoverTrigger),
  IconTrigger: styledPart(MenuPrimitive.Trigger, styles.iconButton),
  Portal: MenuPrimitive.Portal,
  Positioner: styledPart(MenuPrimitive.Positioner, styles.positioner),
  Popup: styledPart(MenuPrimitive.Popup, styles.menuPopup),
  Item: styledPart(MenuPrimitive.Item, styles.menuItem),
  Separator: MenuPrimitive.Separator,
};

export const Popover = {
  ...PopoverPrimitive,
  Root: PopoverPrimitive.Root,
  Trigger: styledPart(PopoverPrimitive.Trigger, styles.popoverTrigger),
  Portal: PopoverPrimitive.Portal,
  Positioner: styledPart(PopoverPrimitive.Positioner, styles.positioner),
  Popup: styledPart(PopoverPrimitive.Popup, styles.popoverPopup),
  Arrow: styledPart(PopoverPrimitive.Arrow, styles.popoverArrow),
  Title: styledPart(PopoverPrimitive.Title, styles.popoverTitle),
  Description: styledPart(PopoverPrimitive.Description, styles.popoverDescription),
  Close: styledPart(PopoverPrimitive.Close, styles.button),
};

export const Dialog = {
  ...DialogPrimitive,
  Root: DialogPrimitive.Root,
  Trigger: styledPart(DialogPrimitive.Trigger, styles.dialogTrigger),
  ButtonTrigger: styledPart(DialogPrimitive.Trigger, styles.button),
  Portal: DialogPrimitive.Portal,
  Backdrop: styledPart(DialogPrimitive.Backdrop, styles.dialogBackdrop),
  Popup: styledPart(DialogPrimitive.Popup, styles.dialogPopup),
  Title: styledPart(DialogPrimitive.Title, styles.dialogTitle),
  Description: styledPart(DialogPrimitive.Description, styles.dialogDescription),
  Close: styledPart(DialogPrimitive.Close, styles.button),
};

export const Field = {
  ...FieldPrimitive,
  Root: styledPart(FieldPrimitive.Root, styles.fieldRoot),
  Label: styledPart(FieldPrimitive.Label, styles.fieldLabel),
  Description: styledPart(FieldPrimitive.Description, styles.fieldHelp),
  Error: styledPart(FieldPrimitive.Error, styles.fieldError),
};
export const Input = styledPart(InputPrimitive, styles.fieldInput);
export const SelectControl = styledTag('select', styles.fieldInput);

export const Select = {
  ...SelectPrimitive,
  Root: SelectPrimitive.Root,
  Trigger: styledPart(SelectPrimitive.Trigger, styles.selectTrigger),
  Value: SelectPrimitive.Value,
  Icon: SelectPrimitive.Icon,
  Portal: SelectPrimitive.Portal,
  Positioner: styledPart(SelectPrimitive.Positioner, styles.positioner),
  Popup: styledPart(SelectPrimitive.Popup, styles.selectPopup),
  Item: styledPart(SelectPrimitive.Item, styles.selectItem),
  ItemIndicator: SelectPrimitive.ItemIndicator,
  ItemText: SelectPrimitive.ItemText,
};

export const ToggleGroup = styledPart(ToggleGroupPrimitive, styles.chipGroup);

export const List = styledTag('ul', styles.list);
export const ListItem = styledTag('li', styles.listItem);
export const ListOption = styledTag('button', styles.listOption);
export const ListLead = styledTag('span', styles.listLead);
export const ListText = styledTag('span', styles.listText);
export const ListHeadline = styledTag('span', styles.listHeadline);
export const ListSupport = styledTag('span', styles.listSupport);
export const ListMeta = styledTag('span', styles.listMeta);
export const ChipInput = styledTag('span', styles.chipInput);
export const ChipRemove = styledTag('button', styles.chipRemove);
export const ChipCheck = styledTag('span', styles.chipCheck);
export const CheckboxCard = styledTag('label', styles.checkboxCard);
export const RadioCard = styledTag('label', styles.radioCard);
export const CheckboxLabel = styledTag('label', styles.checkboxLabel);
export const SwitchLabel = styledTag('label', styles.switchContainer);
export const SwitchText = styledTag('span', styles.switchLabel);
export const RadioLabel = styledTag('label', styles.radioLabel);
export const AccordionChevron = styledTag('span', styles.accordionChevron);
export const DialogActions = styledTag('div', styles.dialogActions);
