import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { THEME_PRESETS, ThemePreset, ThemeTokens } from './themeTokens';
import { TOKEN_VARS } from './tokenExport';

interface DesignSystemContextValue {
  activePresetId: string;
  activePreset: ThemePreset;
  tokens: ThemeTokens;
  isTokenPaneOpen: boolean;
  selectedComponentId: string;
  setTokenPaneOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectPreset: (presetId: string) => void;
  updateToken: <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => void;
  updateTokens: (patch: Partial<ThemeTokens>) => void;
  /** Restores the preset values for the given keys, or every token when omitted. */
  resetTokens: (keys?: readonly (keyof ThemeTokens)[]) => void;
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

const findPreset = (id: string) => THEME_PRESETS.find((p) => p.id === id) || THEME_PRESETS[0];

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePresetId, setActivePresetId] = useState<string>('enterprise');
  const [isTokenPaneOpen, setTokenPaneOpenState] = useState<boolean>(readPaneOpen);
  const [selectedComponentId, setSelectedComponentId] = useState<string>('switch');

  const activePreset = useMemo(() => findPreset(activePresetId), [activePresetId]);

  // Customizable tokens (starts from active preset)
  const [tokens, setTokens] = useState<ThemeTokens>(activePreset.tokens);

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

  // Selecting a preset resets customized tokens to that preset's baseline
  const selectPreset = (presetId: string) => {
    const target = THEME_PRESETS.find((p) => p.id === presetId);
    if (target) {
      setActivePresetId(presetId);
      setTokens({ ...target.tokens });
    }
  };

  const updateToken = <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  };

  const updateTokens = (patch: Partial<ThemeTokens>) => {
    setTokens((prev) => ({ ...prev, ...patch }));
  };

  const resetTokens = (keys?: readonly (keyof ThemeTokens)[]) => {
    const base = findPreset(activePresetId).tokens;
    if (!keys) {
      setTokens({ ...base });
      return;
    }
    setTokens((prev) => {
      const next = { ...prev };
      for (const key of keys) (next as Record<string, unknown>)[key] = base[key];
      return next;
    });
  };

  // Sync token CSS variables into the document root
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, name] of TOKEN_VARS) {
      const value = tokens[key];
      if (value) root.style.setProperty(name, value as string);
      else root.style.removeProperty(name);
    }
    root.dataset.dsPreset = activePresetId;
  }, [tokens, activePresetId]);

  return (
    <DesignSystemContext.Provider
      value={{
        activePresetId,
        activePreset,
        tokens,
        isTokenPaneOpen,
        selectedComponentId,
        setTokenPaneOpen,
        selectPreset,
        updateToken,
        updateTokens,
        resetTokens,
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
