import React from 'react';
import { Button } from '@base-ui-components/react/button';
import { Tabs } from '@base-ui-components/react/tabs';
import { BASE_UI_COMPONENTS } from '../../design-system/baseUIComponentsList';
import { DuotoneIcon } from '../Icons/DuotoneIcon';
import styles from './Sidebar.module.css';

export type AppMode = 'base-ui' | 'fluent-ui';

interface SidebarProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  selectedBaseUIComponent: string;
  onSelectBaseUIComponent: (id: string) => void;
}

const MODE_TABS: { id: AppMode; label: string }[] = [
  { id: 'base-ui', label: 'Base UI' },
  { id: 'fluent-ui', label: 'Fluent UI' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  mode,
  onModeChange,
  selectedBaseUIComponent,
  onSelectBaseUIComponent,
}) => {
  const isFluent = mode === 'fluent-ui';

  return (
    <aside className={styles.sidebar} aria-label="Sidebar">
      <div className={styles.brandRow}>
        <DuotoneIcon name="layers" tone="mint" size={20} />
        <span className={styles.brandWordmark}>Design systems</span>
      </div>

      <Tabs.Root className={styles.modeTabsWrapper} value={mode} onValueChange={(value) => onModeChange(value as AppMode)}>
        <Tabs.List className={styles.modeTabs} aria-label="Sidebar mode" activateOnFocus>
          {MODE_TABS.map((tab) => (
            <Tabs.Tab key={tab.id} value={tab.id} className={styles.modeTab}>
              {tab.label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className={styles.modeTabsIndicator} />
        </Tabs.List>
      </Tabs.Root>

      <Button
        className={styles.topicButton}
        aria-label="Task workspace demo"
        data-active={selectedBaseUIComponent === 'workspace'}
        aria-current={selectedBaseUIComponent === 'workspace' ? 'page' : undefined}
        onClick={() => onSelectBaseUIComponent('workspace')}
      >
        <span className={styles.iconWrapper}><DuotoneIcon name="layout" tone="mint" size={18} /></span>
        <span className={styles.contentWrapper}>
          <span className={styles.topicTitle}>Task workspace</span>
          <span className={styles.topicMeta}>All components in a working interface</span>
        </span>
      </Button>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{isFluent ? 'Fluent UI components' : 'Base UI primitives'}</h2>
        <span className={styles.sectionCount}>{BASE_UI_COMPONENTS.length}</span>
      </div>

      <nav aria-label={isFluent ? 'Fluent UI components' : 'Base UI components'}>
        <ul className={styles.topicList}>
          {BASE_UI_COMPONENTS.map((component) => {
            const isActive = selectedBaseUIComponent === component.id;
            return (
              <li key={component.id}>
                <Button
                  className={styles.topicButton}
                  data-active={isActive}
                  onClick={() => onSelectBaseUIComponent(component.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.iconWrapper}>
                    <DuotoneIcon
                      name={
                        ['switch', 'checkbox', 'radio', 'buttons', 'chips', 'icon-buttons', 'select', 'text-field'].includes(component.id)
                          ? 'sliders'
                          : ['dialog', 'popover', 'tooltip'].includes(component.id)
                            ? 'contrast'
                            : ['tabs', 'accordion', 'collapsible', 'lists'].includes(component.id)
                              ? 'layout'
                              : 'layers'
                      }
                      tone={isActive ? 'mint' : 'monochrome'}
                      size={18}
                    />
                  </span>
                  <span className={styles.contentWrapper}>
                    <span className={styles.titleRow}>
                      <span className={styles.topicTitle}>{component.name}</span>
                      <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                        {component.category.split(' ')[0]}
                      </span>
                    </span>
                    <span className={styles.topicMeta}>
                      <span className="truncate">{component.tagline}</span>
                    </span>
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className={styles.sidebarFooter}>
        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span>Architecture</span>
          <span className="font-mono text-[#1d4ed8]">{isFluent ? '@layer components.fluent' : '@layer components'}</span>
        </div>
        <p className={styles.footerNote}>
          {isFluent
            ? 'Headless Fluent components styled with CSS modules and cascade layers from shared design tokens.'
            : 'Unstyled DOM contracts styled via shared tokens and cascade layers.'}
        </p>
      </footer>
    </aside>
  );
};
