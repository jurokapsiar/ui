import { describe, expect, it } from 'vitest';
import {
  colorToHex,
  contrastRatio,
  contrastVerdict,
  formatOklch,
  hexToOklchString,
  hexToRgb,
  parseOklch,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
} from './colorConvert';

describe('colour conversion', () => {
  it('round-trips hex through OKLCH without drift', () => {
    for (const hex of ['#000000', '#ffffff', '#2563eb', '#059669', '#ff0000', '#7f7f7f', '#f5f0e8']) {
      expect(rgbToHex(oklchToRgb(rgbToOklch(hexToRgb(hex)!)))).toBe(hex);
    }
  });

  it('stays within one level per channel through the rounded string form', () => {
    const hex = '#2563eb';
    const back = hexToRgb(colorToHex(hexToOklchString(hex)!)!)!;
    const orig = hexToRgb(hex)!;
    expect(Math.abs(back.r - orig.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - orig.g)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - orig.b)).toBeLessThanOrEqual(1);
  });

  it('matches known reference values', () => {
    expect(formatOklch(rgbToOklch(hexToRgb('#ff0000')!))).toBe('oklch(0.628 0.258 29.2)');
    expect(colorToHex('oklch(1 0 0)')).toBe('#ffffff');
    expect(colorToHex('oklch(0 0 0)')).toBe('#000000');
  });

  it('parses percentages, alpha and shorthand hex, and rejects non-colours', () => {
    expect(parseOklch('oklch(50% 0.1 120 / 0.5)')).toEqual({ l: 0.5, c: 0.1, h: 120 });
    expect(colorToHex('#fff')).toBe('#ffffff');
    expect(colorToHex('color-mix(in oklch, red 10%, white)')).toBeNull();
    expect(colorToHex('not a colour')).toBeNull();
  });
});

describe('contrast', () => {
  it('computes WCAG ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });

  it('is symmetric and accepts OKLCH', () => {
    expect(contrastRatio('oklch(0.2 0 0)', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', 'oklch(0.2 0 0)')!, 8);
  });

  it('returns a worded verdict, not just a colour', () => {
    expect(contrastVerdict('#777777', '#ffffff', 4.5)).toMatchObject({ pass: false, label: '4.47:1 Fail (needs 4.5:1)' });
    expect(contrastVerdict('#000000', '#ffffff', 4.5)).toMatchObject({ pass: true, label: '21.00:1 Pass (needs 4.5:1)' });
    expect(contrastVerdict('color-mix(in oklch, red, blue)', '#fff', 3)).toBeNull();
  });
});
