import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './theme.css';
import { THEME_PRESETS, type ThemePreset, type ThemeTokens } from './themeTokens';
import { TOKEN_VARS } from './tokenExport';

export interface ThemeContextValue {
  tokens: ThemeTokens;
  activePresetId: string;
  activePreset: ThemePreset;
  selectPreset: (presetId: string) => void;
  updateToken: <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => void;
  updateTokens: (patch: Partial<ThemeTokens>) => void;
  resetTokens: (keys?: readonly (keyof ThemeTokens)[]) => void;
}

const DEFAULT_PRESET_ID = 'enterprise';
const ThemeContext = createContext<ThemeContextValue | null>(null);

const getPreset = (presetId: string): ThemePreset =>
  THEME_PRESETS.find((preset) => preset.id === presetId) ?? THEME_PRESETS[0];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePresetId, setActivePresetId] = useState(DEFAULT_PRESET_ID);
  const activePreset = useMemo(() => getPreset(activePresetId), [activePresetId]);
  const [tokens, setTokens] = useState<ThemeTokens>(() => ({ ...getPreset(DEFAULT_PRESET_ID).tokens }));
  const rootRef = useRef<HTMLElement | null>(null);

  const selectPreset = useCallback((presetId: string) => {
    const preset = THEME_PRESETS.find((candidate) => candidate.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setTokens({ ...preset.tokens });
  }, []);

  const updateToken = useCallback(<K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => {
    setTokens((current) => ({ ...current, [key]: value }));
  }, []);

  const updateTokens = useCallback((patch: Partial<ThemeTokens>) => {
    setTokens((current) => ({ ...current, ...patch }));
  }, []);

  const resetTokens = useCallback((keys?: readonly (keyof ThemeTokens)[]) => {
    const defaults = getPreset(activePresetId).tokens;
    if (!keys) {
      setTokens({ ...defaults });
      return;
    }
    setTokens((current) => {
      const next = { ...current };
      for (const key of keys) (next as Record<string, unknown>)[key] = defaults[key];
      return next;
    });
  }, [activePresetId]);

  useEffect(() => {
    const root = document.documentElement;
    rootRef.current = root;
    const previousTokens = TOKEN_VARS.map(([, name]) => ({
      name,
      value: root.style.getPropertyValue(name),
      priority: root.style.getPropertyPriority(name),
    }));
    const hadPreset = root.hasAttribute('data-ds-preset');
    const previousPreset = root.getAttribute('data-ds-preset');

    return () => {
      for (const { name, value, priority } of previousTokens) {
        if (value) root.style.setProperty(name, value, priority);
        else root.style.removeProperty(name);
      }
      if (hadPreset) root.setAttribute('data-ds-preset', previousPreset ?? '');
      else root.removeAttribute('data-ds-preset');
      rootRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    for (const [key, name] of TOKEN_VARS) {
      const value = tokens[key];
      if (value) root.style.setProperty(name, value as string);
      else root.style.removeProperty(name);
    }
    root.dataset.dsPreset = activePresetId;
  }, [tokens, activePresetId]);

  const value = useMemo<ThemeContextValue>(() => ({
    tokens,
    activePresetId,
    activePreset,
    selectPreset,
    updateToken,
    updateTokens,
    resetTokens,
  }), [tokens, activePresetId, activePreset, selectPreset, updateToken, updateTokens, resetTokens]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within a ThemeProvider');
  return theme;
};
