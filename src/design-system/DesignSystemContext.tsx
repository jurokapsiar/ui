import React, { createContext, useCallback, useContext, useState } from 'react';
import { ThemeProvider, useTheme, type ThemeContextValue } from './core';

interface DesignSystemContextValue extends ThemeContextValue {
  isTokenPaneOpen: boolean;
  selectedComponentId: string;
  setTokenPaneOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectComponent: (id: string) => void;
}

const PANE_STORAGE_KEY = 'ui-design-systems.tokenPane.open';

const readPaneOpen = (): boolean => {
  try {
    return window.localStorage.getItem(PANE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const DesignSystemContext = createContext<DesignSystemContextValue | null>(null);

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider><ShowcaseDesignSystemProvider>{children}</ShowcaseDesignSystemProvider></ThemeProvider>;
};

const ShowcaseDesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [isTokenPaneOpen, setTokenPaneOpenState] = useState<boolean>(readPaneOpen);
  const [selectedComponentId, setSelectedComponentId] = useState<string>('switch');

  const setTokenPaneOpen = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    setTokenPaneOpenState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      try {
        window.localStorage.setItem(PANE_STORAGE_KEY, value ? '1' : '0');
      } catch {
        // Storage can be unavailable (private mode); the state still works for this page load.
      }
      return value;
    });
  }, []);

  return (
    <DesignSystemContext.Provider
      value={{
        ...theme,
        isTokenPaneOpen,
        selectedComponentId,
        setTokenPaneOpen,
        selectComponent: setSelectedComponentId,
      }}
    >
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = (): DesignSystemContextValue => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};
