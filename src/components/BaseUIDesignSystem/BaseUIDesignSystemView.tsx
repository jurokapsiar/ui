import React from 'react';
import { useDesignSystem } from '../../design-system/DesignSystemContext';
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

export const BaseUIDesignSystemView: React.FC = () => {
  const { selectedComponentId } = useDesignSystem();

  const renderComponentDemo = () => {
    switch (selectedComponentId) {
      case 'switch':
        return <SwitchDemo />;
      case 'popover':
        return <PopoverDemo />;
      case 'dialog':
        return <DialogDemo />;
      case 'slider':
        return <SliderDemo />;
      case 'checkbox':
        return <CheckboxDemo />;
      case 'tabs':
        return <TabsDemo />;
      case 'tooltip':
        return <TooltipDemo />;
      case 'accordion':
        return <AccordionDemo />;
      case 'menu':
        return <MenuDemo />;
      case 'progress':
        return <ProgressDemo />;
      case 'radio':
        return <RadioDemo />;
      case 'collapsible':
        return <CollapsibleDemo />;
      case 'buttons':
        return <ButtonsDemo />;
      case 'chips':
        return <ChipsDemo />;
      case 'icon-buttons':
        return <IconButtonsDemo />;
      case 'lists':
        return <ListsDemo />;
      case 'select':
        return <SelectDemo />;
      case 'text-field':
        return <TextFieldDemo />;
      default:
        return <SwitchDemo />;
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-[var(--color-neutral-bg,#ffffff)] text-[var(--color-neutral-text,#111113)]"
      style={{ fontFamily: 'var(--font-family-body, inherit)' }}
    >
      <TokenPaneShell libraryName="Base UI">{renderComponentDemo()}</TokenPaneShell>
    </div>
  );
};
