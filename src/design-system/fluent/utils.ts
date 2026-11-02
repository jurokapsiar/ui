import { isValidElement } from 'react';

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/** Adds a class to a headless slot value, whether the caller passed text, props or nothing. */
export const withSlotClass = <T,>(slot: T, className: string): T => {
  if (typeof slot === 'string' || typeof slot === 'number') {
    return { children: slot, className } as T;
  }
  if (slot === null || typeof slot !== 'object' || Array.isArray(slot) || isValidElement(slot)) return slot;
  const slotProps = slot as { className?: string };
  return { ...slotProps, className: cx(className, slotProps.className) } as T;
};

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, Extract<K, keyof T>> : never;
