import React from 'react';
import { useDesignSystem } from '../../design-system/DesignSystemContext';
import { FluentProvider } from '../../design-system/fluent';
import { TokenPaneShell } from '../TokenPane/TokenPaneShell';
import { SwitchDemo } from './demos/SwitchDemo';
import { PopoverDemo } from './demos/PopoverDemo';
import { DialogDemo } from './demos/DialogDemo';
import { SliderDemo } from './demos/SliderDemo';
import { CheckboxDemo } from './demos/CheckboxDemo';
import { TabsDemo } from './demos/TabsDemo';
import { TooltipDemo } from './demos/TooltipDemo';
import { AccordionDemo } from './demos/AccordionDemo';
import { MenuDemo } from './demos/MenuDemo';
import { ProgressDemo } from './demos/ProgressDemo';
import { RadioDemo } from './demos/RadioDemo';
import { CollapsibleDemo } from './demos/CollapsibleDemo';
import { ButtonsDemo } from './demos/ButtonsDemo';
import { ChipsDemo } from './demos/ChipsDemo';
import { IconButtonsDemo } from './demos/IconButtonsDemo';
import { ListsDemo } from './demos/ListsDemo';
import { SelectDemo } from './demos/SelectDemo';
import { TextFieldDemo } from './demos/TextFieldDemo';
import { FluentTaskWorkspace } from '../TaskWorkspace/FluentTaskWorkspace';
import styles from './FluentDemos.module.css';

const DEMOS: Record<string, React.FC> = {
  workspace: FluentTaskWorkspace,
  switch: SwitchDemo,
  popover: PopoverDemo,
  dialog: DialogDemo,
  slider: SliderDemo,
  checkbox: CheckboxDemo,
  tabs: TabsDemo,
  tooltip: TooltipDemo,
  accordion: AccordionDemo,
  menu: MenuDemo,
  progress: ProgressDemo,
  radio: RadioDemo,
  collapsible: CollapsibleDemo,
  buttons: ButtonsDemo,
  chips: ChipsDemo,
  'icon-buttons': IconButtonsDemo,
  lists: ListsDemo,
  select: SelectDemo,
  'text-field': TextFieldDemo,
};

export const FluentDesignSystemView: React.FC = () => {
  const { selectedComponentId } = useDesignSystem();
  const Demo = DEMOS[selectedComponentId] ?? SwitchDemo;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-neutral-bg,#ffffff)] text-[var(--color-neutral-text,#111113)]">
      <TokenPaneShell libraryName="Fluent UI">
        <div className={styles.fluentRoot}>
          <FluentProvider>
            <Demo />
          </FluentProvider>
        </div>
      </TokenPaneShell>
    </div>
  );
};
