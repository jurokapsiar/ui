import { createContext, useContext } from 'react';

export type FluentControlSize = 'small' | 'medium' | 'large';

const px = (value: string, fallback: number) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};

/** The headless components have no density token, so the touch-target setting picks the control size instead. */
export function controlSizeFromTouchTarget(touchTargetMin: string): FluentControlSize {
  const n = px(touchTargetMin, 44);
  if (n >= 44) return 'large';
  if (n >= 32) return 'medium';
  return 'small';
}

/** Control size derived from the touch-target token; every wrapper reads it as its default `size`. */
export const FluentSizeContext = createContext<FluentControlSize>('large');

export const useFluentSize = () => useContext(FluentSizeContext);
