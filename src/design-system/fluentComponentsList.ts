export interface FluentComponentMeta {
  id: string;
  fluentComponents: string[];
  package: string;
}

const PACKAGE = '@fluentui/react-headless-components-preview';

/** Headless Fluent counterpart of every entry in BASE_UI_COMPONENTS, keyed by the same id. */
export const FLUENT_COMPONENTS: FluentComponentMeta[] = [
  { id: 'switch', fluentComponents: ['Switch'], package: PACKAGE },
  { id: 'popover', fluentComponents: ['Popover', 'PopoverTrigger', 'PopoverSurface'], package: PACKAGE },
  { id: 'dialog', fluentComponents: ['Dialog', 'DialogSurface', 'DialogBody'], package: PACKAGE },
  { id: 'slider', fluentComponents: ['Slider'], package: PACKAGE },
  { id: 'checkbox', fluentComponents: ['Checkbox'], package: PACKAGE },
  { id: 'tabs', fluentComponents: ['TabList', 'Tab'], package: PACKAGE },
  { id: 'tooltip', fluentComponents: ['Tooltip'], package: PACKAGE },
  { id: 'accordion', fluentComponents: ['Accordion', 'AccordionItem'], package: PACKAGE },
  { id: 'menu', fluentComponents: ['Menu', 'MenuItem'], package: PACKAGE },
  { id: 'progress', fluentComponents: ['ProgressBar'], package: PACKAGE },
  { id: 'radio', fluentComponents: ['RadioGroup', 'Radio'], package: PACKAGE },
  { id: 'collapsible', fluentComponents: ['Button', 'aria-expanded region'], package: PACKAGE },
  { id: 'buttons', fluentComponents: ['Button'], package: PACKAGE },
  { id: 'chips', fluentComponents: ['TagGroup', 'InteractionTag', 'Tag'], package: PACKAGE },
  { id: 'icon-buttons', fluentComponents: ['Button', 'ToggleButton'], package: PACKAGE },
  { id: 'lists', fluentComponents: ['List', 'ListItem'], package: PACKAGE },
  { id: 'select', fluentComponents: ['Dropdown', 'Option', 'Field'], package: PACKAGE },
  { id: 'text-field', fluentComponents: ['Field', 'Input'], package: PACKAGE },
];
